const PROJECT=require('../../models/project.model')
const TASK=require('../../models/tasks.model')

async function createProject(req,res) {
    try {
        const {name,description,duedate}=req.body
        const project=await PROJECT.create({
            name:name,
            description:description,
            createdBy:req.user._id,
            duedate:duedate,
            members: [req.user._id]
        })
        return res.status(201).json({msg:"Project created successfully",
            project
        })
    } catch (error) {
        return res.status(500).json({msg:"Server error"})
    }
}

async function getAllProjects(req,res) {
    try {
        const projects=await PROJECT.find({createdBy:req.user._id})
        .sort({duedate:-1})
        if(!projects)
            return res.status(200).json({msg:"No Projects"})
        return res.status(200).json({projects:projects}) 
    } catch (error) {
        return res.status(500).json({msg:"Server error",
            err:error.msg
        })
    }
}

async function getProjectById(req,res) {
    try {
        const projectId=req.params.projectId
        const project = await PROJECT.findOne({
            _id: projectId,
        });
        if (!project) {
            return res.status(404).json({
                msg: "Project not found"
            });
        }

        return res.status(200).json({project:project})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"Server error",
            err:error.message
        })
    }
}

async function updateProject(req, res) {
    try {
        const projectId = req.params.projectId;
        const { name, description, duedate } = req.body;

        // Find project
        const project = await PROJECT.findById(projectId);

        if (!project) {
            return res.status(404).json({ msg: "Project not found" });
        }

        if (name) project.name = name;
        if (description) project.description = description;
        if (duedate) project.duedate = duedate;

        await project.save();

        return res.status(200).json({
            msg: "Project updated successfully",
            project
        });

    } catch (error) {
         return res.status(500).json({msg:"Server error",
            err:error.message
        })
    }
}

async function deleteProject(req,res) {
    try {
        const projectId = req.params.projectId;
        const project=await PROJECT.findOneAndDelete({_id:projectId,
            createdBy:req.user._id
        })
        if(!project)
            return res.status(404).json({msg:"Project not found"})

        await TASK.deleteMany({project:projectId})

        return res.status(200).json({msg:"Project deleted"})
    } catch (error) {
         return res.status(500).json({msg:"Server error",
            err:error.message
        })
    }
}

module.exports={createProject,getAllProjects,getProjectById,updateProject,deleteProject}