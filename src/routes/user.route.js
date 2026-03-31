const express=require('express')
const {Signup,login}=require('../controllers/user.controller')
const router=express.Router()

router.post('/signup',Signup)
router.post('/login',login)
module.exports=router