const TASK=require('../models/tasks.model')
const USER=require('../models/user.model')

async function CreateUser(req,res) {
    try {
        const { name, email, password } = req.body;
        const existingUser = await USER.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        await USER.create({
        name:name,
        email:email,
        password:password
    })
    return res.status(201).json({ msg: "User created successfully" });
    }
    catch(err){
        return res.status(500).json({ msg: "Server error" });
    }   
}

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
    try {
        const tasks=await TASK.find({createdBy:req.user._id})
        .sort({priority:-1})
        .populate("assignedTo","name email")
        return res.status(200).json({tasks:tasks})
    } catch (error) {
        return res.status(500).json({msg:"Server error"})
    }
}

async function updateTask(req,res) {
    try {
        const taskid=req.params.taskId
        const validFields=[
            "title",
            "description",
            "status",
            "priority",
            "assignedTo"
        ]

        const updates={}
        for(let key of Object.keys(req.body))
        {
            if(validFields.includes(key))
                updates[key]=req.body[key]
        }

        if(updates.assignedTo){
            const user=await USER.findById(updates.assignedTo)
            if(!user)
                return res.status(404).json({ msg: "Assigned user not found" });
        }

        const task=await TASK.findByIdAndUpdate(
            taskid,
            updates,
            {new:true}
        )

        if(!task)
            return res.status(404).json({ msg: "Task not found" });
       
        return res.status(200).json({
        msg: "Task updated successfully",
        task
        })
    } catch (error) {
        return res.status(500).json({msg:"Server error"})
    }
}

async function deleteTask(req,res) {
    try {
        const task=await TASK.findByIdAndDelete(req.params.taskId)
        return res.status(200).json({msg:"Task deleted successfully"})
    } catch (error) {
     return res.status(500).json({msg:"Server error"})   
    }
}

module.exports={CreateUser,CreateTask,GetAllTasks,updateTask,deleteTask}