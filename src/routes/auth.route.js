const express=require('express')
const {login}=require('../controllers/auth.controller')
const {loginSchema}=require('../validations/user.validation')
const {validate}=require('../middlewares/validate')
const route=express.Router()

route.post('/',validate(loginSchema),login)

module.exports=route