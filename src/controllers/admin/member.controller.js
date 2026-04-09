const mongoose = require("mongoose");
const USER = require("../../models/user.model");
const PROJECT = require("../../models/project.model");

async function AddMembers(req, res) {
    try {
        const projectId = req.params.projectId;
        const { members } = req.body;

        const users = await USER.find({ _id: { $in: members } });

        if (users.length !== members.length) {
            return res.status(404).json({ msg: "Some users not found" });
        }

        const project = await PROJECT.findOneAndUpdate(
            { _id: projectId, createdBy: req.user._id },
            {
                $addToSet: {
                    members: { $each: validMembers }
                }
            },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({
                msg: "Project not found or unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Members added successfully",
            totalMembers: project.members.length,
            data: project
        });

    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

async function RemoveMember(req,res) {
    try {
        const { projectId, memberId } = req.params;
        
        const project = await PROJECT.findOneAndUpdate(
            { _id: projectId, createdBy: req.user._id },
            {
                $pull: { members: memberId } // 🔥 best way
            },
            { new: true }
        );
        if (!project) {
            return res.status(404).json({
                msg: "Project not found or unauthorized"
            });
        }
         return res.status(200).json({
            success: true,
            msg: "Member removed successfully",
            totalMembers: project.members.length,
            data: project
        });
    } catch (error) {
         return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

async function GetAllMembers(req, res) {
  try {
    const { projectId } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const maxLimit = 50;
    const finalLimit = Math.min(limit, maxLimit);

    const skip = (page - 1) * finalLimit;

    const project = await PROJECT.findById(projectId)
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const total = project.members.length;

    const paginatedMembers = project.members.slice(skip, skip + finalLimit);

    return res.status(200).json({
      success: true,
      data: paginatedMembers,
      pagination: {
        page,
        limit: finalLimit,
        total,
        totalPages: Math.ceil(total / finalLimit)
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
module.exports = { AddMembers,RemoveMember,GetAllMembers };