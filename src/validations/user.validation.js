const Joi=require('joi')

const createUserSchema=Joi.object({
    name:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).max(20).required(),
})

const updateUserSchema=Joi.object({
    name: Joi.string().min(3).max(50).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).max(20).optional(),
    role: Joi.string().valid("admin", "user").optional()
}).min(1)

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const objectId = Joi.string().hex().length(24)

const userIdParamSchema = Joi.object({
    userId: objectId.required()
})

module.exports={createUserSchema,updateUserSchema,loginSchema,userIdParamSchema}