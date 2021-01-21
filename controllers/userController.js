const pool = require('../models/queries.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let userController = {
    getSignup: function(req, res) {
        res.render('signup', {
            title: 'Signup Page',
            style: 'signup.css'
        })
    },

    getLogin: function(req, res) {
        res.render('login', {
            title: 'Login Page',
            style: 'login.css'
        })
    },

    signUp: async function (req, res, next) {
       const {username, password} = req.body;
       const userExist = await pool.query('SELECT * FROM todo WHERE username = $1', [username])
        if (userExist.rows[0]) {
            console.log(userExist.rows[0])
            req.flash('error', 'username already exists');
            return res.status(400).redirect('/signup')
        } 
       const hashedPassword = await bcrypt.hash(req.body.password, 10);
       try {
           const newUser = await pool.query('INSERT INTO todo (username, password) VALUES ($1, $2)', [username, hashedPassword])
           res.redirect('/login')
       } catch(err) {
           return next(err)
       }       
    },

    login: async function(req, res, next) {
        const {username, password} = req.body;
        const checkUser = await pool.query('SELECT * FROM todo WHERE username = $1', [username])
        if(!checkUser.rows[0]) {
            req.flash('error','username does not exist')
            return res.status(400).redirect('/login')
        } 
        const isValid = await bcrypt.compare(password, checkUser.rows[0].password);
        if(!isValid) {
            req.flash('error', 'password is incorrect')
            return res.status(400).redirect('/login')
            }
        //create and assign token
        const user = {
            name: username
        }
        const accessToken = jwt.sign(user, process.env.SECRET_KEY)
        localStorage.setItem('token', accessToken)
        res.redirect('/welcome')
    }
}


module.exports = userController;