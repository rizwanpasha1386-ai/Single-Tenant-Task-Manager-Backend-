require('dotenv').config();
const mongoose=require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_url)
        console.log("Mongodb connected successfully")
    } catch (error) {
        console.log("Mongodb connection error ",error)
        process.exit(1)
    }
}

module.exports=connectDB