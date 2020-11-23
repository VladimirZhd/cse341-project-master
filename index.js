// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./routes/store/models/user');
const path = require('path');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000
const corsOptions = {
  origin: 'https://cse341vovazhdanov.herokuapp.com/',
  optionSuccessStatus: 200,
};
const MONGODB_URL = process.env.MONGODB_URL || config.get('mongoURI');
const store = new mongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions',
});

const csrfProtection = csrf();

const app = express();

app.use(cors(corsOptions));

// Route setup. You can implement more in the future!
const routes = require('./routes');

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
  })
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json()) // For parsing the body of a POST
  .use(session({ secret: 'njahsdvevuaskdkhfg', resave: false, saveUninitialized: false, store: store }))
  // .use(csrfProtection)
  .use(flash())
  .use(async (req, res, next) => {
    try {
      if (!req.session.user) {
        return next();
      }
      const user = await User.findById(req.session.user._id);
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      next(new Error(error));
    }
  })
  .use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    // res.locals.csrfToken = req.csrfToken();
    if (!req.session.user) {
      res.locals.level = 2;
      return next();
    } else {
      res.locals.level = req.session.user.level;
    }
    next();
  })
  .use('/', routes);

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(result => {
    const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    const io = require('socket.io')(server);
    io.on('connection', socket => {
      console.log('a user Connected');
      socket.on('new name', (msg) => {
        console.log('message: ' + msg);
        io.emit('new name', msg);
      })
    })
  })
  .catch(err => {
    console.log(err);
  });
