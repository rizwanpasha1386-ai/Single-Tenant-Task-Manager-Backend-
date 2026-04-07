const PROJECT = require('../../models/project.model');
const TASK=require('../../models/tasks.model')
const USER=require('../../models/user.model')
const mongoose=require('mongoose')

async function CreateTask(req,res) {
    try {
        const projectId=req.params.projectId
        const {title,description,priority,dueDate,assignedTo}=req.body
    if(!title)
         return res.status(400).json({ msg: "Title required" });
        
    const project = await PROJECT.findById(projectId);
        if (!project) {
            return res.status(404).json({ msg: "Project not found" });
        }

    let Assignedto=null
    if(assignedTo){
        const user = await USER.findById(assignedTo);
        if (!user) {
            return res.status(404).json({ msg: "Assigned user not found" });
        }
        if (!project.members.includes(user._id)) {
            return res.status(400).json({
                msg: "User is not part of this project"
            });
        }
        Assignedto=user._id    
    }

    const task= await TASK.create({
        title:title,
        description:description,
        priority:priority,
        dueDate:dueDate,
        assignedTo:Assignedto,
        project:projectId,
    })

    return res.json({msg:"Task added successfully",
        task:task
    })
    
    } catch (error) {
     console.log(error)
     return res.status(500).json({msg:"Error, not inserted"})
    }
}

async function GetAllTasks(req,res) {
    try {
        const projectId=req.params.projectId
        const tasks=await TASK.find({project:projectId})
        .sort({priority:-1,createdAt:-1})
        .populate("assignedTo","name email")
        return res.status(200).json({tasks:tasks})
    } catch (error) {
        return res.status(500).json({msg:"Server error"})
    }
}

async function UpdateTask(req,res) {
    try {
        const taskid=req.params.taskId
        const projectId=req.params.projectId

        const validFields=[
            "title",
            "description",
            "status",
            "priority",
            "assignedTo",
            "dueDate"
        ]

        const updates={}
        for(let key of Object.keys(req.body))
        {
            if(validFields.includes(key))
                updates[key]=req.body[key]
        }
        
        const project=await PROJECT.findById(projectId)
        if(updates.assignedTo){
            const user=await USER.findById(updates.assignedTo)
            if(!user)
                return res.status(404).json({ msg: "Assigned user not found" });
            if(!project.members.includes(user._id))
                return res.status(400).json({
                    msg: "User is not part of this project"
                })
        }

        const task=await TASK.findByIdAndUpdate(
            taskid,
            updates,
            {
                new:true,
                runValidators:true
            }
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

async function DeleteTask(req,res) {
    try {
        const task=await TASK.findByIdAndDelete(req.params.taskId)
        return res.status(200).json({msg:"Task deleted successfully"})
    } catch (error) {
     return res.status(500).json({msg:"Server error"})   
    }
}

async function ReassignTask(req,res) {
    try {
        const id=req.params.taskId
        const {assignedTo}=req.body
        const projectId=req.params.projectId

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid task ID" });
        }
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            return res.status(400).json({ msg: "Invalid user ID" });
        }

        const user = await USER.findById(assignedTo);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        const project=await PROJECT.findById(projectId)
        if(!project.members.includes(assignedTo)){
            return res.status(400).json({
                    msg: "User is not part of this project"
                })
        }

        const task=await TASK.findOneAndUpdate(
            {_id:id,project:project._id},
            {assignedTo:assignedTo},
            {
                new:true,
                runValidators:true
            }
        )
        if(!task)
            return res.status(404).json({msg:"Task not found"})

        return res.status(200).json({msg:"Reassigned successfully",
            task
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"Server error"})
    }
}

module.exports={CreateTask,GetAllTasks,UpdateTask,DeleteTask,ReassignTask}