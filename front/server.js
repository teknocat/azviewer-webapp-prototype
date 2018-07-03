// Create React App with Express in Production
// https://daveceddia.com/create-react-app-express-production/

const path = require('path')
const express = require('express');
const morgan = require('morgan');
const app = express();

// logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('combined'));
}

// Serve static files from the React app
app.use(
  '/',
  express.static(path.join(__dirname, '/dist'))
);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);