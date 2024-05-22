import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    },
    
});

const recipeModel = mongoose.model("recipes",recipeSchema);

export default recipeModel;