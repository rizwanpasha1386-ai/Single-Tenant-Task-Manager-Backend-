const USER=require('../models/user.model')
const MEMBERSHIP=require('../models/membership.model')
const PROJECT=require('../models/project.model')
const TASK=require('../models/tasks.model')

//admin - tasks
async function CreateTask(req,res) {
    try {
        const projectId=req.params.projectId
        const tenantId=req.params.tenantId
        const {title,description,priority,dueDate,assignedTo}=req.body
    if(!title)
         return res.status(400).json({ msg: "Title required" });
        
    const project = await PROJECT.findById(projectId);

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
        tenantId:tenantId
    })

    return res.json({msg:"Task added successfully",
        task:task
    })
    
    } catch (error) {
     console.log(error)
     return res.status(500).json({msg:"Error, not inserted"})
    }
}

async function GetAllTasks(req, res) {
  try {
    const { projectId, tenantId } = req.params;

    let filter = {
      project: projectId,
      tenantId: tenantId
    };

    const { status, assignedTo, priority, search } = req.query;

    if (status) {
      filter.status = status;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const tasks = await TASK.find(filter)
      .select("title description status priority createdAt assignedTo")
      .populate("assignedTo", "name email");

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

async function UpdateTask(req,res) {
    try {
        const taskid=req.params.taskId
        const {projectId,tenantId}=req.params

        const validFields=[
            "title",
            "description",
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
        task:task
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
        const {projectId,tenantId}=req.params.projectId

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
            {_id:id,project:project._id,tenantId:tenantId},
            {assignedTo:assignedTo},
            {
                new:true,
                runValidators:true
            }
        )
        if(!task)
            return res.status(404).json({msg:"Task not found"})

        return res.status(200).json({msg:"Reassigned successfully",
            task:task
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"Server error"})
    }
}

//member-task

async function getMyTasks(req, res) {
  try {
    const { projectId, tenantId } = req.params;
    const userId = req.user._id;

    // 🔹 Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const sortOptions = {
      [sortBy]: order
    };

    // 🔹 Filtering
    const { status, priority, startDate, endDate, search } = req.query;

    let filter = {
      project: projectId,
      assignedTo: userId,
      tenantId: tenantId
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // 🔥 Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // 🔥 Search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // 🔹 Query (NO pagination)
    const tasks = await TASK.find(filter)
      .select("title description status priority createdAt")
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

async function getATask(req,res) {
    try {
        const { projectId, taskId ,tenantId} = req.params;
        const userId = req.user._id;

        const task = await TASK.findOne({
            _id: taskId,
            project: projectId,      // ✅ must belong to project
            tenantId:tenantId,     
            assignedTo: userId      // ✅ must be user's task
        })
        .select("title description status priority createdAt")
        .populate("project", "name");

        if (!task) {
            return res.status(404).json({
                msg: "Task not found or access denied"
            });
        }

        return res.status(200).json({
            success: true,
            task
        });
    } catch (error) {
        return res.status(500).json({msg:"Server error"})
    }
}

async function updateStatus(req, res) {
    try {
        const { projectId, taskId, tenantId } = req.params;
        const { status } = req.body;
        const userId = req.user._id;

        const allowedStatus = ["pending", "in progress", "done"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ msg: "Invalid status" });
        }

        const task = await TASK.findOne({
            _id: taskId,
            project: projectId,
            tenantId:tenantId,
            assignedTo: userId
        });

        if (!task) {
            return res.status(404).json({
                msg: "Task not found or access denied"
            });
        }

        task.status = status;
        task.completedAt = status === "done" ? new Date() : null;

        await task.save();

        return res.status(200).json({
            success: true,
            msg: "Task status updated successfully",
            task
        });

    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

module.exports={CreateTask,GetAllTasks,UpdateTask,DeleteTask,ReassignTask,
    getATask,updateStatus,getMyTasks
}