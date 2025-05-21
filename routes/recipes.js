var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

router.get("/random", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.getRandomRecipes();
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  const recipeId = req.params.recipeId;
  const userId = req.body.userId; // ✅ GET-safe

  console.log("recipeId", recipeId);
  console.log("userId", userId);

  try {
    const recipe = await recipes_utils.getRecipeDetails(recipeId, userId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});





module.exports = router;