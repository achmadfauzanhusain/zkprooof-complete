var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

const testRouter = require('./app/test/router')
const authRouter = require('./app/auth/router')

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/test', testRouter);
app.use('/auth', authRouter);

module.exports = app;
