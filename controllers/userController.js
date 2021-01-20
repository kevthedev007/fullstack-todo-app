const pool = require('../models/queries.js')
const bcrypt = require('bcrypt')

let userController = {
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
           if(newUser) return res.send('welcome') 
       } catch(err) {
           return next(err)
       }       
    },

    login: async function(req, res, next) {
        const {username, password} = req.body;
        const checkUser = await pool.query('SELECT * FROM todo WHERE username = $1', [username])
        if(!checkUser.rows[0]) {
            return res.json('user doesnt exist')
        } else {
            const isValid = await bcrypt.compare(password, checkUser.rows[0].password);
            if(!isValid) return res.json('password is incorrect')
            res.json('you are logged in')
        }
    }
}


module.exports = userController;