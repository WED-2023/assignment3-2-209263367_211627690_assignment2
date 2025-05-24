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
  const userId = req.body.userId; 

  console.log("Received request for recipe details");
  console.log("recipeId", recipeId);
  console.log("userId", userId);

  try {
    const recipe = await recipes_utils.getRecipeDetails(recipeId, userId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get('/PreviewRecipe/:recipeId', async (req, res, next) => {
  const recipeId = req.params.recipeId;
  const userId = req.body.userId; 

  console.log("PreviewRecipe called");
  console.log("recipeId", recipeId);
  console.log("userId", userId);

  try {
    const recipe = await recipes_utils.getFullRecipeDetails(recipeId, userId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.post('/CreateNewRecipe', async (req, res, next) => {
  const user_id = req.session.user_id;

  const {
    title,
    image_url,
    prep_time,
    servings,
    instructions,
    extendedIngredients,
    likes_count,
    is_vegan,
    is_vegetarian,
    is_gluten_free
  } = req.body;

  console.log("CreateNewRecipe called");
  console.log("userId", user_id);

  let recipe_json = {
    user_id,
    title,
    image_url,
    prep_time,
    servings,
    instructions,
    extendedIngredients,
    likes_count,
    is_vegan,
    is_vegetarian,
    is_gluten_free
  };
  try {
    const recipe = await recipes_utils.CreateNewRecipe(recipe_json);
    res.status(200).send({ message: "Recipe added", success: true });
  } catch (error) {
    next(error);
  }
});




module.exports = router;