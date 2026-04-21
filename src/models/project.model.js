const mongoose=require('mongoose')

const projectschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
            required:true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    duedate:Date,
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true
  }
},{timestamps:true})

projectschema.index({ name: 1, tenantId: 1 }, { unique: true });

const PROJECT=mongoose.model('projects',projectschema)

module.exports=PROJECT