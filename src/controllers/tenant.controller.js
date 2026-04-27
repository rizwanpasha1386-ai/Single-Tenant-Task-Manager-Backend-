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
        const userId=req.user._id
        const alltenants=await MEMBERSHIP.find({user:userId})
            .populate('tenant','name')
            .select('tenant role')

        const result=alltenants.map(m=>({
            tenantId:m.tenant._id,
            tenantName:m.tenant.name,
            role:m.role
        }))

        res.status(200).json({
            tenants:result
        })
    } catch (error) {
         res.status(500).json({
            message: "Error fetching tenants",
            error: error.message
        });
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

module.exports={createTenant,displayAllTenants,createAdmin,addTenantMembers}