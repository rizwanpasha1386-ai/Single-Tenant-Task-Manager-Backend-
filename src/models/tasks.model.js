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
        enum:["todo","in progress","done"],
        default:"todo"
    },
    priority: { 
        type: Number,
        enum: [1,2,3]
     },
     dueDate: Date,
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"projects",
        required:true
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true
    },
    completedAt:Date,
    
},{timestamps:true})

taskschema.index({ tenantId: 1, project: 1 });

const TASK=mongoose.model("tasks",taskschema)

module.exports=TASK