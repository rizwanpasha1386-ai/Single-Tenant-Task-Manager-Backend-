const TASK=require('../models/tasks.model')
const USER=require('../models/user.model')

async function CreateTask(req,res) {
    const {title,description,priority,dueDate,name}=req.body
    const user=await USER.findOne({name:name})
   
    try {
        await TASK.create({
        title:title,
        description:description,
        priority:priority,
        dueDate:dueDate,
        assignedTo:user._id
    })
    return res.json({msg:"Task added successfully"})
    } catch (error) {
     console.log("Error in task insertion")
     return res.json({msg:"Error, not inserted"})
    }
}

async function GetAllTasks(req,res) {
    const tasks=await TASK.find({assignedTo:"69cbfa9598a393e17bc5f885"}) 
    return res.json({msg:tasks})
}

module.exports={CreateTask,GetAllTasks}