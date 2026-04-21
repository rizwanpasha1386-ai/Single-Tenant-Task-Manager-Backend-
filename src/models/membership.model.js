const mongoose=require('mongoose')

const membershipSchema=new mongoose.Schema({
     user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
    role: {
        type: String,
        enum: ['owner', 'admin', 'member'],
        default: 'member'
    }
},{timestamps:true})

const MEMBERSHIP=mongoose.model("membership",membershipSchema)

module.exports=MEMBERSHIP