const mongoose=require('mongoose')

const taskschema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    status:{
        type:String,
        enum:["pending","in progress","done"],
        default:"pending"
    },
    priority: { 
        type: String,
        enum: [1,2,3]
     },
     dueDate: Date,
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        // required:true
    },
    completedAt:Date,
    updatedAt:Date
},{timestamps:true})

const TASK=mongoose.model("tasks",taskschema)

module.exports=TASK