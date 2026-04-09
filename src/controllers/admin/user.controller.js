const PROJECT = require('../../models/project.model');
const TASK=require('../../models/tasks.model')
const USER=require('../../models/user.model')

async function CreateUser(req,res) {
    try {
        const { name, email, password } = req.body;
        const existingUser = await USER.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        await USER.create({
        name:name,
        email:email,
        password:password
    })
    return res.status(201).json({ msg: "User created successfully" });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ msg: "Server error" });
    }   
}

async function GetallUser(req, res) {
  try {
    // 🔹 Pagination
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (page < 1) page = 1;

    const maxLimit = 50;
    if (limit < 1) limit = 10;
    const finalLimit = Math.min(limit, maxLimit);

    const skip = (page - 1) * finalLimit;

    // 🔹 Sorting (no createdAt dependency)
    const sortBy = req.query.sortBy || "name"; // default sort by name
    const order = req.query.order === "asc" ? 1 : -1;

    const sortOptions = {};
    sortOptions[sortBy] = order;

    // 🔹 Filtering
    const { search, role } = req.query;

    const filter = {};

    // 🔍 Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // 🎯 Filter by role
    if (role) {
      filter.role = role;
    }

    // 🔹 Query
    const users = await USER.find(filter)
      .select("-password")
      .sort(sortOptions)
      .skip(skip)
      .limit(finalLimit);

    const total = await USER.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: users,
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

async function GetAUser(req,res) {
    try {
        const { userId } = req.params;
        const user = await USER.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ user });

    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

async function deleteAUser(req,res) {
    try {
        const { userId } = req.params
        const user = await USER.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }
        if(user.role==="admin")
            return res.json({msg:"Admin cannot be deleted"})

        await USER.findByIdAndDelete(userId);
        return res.status(200).json({
            success: true,
            msg: "User deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: err.message
        });
    }
}

async function updateUser(req,res) {
    try {
        const { userId } = req.params;
    const updates = req.body;
    const user = await USER.findById(userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            msg: "User not found"
        });
    }

    if (updates.email) {
            const existingUser = await USER.findOne({
                email: updates.email,
                _id: { $ne: userId }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    msg: "Email already in use"
                });
            }
        }

    Object.keys(updates).forEach(key => {
            user[key] = updates[key];
        });
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
            success: true,
            msg: "User updated successfully",
            data: userObj
    });
    } catch (error) {
       return res.status(500).json({
            success: false,
            msg: err.message
        }); 
    }
    
}

module.exports={CreateUser,GetallUser,GetAUser,deleteAUser,updateUser}