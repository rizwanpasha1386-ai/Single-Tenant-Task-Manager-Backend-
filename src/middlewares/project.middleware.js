const PROJECT=require('../models/project.model')
const mongoose=require('mongoose')
async function IsProjectMember(req,res,next) {
    try {
        const { projectId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ msg: "Invalid project ID" });
        }

        const project=await PROJECT.findById(projectId)
        if(!project)
            return res.status(404).json({msg:"Project not found"})

        const isMember = project.members.some(
            member => member.toString() === userId.toString()
        );

        if(!isMember)
            return res.status(403).json({
                msg: "Forbidden: Not a project member"
            });

        req.project = project;
        
        next()
    } catch (error) {
        console.log(error)
        
        return res.status(500).json({msg:"Server error"})
    }
}

async function IsProjectOwner(req,res,next) {
    try {
        const projectId=req.params.projectId

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ msg: "Invalid project ID" });
        }

        const project=await PROJECT.findById(projectId)
        if(!project)
            return res.status(404).json({msg:"Project not found"})

        if(project.createdBy.toString()!==req.user._id.toString())
             return res.status(403).json({ msg: "Forbidden: Not project owner" });

        req.project = project;
        
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"Server error"})
    }
}

module.exports={IsProjectMember,IsProjectOwner}