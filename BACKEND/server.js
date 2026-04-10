require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes/index');
const errorMiddleware = require('./middleware/error');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Error handling (must be last)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`PBI Studio Backend running on port ${PORT}`);
});

module.exports = app;
