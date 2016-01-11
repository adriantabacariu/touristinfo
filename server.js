var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var port = process.env.PORT || 4000;

require('./config/passport')(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(flash());
app.use(morgan('dev'));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

require('./app/routes.js')(app, passport);

app.listen(port);
