const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const SEND_GRID_API = process.env.SEND_GRID_API;

const transporter = nodeMailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SEND_GRID_API,
    },
  })
);

exports.getLogin = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('pages/store/auth/login', {
    path: '/store/auth/login',
    pageTitle: 'Login',
    error: message,
    oldInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('pages/store/auth/login', {
        path: '/store/auth/login',
        pageTitle: 'Login',
        error: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: errors.array(),
      });
    }
    if (!user) {
      return res.status(422).render('pages/store/auth/login', {
        path: '/store/auth/login',
        pageTitle: 'Login',
        error: 'Invalid credentials',
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: [],
      });
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(422).render('pages/store/auth/login', {
        path: '/store/auth/login',
        pageTitle: 'Login',
        error: 'Invalid credentials',
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: [],
      });
    } else {
      req.session.isLoggedIn = true;
      req.session.user = user;
      await req.session.save();
      res.redirect('/store');
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.redirect('/store');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getSignup = async (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('pages/store/auth/signup', {
    path: '/store/auth/signup',
    pageTitle: 'Signup',
    error: message,
    oldInput: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('pages/store/auth/signup', {
        path: '/store/auth/signup',
        pageTitle: 'Signup',
        error: errors.array()[0].msg,
        oldInput: { name: req.body.name, email: email, password: password, confirmPassword: req.body.confirmPassword },
        validationErrors: errors.array(),
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ ...req.body, password: hash, level: 2 });
    await newUser.save();
    res.redirect('/store/auth/login');
    transporter.sendMail({
      to: email,
      from: 'zhd18001@byui.edu',
      subject: 'Welcome to the Shop',
      html: '<h1>Welcome, you successfully regestered an account!</h1>',
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getReset = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('pages/store/auth/reset', {
    path: '/store/auth/reset',
    pageTitle: 'Login',
    error: message,
  });
};

exports.postReset = async (req, res, next) => {
  try {
    const buffer = await crypto.randomBytes(32);
    if (!buffer) {
      return req.redirect('/store/auth/reset');
    }

    const token = buffer.toString('hex');
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash('error', 'No account with that email found.');
      return res.redirect('/store/auth/reset');
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();
    res.redirect('/store');
    transporter.sendMail({
      to: req.body.email,
      from: 'zhd18001@byui.edu',
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset!</p>
        <p>Click this <a href='${req.protocol}://${req.headers.host}/store/auth/reset/${token}'>link</a> to set a new password.</p>
      `,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getNewPassword = async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

    if (!user) {
      return res.redirect('/store');
    }

    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('pages/store/auth/new-password', {
      path: '/store/auth/new-password',
      pageTitle: 'New Password',
      error: message,
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const token = req.body.passwordToken;

    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }, _id: userId });

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      user.save();
    }
    res.redirect('/store/auth/login');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
