const Joi = require('joi')

const createTaskSchema=Joi.object({
    title:Joi.string().min(3).max(20).required(),
    description:Joi.string().max(200).optional(),
    status:Joi.string().valid("todo","in progress","done").default("todo"),
    priority:Joi.number().valid(1,2,3).optional(),
    dueDate:Joi.date().iso().required(),
    assignedTo:Joi.string()
    .hex()
    .length(24).optional(),
})

const updateTaskSchema=Joi.object({
    title:Joi.string().min(3).max(20).optional(),
    description:Joi.string().max(200).optional(),
    status:Joi.string().valid("todo","in progress","done").optional(),
    priority:Joi.number().valid(1,2,3).optional(),
    dueDate:Joi.date().iso().optional(),
    assignedTo:Joi.string()
    .hex()
    .length(24).optional(),
}).min(1)

const statusUpdateTaskSchema=Joi.object({
    status:Joi.string().valid("todo","in progress","done").required()
}).unknown(false)

const reassignTaskSchema=Joi.object({
    assignedTo:Joi.string()
    .hex()
    .length(24).required(),
}).unknown(false)

const objectId = Joi.string().hex().length(24)
const TaskIdParamsSchema=Joi.object({
    taskId: objectId.required(),
    tenantId:objectId.required(),
    projectId:objectId.required()
})
module.exports={createTaskSchema,updateTaskSchema,statusUpdateTaskSchema,reassignTaskSchema,TaskIdParamsSchema}