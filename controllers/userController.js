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
            return res.send('user already exists')
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
        try{
        const checkUser = await pool.query('SELECT * FROM todo WHERE username = $1', [username])
        if(!checkUser.rows[0]) {
            return res.json('user doesnt exist')
        } else {
            const isValid = await bcrypt.compare(password, checkUser.rows[0].password);
            if(!isValid) return res.json('password is incorrect')
            res.json('you are logged in')
            }
        } catch(err) {
            return next(err)
        }
    }
}


module.exports = userController;