const TASK=require('../models/tasks.model')
const USER=require('../models/user.model')

async function CreateTask(req,res) {
    try {
        const {title,description,priority,dueDate,assignedTo}=req.body
    if(!title || !assignedTo)
         return res.status(400).json({ msg: "Title and assigned user required" });
        
    const user = await USER.findById(assignedTo);
        if (!user) {
            return res.status(404).json({ msg: "Assigned user not found" });
        }

    const task= await TASK.create({
        title:title,
        description:description,
        priority:priority,
        dueDate:dueDate,
        assignedTo:user._id,
        createdBy:req.user._id
    })
    return res.json({msg:"Task added successfully",task:task})
    } catch (error) {
     
     return res.status(500).json({msg:"Error, not inserted"})
    }
}

async function GetAllTasks(req,res) {
    const tasks=await TASK.find({assignedTo:"69cbfa9598a393e17bc5f885"}) 
    return res.json({msg:tasks})
}

module.exports={CreateTask,GetAllTasks}