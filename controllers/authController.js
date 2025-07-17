const User = require("../models/user");
const bcrypt = require('bcrypt');
const asynHandler = require('express-async-handler');
const jwt = require('jsonwebtoken')




//@desc Register User
//route POST /api/auth/register
//access public
const register = asynHandler(async (req, res, next)=>{
    const {name, email, password} = req.body

    if(!name || !email || !password){
        res.status(400);
        throw new Error("All field are required")
    }

    const existUser = await User.findOne({email});

    if(existUser){
        res.status(400)
        throw new Error("User already registered with given mail ID")
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("HashedPassword : ", hashedPassword);
    
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user){
        res.status(201).json({_id: user.id, email:user.email})
    }else{
        res.status(400)
        throw new Error("User data is not valid")
    }
})


//To generate token
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });

  return { accessToken, refreshToken };
};


//@desc Login
//route POST /api/auth/login
//access public
const login = asynHandler(async (req, res)=>{
    
    const {email, password} = req.body;

    if(!email){
        res.status(400)
        throw new Error("Email Id is missing")
    }else if(!password){
        res.status(400)
        throw new Error("Password is required")
    }

    const user = await User.findOne({email})
    if(!user){
        res.status(404)
        throw new Error("User not found")
    }

    //varify password
    if(user && await bcrypt.compare(password, user.password)){
        
        const accessToken = generateTokens(user.id)
        res.status(201).json({token: accessToken, user: user})
    }else{
        res.status(401)
        throw new Error("Password is not valid")
    }
})



//@desc Refresh token
//route POST /api/auth/refreshtoken
//access private
const refreshToken = asynHandler(async (req, res, next)=>{
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRE,
        });

        res.status(200).json({ accessToken });
    } catch (err) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
})


module.exports ={
    register,
    login,
    refreshToken
}