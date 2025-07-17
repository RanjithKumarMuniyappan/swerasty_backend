const express = require('express');
const { register, login, refreshToken } = require('../controllers/authController');
const authRouter = express.Router()


authRouter.route('/register').post(register);
authRouter.route('/login').post(login)
authRouter.route('/refreshtoken').post(refreshToken)

module.exports = authRouter;