var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT id FROM users").then((users) => {
      if (users.find((x) => x.id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const favorite_recipes = await user_utils.getFavoriteRecipes(user_id);
    res.status(200).json(favorite_recipes);
  } catch (error) {
    next(error);
  }
});

router.get('/myRecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const my_recipes = await user_utils.getMyRecipes(user_id);
    res.status(200).json(my_recipes);
  } catch (error) {
    next(error);
  }
});

router.get('/myFamilyRecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const my_family_recipes = await user_utils.getMyFamilyRecipes(user_id);
    res.status(200).json(my_family_recipes);
  } catch (error) {
    next(error);
  }
});

router.get('/lastWatchedRecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;

    const last_watched = await user_utils.getLastWatchedRecipes(user_id);
    const recipeDetailsPromises = last_watched.map(async (entry) => {
      if (entry.origin === "API") {
        return await recipe_utils.getRecipeDetails(entry.recipe_id, user_id);
      } else if (entry.origin === "DB") {
        return await recipe_utils.getRecipeFromDB(entry.recipe_id, user_id);
      } else {
        throw new Error(`Unknown recipe origin: ${entry.origin}`);
      }
    });
    const detailedRecipes = await Promise.all(recipeDetailsPromises);
    res.status(200).json(detailedRecipes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
