const TASK=require('../../models/tasks.model')
const USER=require('../../models/user.model')
const mongoose=require('mongoose')

async function getMyTasks(req, res) {
    try {
        const { projectId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ msg: "Invalid project ID" });
        }

        const tasks = await TASK.find({
            project: projectId,
            assignedTo: userId
        })
        .select("title description status priority createdAt")
        .sort({ priority: -1, createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });

    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

async function getATask(req,res) {
    try {
        const { projectId, taskId } = req.params;
        const userId = req.user._id;
         if (
            !mongoose.Types.ObjectId.isValid(projectId) ||
            !mongoose.Types.ObjectId.isValid(taskId)
        ) {
            return res.status(400).json({ msg: "Invalid IDs" });
        }

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

        if (
            !mongoose.Types.ObjectId.isValid(projectId) ||
            !mongoose.Types.ObjectId.isValid(taskId)
        ) {
            return res.status(400).json({ msg: "Invalid IDs" });
        }

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