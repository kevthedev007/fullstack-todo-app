const pool = require('../models/queries.js')
const bcrypt = require('bcrypt')

let userController = {
    signUp: function(req, res, next) {
        const {username, password} = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10)
        pool.query('INSERT INTO todo (username, password) VALUES ($1, $2)', [username, hashedPassword])
        .then(user => res.json('successfully registered'))
        .catch(next)
    },

    login: function(req, res, next) {
        const {username, password} = req.body;
        pool.query('SELECT * FROM todo where username = $1', [username])
        .then(user => {
            console.log(user.rows)
            const isValid = bcrypt.compareSync(password, user.rows[0].password);
            if(isValid) {
                res.json('welcome ' + user.rows[0].username)
            } else {
                res.json('wrong password or username')
            }
        }).catch(next)
    }
}


module.exports = userController;