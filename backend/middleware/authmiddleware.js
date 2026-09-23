const jwt = require('jsonwebtoken')

const authmiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization
    const token = authHeader.split(" ")[1]

    if(!token){
        return res.send('Unauthorized request')
    }

    try{
        const decodejwt = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        req.user = decodejwt
    }catch(exception){
        return res.send('Unauthorized user')
    }

    next()
}

module.exports = {
    authmiddleware
}