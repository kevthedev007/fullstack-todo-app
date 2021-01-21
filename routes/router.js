const express = require('express');
const jwt = require('jsonwebtoken')
const userController = require('../controllers/userController.js')
const router = express.Router();

function verifyToken(req, res,next) {
    const token = localStorage.getItem('token');
    if(!token) {
        return res.json('access denied! you must be logged in')
    }
    try{
        const user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
        next()
    } catch(err) {
        return next(err)
    }
}

router.get('/signup', userController.getSignup);
router.get('/login', userController.getLogin);
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.get('/welcome', verifyToken, (req, res) => {
    res.send('welcome ' + req.user.name)
})
router.get('/logout', (req, res) => {
    localStorage.removeItem('token');
    res.json('logged out')
})


module.exports = router;