const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const config = require('config');

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
    isAuthenticated: false,
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
    isAuthenticated: false,
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
      from: 'zhd18001@byui.edu',
      subject: 'Welcome to the Shop',
      html: '<h1>Welcome, you successfully regestered an account!</h1>',
    });
  } catch (error) {
    console.log(error);
  }
};
