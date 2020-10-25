const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

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
  });
};

exports.postLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/store/auth/login');
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/store/auth/login');
    } else {
      req.session.isLoggedIn = true;
      req.session.user = user;
      await req.session.save();
      res.redirect('/store');
    }
  } catch (error) {
    console.log(error);
  }
};

exports.postLogout = async (req, res) => {
  try {
    await req.session.destroy();
    res.redirect('/store');
  } catch (error) {
    console.log(error);
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
  });
};

exports.postSignup = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password != confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/store/auth/signup');
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.findOne({ email: email });

    if (user) {
      req.flash('error', 'This email address is already in use.');
      return res.redirect('/store/auth/signup');
    }

    const newUser = new User({ ...req.body, password: hash, level: 2 });

    await newUser.save();

    res.redirect('/store/auth/login');

    transporter.sendMail({
      to: email,
      from: 'vladimirzhd.v@gmail.com',
      subject: 'Welcome to the Shop',
      html: '<h1>Welcome, you successfully regestered an account!</h1>',
    });
  } catch (error) {
    console.log(error);
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

exports.postReset = async (req, res) => {
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
      from: 'vladimirzhd.v@gmail.com',
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset!</p>
        <p>Click this <a href='${req.protocol}://${req.headers.host}/store/auth/reset/${token}'>link</a> to set a new password.</p>
      `,
    });
  } catch (error) {
    console.log(error);
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
    });
  } catch (error) {
    console.error(error);
  }
};
