const PROJECT=require('../../models/project.model')
const mongoose=require('mongoose')

async function GetMyProjects(req,res) {
    try {
        const projects=await PROJECT.find({members:req.user._id})
        return res.status(200).json({msg:"All projects",
            projects:projects
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"Server error"})
    }
}

async function GetAProject(req,res) {
    try {
        const projectId=req.params.projectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ msg: "Invalid project ID" });
        }
        const project=await PROJECT.findOne({
            _id:projectId})
            .select("name description members createdBy createdAt")
            .populate("members", "name email")
            .populate("createdBy", "name email");

        if(!project)
            return res.status(404).json({msg:"Project not found"})
        return res.status(200).json({msg:"Project found",
            project:project
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({msg:"Server error"})
    }
}

module.exports={GetMyProjects,GetAProject}