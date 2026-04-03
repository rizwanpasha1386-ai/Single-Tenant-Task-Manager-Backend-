const express=require('express')
const {getmytasks,getATask,updateStatus,login}=require('../controllers/userTask.route')
const router=express.Router()

router.get('/getMyTasks',getmytasks)
router.get('/task/:id',getATask)
router.patch('/task/:id',updateStatus)

module.exports=router