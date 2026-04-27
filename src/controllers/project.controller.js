const USER=require('../models/user.model')
const MEMBERSHIP=require('../models/membership.model')
const PROJECT=require('../models/project.model')
const TASK=require('../models/tasks.model')

async function createProject(req,res) {
    try {
        const {name,description,duedate}=req.body
        const tenantId=req.params.tenantId
        const project=await PROJECT.create({
            name:name,
            description:description,
            createdBy:req.user._id,
            duedate:duedate,
            members: [req.user._id],
            tenantId:tenantId
        })
        return res.status(201).json({msg:"Project created successfully",
            project:project
        })
    } catch (error) {
        return res.status(500).json({msg:"Server error"})
    }
}

async function getAllProjects(req, res) {
  try {
    const userId = req.user._id;
    const tenantId=req.params.tenantId
    // 🔹 Query
    const projects = await PROJECT.find({createdBy:userId,tenantId:tenantId})
      .select("name description createdBy members dueDate createdAt")

    return res.status(200).json({
      success: true,
      data: projects,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

async function getProjectById(req,res) {
    try {
        const projectId=req.params.projectId
        const project=req.project

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

        await PROJECT.findByIdAndDelete(projectId);

        return res.status(200).json({msg:"Project deleted"})
    } catch (error) {
         return res.status(500).json({msg:"Server error",
            err:error.message
        })
    }
}

async function addProjectMembers(req, res) {
    try {
        const projectId = req.params.projectId;
        const { members } = req.body; // array of userIds

        // 1. Get project
        const project = await PROJECT.findById(projectId);
        const tenantId = req.params.tenantId;

        // 2. Validate users exist
        const users = await USER.find({ _id: { $in: members } });

        if (users.length !== members.length) {
            return res.status(404).json({
                msg: "Some users not found"
            });
        }

        // 3. Check users belong to tenant
        const tenantMembers = await MEMBERSHIP.find({
            tenant: tenantId,
            user: { $in: members }
        });

        if (tenantMembers.length !== members.length) {
            return res.status(400).json({
                msg: "Some users are not part of the tenant"
            });
        }

        // 4. Avoid duplicate project members
        const existingMembersSet = new Set(
            project.members.map(id => id.toString())
        );

        const newMembers = members.filter(
            id => !existingMembersSet.has(id.toString())
        );

        // 5. Update project
        if (newMembers.length > 0) {
            project.members.push(...newMembers);
            await project.save();
        }

        return res.status(200).json({
            success: true,
            msg: "Project members updated successfully",
            addedCount: newMembers.length,
            skipped: members.length - newMembers.length,
            totalMembers: project.members.length
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
                $pull: { members: memberId } 
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

//Member
async function GetMyProjects(req, res) {
  try {
    const userId = req.user._id;
    const tenantId=req.params.tenantId

    // 🔹 Pagination
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (page < 1) page = 1;

    const maxLimit = 50;
    if (limit < 1) limit = 10;
    const finalLimit = Math.min(limit, maxLimit);

    const skip = (page - 1) * finalLimit;

    // 🔹 Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const sortOptions = {};
    sortOptions[sortBy] = order;

    const filter = {
      tenantId:tenantId,
      members: userId
    };


    // 🔹 Query
    const projects = await PROJECT.find(filter)
      .select("name description createdBy members duedate createdAt")
      .sort(sortOptions)
      .skip(skip)
      .limit(finalLimit);

    const total = await PROJECT.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "All projects",
      data: projects,
      pagination: {
        page,
        limit: finalLimit,
        total,
        totalPages: Math.ceil(total / finalLimit)
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

async function GetAProject(req,res) {
    try {
        const {projectId,tenantId}=req.params

        const project=await PROJECT.findOne({
            _id:projectId,tenantId:tenantId})
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

module.exports={createProject,getAllProjects,getProjectById,updateProject,deleteProject,addProjectMembers,RemoveMember,GetAllMembers,GetMyProjects,GetAProject}