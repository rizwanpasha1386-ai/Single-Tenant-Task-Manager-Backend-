const mongoose=require('mongoose')

const projectschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
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
    duedate:Date
},{timestamps:true})

const PROJECT=mongoose.model('projects',projectschema)

module.exports=PROJECT