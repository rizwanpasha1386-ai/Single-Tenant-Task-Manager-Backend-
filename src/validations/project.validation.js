const Joi=require('joi')

const createProjectSchema=Joi.object({
    name:Joi.string().min(3).max(50).required(),
    description:Joi.string().max(200).optional(),
    duedate:Joi.date().iso().greater('now').required()
})

const updateProjectSchema=Joi.object({
    name:Joi.string().min(3).max(50).optional(),
    description:Joi.string().max(200).optional(),
    duedate:Joi.date().iso().greater('now').optional()
}).min(1)

const objectId = Joi.string().hex().length(24)

const addMemberSchema=Joi.object({
    members:Joi.array()
    .items(objectId.required())
    .min(1)
    .unique()
    .required()
})

const memberIdParamSchema = Joi.object({
    memberId: Joi.string().hex().length(24).required()
})

const projectIdParamSchema = Joi.object({
    projectId: objectId.required()
})

module.exports={createProjectSchema,updateProjectSchema,addMemberSchema,memberIdParamSchema,projectIdParamSchema}