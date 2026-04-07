const express=require('express')
const {login}=require('../controllers/auth.controller')
const route=express.Router()

route.post('/',login)

module.exports=route