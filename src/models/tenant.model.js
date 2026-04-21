const { required } = require('joi')
const mongoose=require('mongoose')

const tenantSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
  ownerName:{
    type:String,
    required:true
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users",
    required:true
  }
  
},{timestamps:true})

const TENANT= mongoose.model("Tenant", tenantSchema)

module.exports=TENANT