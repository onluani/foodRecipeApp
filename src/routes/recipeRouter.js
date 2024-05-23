import {Router} from "express";
import recipeApiController from "../controllers/recipes/recipeApiController.js";

const router  = Router();

router.get("/",recipeApiController.getAll);
router.get("/:id",recipeApiController.getById);
router.post("/",recipeApiController.create);
router.put("/:id",recipeApiController.update);
router.delete("/:id",recipeApiController.remove);
router.post("/:id/user",recipeApiController.addUser);
router.delete("/:id/user",recipeApiController.removeUser);

export default router;