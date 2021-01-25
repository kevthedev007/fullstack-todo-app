const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const cors = require('cors')
dotenv.config();

//custom modules
const routes = require('./routes/router.js');

//express app
const app = express();

//local storage for token
// if (typeof localStorage === "undefined" || localStorage === null) {
//     const LocalStorage = require('node-localstorage').LocalStorage;
//     localStorage = new LocalStorage('./scratch')
// }

//view engine systems
app.set('view engine', 'hbs');
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts/',
    extname: 'hbs'
}))

//adding middlewares
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())
app.use(cookieParser())
app.use(session({
    secret: "kevthedev",
    resave: false,
    saveUninitilaized: true,
}))
app.use(flash())

//global vars
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.infos = req.flash('info');
    res.locals.error = req.flash('error');
    next()
})

//adding routes
app.use('/', routes)


//error handling middleware
app.use((err, req, res, next) => {
    //console.log(err)
    res.status(500).send({err: err.message})
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`app started at ${process.env.PORT}`)
})