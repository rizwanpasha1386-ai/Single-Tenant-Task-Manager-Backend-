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

async function getAllProjects(req, res) {
  try {
    const userId = req.user._id;

    // 🔹 Pagination
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (page < 1) page = 1;

    const maxLimit = 50;
    if (limit < 1) limit = 10;
    const finalLimit = Math.min(limit, maxLimit);

    const skip = (page - 1) * finalLimit;

    // 🔹 Sorting
    const sortBy = req.query.sortBy || "createdAt"; // better default
    const order = req.query.order === "asc" ? 1 : -1;

    const sortOptions = {};
    sortOptions[sortBy] = order;

    // 🔹 Filtering
    const { search, startDate, endDate } = req.query;

    const filter = {
      createdBy: userId
    };

    // 🔍 Search by name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // 📅 Date filtering (on createdAt)
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // 🔹 Query
    const projects = await PROJECT.find(filter)
      .select("name description createdBy members dueDate createdAt")
      .sort(sortOptions)
      .skip(skip)
      .limit(finalLimit);

    const total = await PROJECT.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: projects,
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