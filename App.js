const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
dotenv.config();

//custom modules
// const routes = require('./routes/router.js');

//express app
const app = express();

//view engine systems
app.set('views', path.join(__dirname + 'views'))
app.set('view engine', 'pug');

//adding middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    secret: "kevthedev",
    resave: false,
    saveUninitilaized: false,
}))
app.use(flash())


//adding routes
// app.use('/', routes)

//error hamdling middleware
app.use((err, req, res, next) => {
    //console.log(err)
    res.status(422).send({err: err.message})
})

app.listen(process.env.PORT, () => {
    console.log(`app started at ${process.env.PORT}`)
})