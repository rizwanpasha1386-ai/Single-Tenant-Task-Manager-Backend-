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

async function GetAllMembers(req,res) {
    try {
        const {projectId}=req.params
        const project = await PROJECT.findById(projectId)
            .populate("members", "name email role");
        if(!project)
            return res.status(404).json({msg:"Project not found"})
        return res.status(200).json({
            success: true,
            totalMembers: project.members.length,
            members: project.members
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

module.exports = { AddMembers,RemoveMember,GetAllMembers };