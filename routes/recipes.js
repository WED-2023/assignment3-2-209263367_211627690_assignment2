var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

router.get('/search', async (req, res, next) => {
  let input_json = {};
  try {
    const {
      query = '',
      cuisine = '',
      diet = '',
      intolerances = '',
      number = 5,
      sort = '' // preparationTime | popularity
    } = req.query;

    // Map local sort option to Spoonacular sort param
    const sortMap = {
      preparationTime: 'readyInMinutes',
      popularity: 'popularity'
    };

    input_json = {
      query,
      cuisine,
      diet,
      intolerances,
      number: parseInt(number, 10),
      sort: sortMap[sort] || ''
    };
    const response = await recipes_utils.searchRecipes(input_json);

    const results = response;

    if (!results || results.length === 0) {
      res.status(200).send({ message: 'No recipes found', results: [] });
    } else {
      res.status(200).send(results);
    }

  } catch (error) {
    console.error("Error in /Search route:", error);
    res.status(500).send({ message: "Failed to fetch recipes", error: error.message });
  }
});

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
    res.status(200).send({recipe, origin: 'API'});
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
    console.error("Error creating new recipe:", error);
    if (error.message === 'Invalid recipe data') {
      res.status(400).send({ message: error.message, success: false });
      return;
    }
    res.status(500).send({ message: error.message, success: false });
    next(error);
  }
});

/** 
 * Set recipe as viewed
 */
router.post('/viewed', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    // Client should send the origin of the view.
    // The image should contain spoonacular -> 'API' or 'DB'.
    // Client is responsible for sending the correct origin.
    const origin = req.body.origin;
    
    await user_utils.markAsViewed(user_id, recipe_id, origin);
    res.status(200).send("The Recipe successfully marked as viewed");
    
  } catch (error) {
    next(error);
  }
});




module.exports = router;