const PROJECT=require('../../models/project.model')

async function GetMyProjects(req, res) {
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
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const sortOptions = {};
    sortOptions[sortBy] = order;

    // 🔹 Filtering (optional)
    const { search } = req.query;

    const filter = {
      members: userId
    };

    // Search by project name (case-insensitive)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

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
        const projectId=req.params.projectId

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