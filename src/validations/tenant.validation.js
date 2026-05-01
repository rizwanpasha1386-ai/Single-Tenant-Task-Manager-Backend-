const Joi = require('joi')

const objectId = Joi.string().hex().length(24)

const tenantIdParamSchema=Joi.object({
    tenantId:objectId.required(),
})

module.exports={tenantIdParamSchema}