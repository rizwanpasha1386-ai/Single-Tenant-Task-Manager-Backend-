const USER=require('./models/user.model')

async function adminCreate(req,res) {
    const {name,email,password}=req.body
    const user=await USER.create({
        name:name,
        email:email,
        password:password,
        role:"admin"
    })
    res.json({msg:"Admin created ",user})
}

module.exports=adminCreate