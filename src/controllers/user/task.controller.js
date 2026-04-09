const TASK=require('../../models/tasks.model')
const USER=require('../../models/user.model')
const mongoose=require('mongoose')

async function getMyTasks(req, res) {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    // 🔹 Pagination
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    // Validation
    if (page < 1) page = 1;
    if (limit < 1 || limit > 50) limit = 10;

    const skip = (page - 1) * limit;

    // 🔹 Sorting
    const sortBy = req.query.sortBy || "createdAt"; // default
    const order = req.query.order === "asc" ? 1 : -1;

    const sortOptions = {};
    sortOptions[sortBy] = order;

    // 🔹 Filtering
    const { status, priority, startDate, endDate } = req.query;

    const filter = {
      project: projectId,
      assignedTo: userId
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // 🔹 Query
    const tasks = await TASK.find(filter)
      .select("title description status priority createdAt")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await TASK.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
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
        const { projectId, taskId } = req.params;
        const userId = req.user._id;

        const task = await TASK.findOne({
            _id: taskId,
            project: projectId,     // ✅ must belong to project
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
        const { projectId, taskId } = req.params;
        const { status } = req.body;
        const userId = req.user._id;

        const allowedStatus = ["pending", "in progress", "done"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ msg: "Invalid status" });
        }

        const task = await TASK.findOne({
            _id: taskId,
            project: projectId,
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


module.exports = { getMyTasks,getATask,updateStatus};