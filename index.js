// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./routes/store/models/user');
const path = require('path');
const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000

const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');

const corsOptions = {
  origin: 'https://cse341vovazhdanov.herokuapp.com/',
  optionSuccessStatus: 200,
};

const MONGODB_URL = process.env.MONGODB_URL || config.get('mongoURI');

const app = express();

app.use(cors(corsOptions));

// Route setup. You can implement more in the future!
const routes = require('./routes');
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json()) // For parsing the body of a POST
  .use(async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: '5f82439667d9402b78a7d4f7' });
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      next();
    }
  })
  .use('/', routes);

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(result => {
    User.findOne()
      .then(user => {
        if (!user) {
          const user = new User({
            name: 'Vova',
            email: 'vova@test.com',
            cart: {
              items: [],
            },
          });
          user.save();
        }
      })
      .catch(err => console.log(err));
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });
