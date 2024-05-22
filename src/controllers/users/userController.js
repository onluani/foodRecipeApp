import userModel from "../../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getAll = async()=> {
    try {
        const users = await userModel.find();
        return users;
    } catch (error) {
        console.error(error);
        return [];
    }
}
const getById = async(id) =>{
    try {
        const user = await userModel.findById(id);
        return user;
    } catch (error) {
        console.error(error);
        return null;
        
    }
}
const getByProperty = async(property,value) =>{
    try {
        console.log("property",property)
        console.log("value",value)
        const user = await userModel.find({[property]:value})
        return user;
    } catch (error) {
        return null;
    }
}

const login = async(data) =>{
    const {email,username,password} = data;
    if((!email && !username ) || !password){
        return {error:"missing data",status:400};
    }
    try {
        let user;
        if(email){
            const users = await getByProperty("email",email);
            user = users[0];
        }
        else{
            const users = await getByProperty("username",username);
            user = users[0];
        }
        console.log("username",user);
        if(!user){
            return {error:"the username doesnt exist",status:400};
        }
        console.log("password",password,user.password);
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return {error:"wrong username and password",status:400};
        }
        console.log("login user",user)
        const token = jwt.sign({_id:user._id,username:user.username,role:user.role},process.env.JWT_SECRET,{expiresIn: 60 * 60})
        return {token};

        
    } catch (error) {
        console.error(error);
        return {error:"theres an error",status:500};
    }
}
const register = async(data) => {
    const {email,username,password,passwordRepeat} = data;
    if(!email || !username || !password || !passwordRepeat){
        return {error:"missing data"};
    }
    if(password !== passwordRepeat){
        return {error:"passwords dont match"};
    }
    const userData = {
        email,
        username,
        password,
        role:"user"
    }
    const user = await create(userData);
    return user;
}
const create = async(data) =>{
    try {
        const hash = await bcrypt.hash(data.password,10);
        data.password = hash;
        const user = await userModel.create(data);
        return user;
    } catch (error) {
        console.error(error); 
        return null;  
    }
}

const update = async(id,data) =>{
    try {
        const oldUser = await userModel.findByIdAndUpdate(id,data);
        const user = await userModel.findById(id);
        console.log("username",user);
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const remove = async(id) =>{
    try {
        const user = await userModel.findByIdAndDelete(id);
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}
const addRecipe = async(userId,recipeId)=>{
    try {
        console.log("add recipe",userId)
        const user = await getById(userId);
        console.log("users",user);
        if(!user.recipes.includes(recipeId)){
            user.recipes.push(recipeId);
            await user.save();
            return user;
        }
        return user;
    } catch (error) {
        console.error(error);
        return {error:"could not add the recipe"};
    }
}
const removeRecipe = async(userId,recipeId)=>{
    try {
        const user = await getById(userId);
        if(user.recipes.includes(recipeId)){
            user.recipes = user.recipes.filter(p => !p.equals(recipeId));
            await user.save();
            return user;
        }
        return user;
    } catch (error) {
        console.error(error);
        return {error:"could not add the recipe"};
    }
}

export const functions = {
    getAll,
    getById,
    getByProperty,
    create,
    login,
    register,
    update,
    remove,
    addRecipe,
    removeRecipe
}

export default functions;