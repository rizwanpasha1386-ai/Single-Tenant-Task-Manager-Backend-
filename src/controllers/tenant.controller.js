const USER=require('../models/user.model')
const MEMBERSHIP=require('../models/membership.model')
const PROJECT=require('../models/project.model')
const TASK=require('../models/tasks.model')
const TENANT=require('../models/tenant.model')

async function createTenant(req, res) {
    try {
        const { name, ownerName } = req.body;

        // assuming you have auth middleware that sets req.user
        const userId = req.user?._id;

        // validation
        if (!name || !ownerName) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        if (!userId) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        // create tenant
        const tenant = await TENANT.create({
            name,
            ownerName,
            createdBy: userId
        });

        await MEMBERSHIP.create({
            user:userId,
            tenant:tenant._id,
            role:"owner"
        })

        res.status(201).json({
            msg: "Tenant created successfully",
            tenant
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error creating tenant",
            error: error.message
        });
    }
}

async function displayAllTenants(req,res) {
    try {
    const { search, role } = req.query;

    // Step 1: Build membership filter
    let membershipQuery = {
      user: req.user.id
    };

    if (role) {
      membershipQuery.role = role;
    }

    // Step 2: Get memberships
    const memberships = await MEMBERSHIP.find(membershipQuery);

    // Extract tenant IDs
    const tenantIds = memberships.map(m => m.tenant);

    // Step 3: Build tenant query
    let tenantQuery = {
      _id: { $in: tenantIds }
    };

    if (search) {
      tenantQuery.name = { $regex: search, $options: 'i' };
    }

    // Step 4: Fetch tenants
    const tenants = await TENANT.find(tenantQuery);

    res.json({
      success: true,
      data: tenants
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//1> owner
async function createAdmin(req,res) {
    try {
        const { email } = req.body;
        const tenantId = req.params.tenantId;
        const currentUserId = req.user.userId; // from JWT

        // 1. Find user to be made admin
        const user = await USER.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // 3. Check if user already part of tenant
        const existingMembership = await MEMBERSHIP.findOne({
            user: user._id,
            tenant: tenantId
        });

        if (existingMembership) {
            return res.status(400).json({
                msg: "User already part of tenant"
            });
        }

        // 4. Create admin membership
        const newAdmin = await MEMBERSHIP.create({
            user: user._id,
            tenant: tenantId,
            role: "admin"
        });

        return res.status(201).json({
            msg: "Admin created successfully",
            data: newAdmin
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

async function addTenantMembers(req, res) {
    try {
        const tenantId = req.params.tenantId;
        const { members } = req.body; // array of userIds

        // 1. Validate users exist
        const users = await USER.find({ _id: { $in: members } });

        if (users.length !== members.length) {
            return res.status(404).json({
                msg: "Some users not found"
            });
        }

        // 3. Check existing memberships (avoid duplicates)
        const existingMemberships = await MEMBERSHIP.find({
            tenant: tenantId,
            user: { $in: members }
        });

        const existingUserIds = new Set(
            existingMemberships.map(m => m.user.toString())
        );

        // 4. Filter only new users
        const newMembers = members.filter(
            id => !existingUserIds.has(id.toString())
        );

        // 5. Prepare membership documents
        const membershipDocs = newMembers.map(userId => ({
            user: userId,
            tenant: tenantId,
            role: 'member'
        }));

        // 6. Insert
        if (membershipDocs.length > 0) {
            await MEMBERSHIP.insertMany(membershipDocs);
        }

        return res.status(200).json({
            success: true,
            msg: "Tenant members processed successfully",
            addedCount: newMembers.length,
            skipped: members.length - newMembers.length
        });

    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

async function viewTenant(req,res) {
    try {
        const {tenantId}=req.params
        const tenant=await TENANT.findById(tenantId)
        .populate("createdBy","name email")
         return res.status(200).json({
            data:tenant
         })
    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

async function updateTenant(req,res) {
    try {
    const { tenantId } = req.params;
    const { name, ownerName } = req.body;

    // 1️⃣ Validate input
    if (!name && !ownerName) {
      return res.status(400).json({
        success: false,
        message: "At least one field (name or ownerName) is required"
      });
    }

    // 2️⃣ Find tenant
    const tenant = await TENANT.findById(tenantId);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    // 3️⃣ Update fields (only allowed ones)
    if (name) tenant.name = name;
    if (ownerName) tenant.ownerName = ownerName;

    // 4️⃣ Save updated tenant
    const updatedTenant = await TENANT.save();

    // 5️⃣ Send response
    res.status(200).json({
      success: true,
      data: updatedTenant
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function deleteTenant(req,res) {
    try {
    const { tenantId } = req.params;

    // 1️⃣ Check tenant
    const tenant = await TENANT.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // 2️⃣ Delete memberships
    await MEMBERSHIP.deleteMany({ tenant: tenantId });

    // 3️⃣ Get all projects of tenant
    const projects = await Project.find({ tenantId: tenantId });

    const projectIds = projects.map(p => p._id);

    // 4️⃣ Delete tasks of those projects
    await TASK.deleteMany({ project: { $in: projectIds } });

    // 5️⃣ Delete projects
    await PROJECT.deleteMany({ tenantId: tenantId });

    // 6️⃣ Delete tenant
    await TENANT.findByIdAndDelete(tenantId);

    res.status(200).json({
      success: true,
      message: "Tenant and related data deleted"
    });
}
catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getTenantMembers(req, res) {
  try {
    const { tenantId } = req.params;
    const { role, search, sort = "createdAt" } = req.query;

    let filter = { tenant: tenantId };

    if (role) {
      // support multiple roles: admin,member
      filter.role = { $in: role.split(",") };
    }

    const members = await MEMBERSHIP.find(filter)
      .populate({
        path: "user",
        select: "name email",
        match: search
          ? {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
              ]
            }
          : {}
      })
      .select("role user")
      .sort(sort);

    const filteredMembers = members.filter(m => m.user !== null);

    if (!filteredMembers.length) {
      return res.status(404).json({
        success: false,
        message: "No members found"
      });
    }

    res.status(200).json({
      success: true,
      count: filteredMembers.length,
      data: filteredMembers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function deleteTenantMember(req,res) {
     try {
    const { tenantId, memberId } = req.params;

    // 1️⃣ Find membership
    const membership = await MEMBERSHIP.findOne({
      tenant: tenantId,
      user: memberId
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Member not found in this tenant"
      });
    }

    // 2️⃣ Prevent removing owner
    if (membership.role === "owner") {
      return res.status(403).json({
        success: false,
        message: "Owner cannot be removed"
      });
    }

    // 3️⃣ Delete membership
    await membership.deleteOne();

    res.status(200).json({
      success: true,
      message: "Member removed successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function updateMemberRole(req,res) {
    try {
    const { tenantId } = req.params;
    const { memberId, role } = req.body;

    // 1️⃣ Validate role
    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    // 2️⃣ Find membership
    const membership = await MEMBERSHIP.findOne({
      tenant: tenantId,
      user: memberId
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Member not found in this tenant"
      });
    }

    // 3️⃣ Prevent changing owner
    if (membership.role === "owner") {
      return res.status(403).json({
        success: false,
        message: "Owner role cannot be changed"
      });
    }

    const previousRole = membership.role;

    // 4️⃣ Update role
    membership.role = role;
    await membership.save();

    // 5️⃣ If member → admin → remove task assignments
    if (previousRole === "member" && role === "admin") {
      await TASK.updateMany(
        {
          tenantId: tenantId,
          assignedTo: memberId
        },
        {
          $set: { assignedTo: null }
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: membership
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports={createTenant,displayAllTenants,createAdmin,addTenantMembers,viewTenant,updateTenant,deleteTenant,
    getTenantMembers,deleteTenantMember,updateMemberRole}