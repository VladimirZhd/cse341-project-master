// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000

const mongoConnect = require('./routes/store/util/database').mongoConnect;

const app = express();

// Route setup. You can implement more in the future!
const routes = require('./routes');
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json()) // For parsing the body of a POST
  .use('/', routes);

mongoConnect(() => {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
});
