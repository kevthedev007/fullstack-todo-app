const pool = require('../models/queries.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let userController = {
    //home page
    home: function(req, res) {
        //if user still has token, navigate to his page else goto login page
        if(req.user.name) {
            return res.redirect('/' + req.user.name)
        }
    },

    //signup page
    getSignup: function(req, res) {
        res.render('signup.hbs', {
            title: 'Signup Page',
            style: 'signup.css'
        })
    },

    //login page
    getLogin: function(req, res) {
        res.render('login.hbs', {
            title: 'Login Page',
            style: 'login.css'
        })
    },

    signUp: async function (req, res, next) {
       const username = req.body.username.toLowerCase();
       const password = req.body.password.toLowerCase();

       const userExist = await pool.query('SELECT * FROM login WHERE username = $1', [username])
        if (userExist.rows[0]) {
            console.log(userExist.rows[0])
            req.flash('error', 'username already exists');
            return res.status(400).redirect('/signup')
        } 
       const hashedPassword = await bcrypt.hash(password, 10);
       try {
           const newUser = await pool.query('INSERT INTO login (username, password) VALUES ($1, $2)', [username, hashedPassword])
           const user = {
            name: username
            }
        const accessToken = jwt.sign(user, process.env.SECRET_KEY)
        //set token in a cookie
        res.cookie('token', accessToken, {maxAge: 3600 * 1000 * 24 * 365, httpOnly: false})
        return res.redirect('/' + username)
       } catch(err) {
           return next(err)
       }       
    },

    login: async function(req, res, next) {
        const username = req.body.username.toLowerCase();
        const password = req.body.password.toLowerCase();

        const checkUser = await pool.query('SELECT * FROM login WHERE username = $1', [username])
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
        //set token in a cookie
        res.cookie('token', accessToken, {maxAge: 3600 * 1000 * 24 * 365, httpOnly: false})
        return res.redirect('/' + username)
    },

    //render user todo
    userRoute: async function(req, res, next) {
        //check if the user is accessing his path
        if(req.params.username !== req.user.name) {
            res.clearCookie('token')
            return res.status(400).redirect('/login')
        }
       res.render('todo2.pug', {username: req.user.name});
    },
    
    //get user todos
    getAllBooks: async function(req, res, next) {
        const myTasks = await pool.query('SELECT todo.tasks,todo.id FROM login JOIN todo ON login.username = todo.username WHERE todo.username = $1', [req.user.name]);
        res.json(myTasks.rows)
    },

    //post todo
    postTask: async function(req, res, next) {
        let addTask = await pool.query('INSERT INTO todo (username, tasks) VALUES ($1, $2)', [req.user.name, req.body.task]);
        res.end()
    },

    //delete a task
    deleteTasks: async function(req, res, next) {
        const index = req.params.index;
        let deleteTask = await pool.query('DELETE FROM todo WHERE id = $1', [index]);
        res.end()
    },

    //delete all tasks
    deleteAll: async function(req, res, next) {
        let deleteAll = await pool.query('DELETE FROM todo WHERE username=$1', [req.user.name]);
        res.end()
    },

    //logout
    logout: function(req, res) {
        res.clearCookie('token')
        res.redirect('/login')
    }
}

module.exports = userController;
