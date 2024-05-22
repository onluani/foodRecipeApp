import recipeModel from "../../models/recipeModel.js";
import userController from "../users/userController.js";

const getAll = async()=> {
    try {
        if(!userId){
        const recipes = await recipeModel.find();
        return recipes;
    }
    const user =await userController.getById(userId);
    await user.populate("recipes");
    return user.recipes;
    } catch (error) {
        console.error(error);
        return [];
    }
}
const getById = async(id) =>{
    try {
        const recipe = await recipeModel.findById(id);
        if(!recipe){
            return null;
        }
        await recipe.populate("users");
        return recipe;
    } catch (error) {
        console.error(error);
        return null;
        
    }
}

const create = async(data) =>{
    try {
        const recipe = await recipeModel.create(data);
        recipe.users.push(data.owner);
        await recipe.save();
        await userController.addRecipe(data.owner,recipe._id);
        return recipe;
    } catch (error) {
        console.error(error); 
        return null;  
    }
}

const update = async(id,data) =>{
    try {
        const recipe = await recupeModel.findByIdAndUpdate(id,data);
        return recipe;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const remove = async(id) =>{
    try {
        const recipe = await recipeModel.findByIdAndDelete(id);
        await userController.removeRecipe(recipe.owner,id)
        return recipe;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const addUser = async(projectId,userId) =>{
    try {
        console.log("username",userId)
        const receta = await getById(recipeId);
        console.log("recipe",project);
        await userController.addRecipe(userId,recipeId)
        if(!recipe.users.includes(userId)){
            recipe.users.push(userId);
            await recipe.save();
            return recipe
        }
        return recipe;
    } catch (error) {
        return null;
    }
}
const removeUser = async(recipeId,userId)=>{
    try {
        console.log("removeUser",recipeId,userId)
        const recipe = await getById(recipeId);
        if(userId.equals(recipe.owner)){
            return {error:"The owner can not be deleted"};
        }
        await userController.removeRecipe(userId,recipeId);
        if(recipe.users.includes(userId)){
            recipe.users = recipe.users.filter(u=> !u.equals(userId));
            await recipe.save();
            return recipe
        }
        return recipe;
    } catch (error) {
        return null;
    }
}
export const functions = {
    getAll,
    getById,
    create,
    update,
    remove,
    addUser,
    removeUser,
}

export default functions;