const express = require('express')
const dotenev = require('dotenv')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const {authmiddleware} = require('./middleware/authmiddleware')
const {adminmiddleware} = require('./middleware/adminmiddleware')

dotenev.config()
const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('MongoDB connected')
}).catch((err)=>{
    console.log('MongoDB not connected')
})
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    }
})

const User = mongoose.model('User',userSchema)

app.get("/",(req,res)=>{
    res.send('Home Page')
})

app.post("/signup",async (req,res)=>{
    const {username, password, role} = req.body

    const hashPassword = await bcrypt.hash(password,10)

    await User.create({
        username:username,
        password:hashPassword,
        role:role||"user"
    })

    res.status(200).send({
        message:'Signup successfully'
    })

})

app.post("/login",async (req,res)=>{
    const {username, password} = req.body

    const user = await User.findOne({username})

    if(!user){
        return res.status(401).send({
            message:'user not found'
        })
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    )

    if(!isMatch){
        return res.status(401).send({
            message:'unauthorized user'
        })
    }

    const token = jwt.sign(
        {
            username:user.username,
            role:user.role
        },
        process.env.JWT_SECRET
    )

    res.status(200).send({
        message:'Login Successfull',
        token
    })

})

app.get("/profile", authmiddleware, (req,res)=>{
    
    res.send('Profile fetched successfully')
})

app.get("/dashboard", authmiddleware, (req,res)=>{
    
    res.send('Welcome to dashboard')
})

app.get("/admin", authmiddleware, adminmiddleware, async (req,res)=>{
    const users = await User.find();
    res.send(JSON.stringify(users))
})

app.delete("/admin/:id", authmiddleware, adminmiddleware, async (req,res)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    res.send({
        message:"User deleted"
    })
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})
