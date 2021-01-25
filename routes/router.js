const express = require('express');
const jwt = require('jsonwebtoken')
const userController = require('../controllers/userController.js')
const router = express.Router();

function verifyToken(req, res,next) {
    // const token = localStorage.getItem('token');
    const token = req.cookies.token;
    if(!token) {
        // req.flash('error', 'access denied! you must be logged in');
        return res.status(400).redirect('/login')
    }
    try{
        const user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
        next()
    } catch(err) {
        return next(err)
    }
}

router.get('/', verifyToken, userController.home)
router.get('/signup', userController.getSignup);
router.get('/login', userController.getLogin);
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
// router.get('/books/getbooks', verifyToken, userController.getAllBooks)
// router.delete('/delete/task/:index', verifyToken, userController.deleteTasks);
// router.delete('/delete/deleteAll', verifyToken, userController.deleteAll)
router.get('/logout', userController.logout);
router.get('/:username', verifyToken, userController.userRoute);
router.post('/post', verifyToken, userController.postTask);
router.get('/books/getbooks', verifyToken, userController.getAllBooks)
router.delete('/delete/task/:index', verifyToken, userController.deleteTasks);
router.delete('/delete/deleteAll', verifyToken, userController.deleteAll)





module.exports = router;