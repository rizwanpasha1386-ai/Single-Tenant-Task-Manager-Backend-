const mongoose=require('mongoose')
const bcrypt=require('bcrypt');
const { required } = require('joi');

const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required: true
    },

},{timestamps:true})

userschema.pre('save', async function () {
    if (!this.isModified("password")) return;

    const saltround = 10;
    this.password = await bcrypt.hash(this.password, saltround);
});

userschema.methods.Comparepassword=async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

const USER=mongoose.model("users",userschema)

module.exports=USER