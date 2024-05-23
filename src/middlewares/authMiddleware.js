import jwt from "jsonwebtoken";
import userController  from "../controllers/users/userController.js";

const isAuthenticated = async(req,res,next)=>{
    const authorization  =req.headers.authorization;
    if(!authorization){
        return res.status(401).json({error:"there is no token jwt"});
    }
    try {
        const token = authorization.split("Bearer ")[1];
        const decoded =jwt.verify(token,process.env.JWT_SECRET);
        const user = await userController.getById(decoded._id);
        if(!user){
            return res.status(400).json({error:"user does not exist"});
        }
        req.user = user;
        next();
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"there is an error"});
    }

}

const isAdmin = async(req,res,next)=>{
    const authorization  =req.headers.authorization;
    if(!authorization){
        return res.status(401).json({error:"there is no token jwt"});
    }
    try {
        const token = authorization.split("Bearer ")[1];
        const decoded =jwt.verify(token,process.env.JWT_SECRET);
        const user = await userController.getById(decoded._id);
        if(!user){
            return res.status(400).json({error:"user does not exist"});
        }
        if(user.role !== "admin"){
            return res.status(401).json({error:"you are not authorised"});
        }
        req.user = user;
        next();
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"there is an error"});
    }

}

export {
    isAuthenticated,
    isAdmin
}