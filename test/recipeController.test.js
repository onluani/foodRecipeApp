import connectDB from "../src/config/mongo.js";
import mongoose from 'mongoose';
import recipeController from "../src/controllers/recipes/recipeController.js";
import userController from "../src/controllers/users/userController.js"

let recipeId = null;
let userId = null;
let newUser;
describe("Test de recipeController",()=>{
    beforeAll(async ()=>{
        await connectDB();
        try{
            await mongoose.connection.collections["reipes"].drop();
            newUser = await userController.getByProperty("email","mail");
            if(!newUser){
                newUser = await userController.create({username:"name",email:"mail",password:"1234"});
            }
        }
        catch(error){
            console.error(error);
        }
    })
    afterAll(async()=>{
        await mongoose.connection.close();
    })

    test("Create Project",async()=>{
        const users = await userController.getAll();
        console.log("username",users[0])
        const recipeData = {
            name: "test",
            owner: users[0],
            users:users
        }
        const recipe = await recipeController.create(recipeData)
        recipeId = recipe._id;
        expect(recipe).not.toBeNull();
        expect(recipe.owner).toEqual(users[0]._id);
    })
    test("Add username",async()=>{
        
        userId = newUser._id;
        const recipe = await recipeController.addUser(recipeId,newUser._id);
        expect(recipe).not.toBeNull();
        expect(recipe.users).toContain(newUser._id);

    })
    test("Remove username",async()=>{
        const recipe = await recipeController.removeUser(recipeId,userId);
        expect(recipe).not.toBeNull();
        expect(recipe.users).not.toContain(userId);
    })
})