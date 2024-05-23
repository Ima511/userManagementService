require("dotenv").config();
const express = require('express');
const connectDB = require('./config/database');

const userRoutes = require('./routes/userRoutes');

const app = express();

connectDB();

app.use(express.json());

app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

app.use((err, req, res, next) => {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
