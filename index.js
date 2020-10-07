// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./routes/store/models/user');
const path = require('path');
const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000

const mongoose = require('mongoose');
const config = require('config');

const app = express();

// Route setup. You can implement more in the future!
const routes = require('./routes');
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json()) // For parsing the body of a POST
  .use((req, res, next) => {
    User.findById('5f7e1caa554ea5154d7d2b3a')
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
    next();
  })
  .use('/', routes);

mongoose.connect(config.get('mongoURI'), { useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
  User.findOne().then(user => {
    if (!user) {
      const user = new User({
        name: 'Vova',
        email: 'vova@test.com',
        cart: {
          items: []
        }
      })
      user.save();
    }
  }).catch(err => console.log(err));
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}).catch(err => {
  console.log(err);
})
