require("dotenv").config();
const user_utils = require("./user_utils");
const api_utils = require("./recipes_utils_api");
const db_utils = require("./recipes_utils_db");

async function getRandomRecipes() {
  const raw_recipes = await api_utils.getRandomRecipesRaw();
  const promises = raw_recipes.map((r) => getRecipeDetails(r.id));
  return await Promise.all(promises);
}

async function getRecipeDetails(recipe_id, user_id=null) {
    let recipe_info = await api_utils.getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    let is_favorite = false;
    let is_viewed = false;
    is_favorite = await user_utils.isRecipeFavorite(user_id ,recipe_id);
    is_viewed = await user_utils.isRecipeViewed(user_id ,recipe_id);

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        favorite: is_favorite,
        viewed: is_viewed
    }
}

async function getFullRecipeDetails(recipe_id, user_id=null) {
    let recipe_info = await api_utils.getRecipeInformation(recipe_id);
    let recipe_instructions = await api_utils.getRecipeInstructions(recipe_id);
    let recipe_instructions_as_string = "";
    try {
      recipe_instructions_as_string = recipe_instructions.data[0].steps.map((step) => step.step).join("\n");
    }
    catch (error) {
      recipe_instructions_as_string = "No instructions available.";
    }
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, servings, extendedIngredients} = recipe_info.data;
    try {
      extendedIngredients = extendedIngredients.map((ingredient) => ingredient.original).join("\n");
    }
    catch (error) {
      extendedIngredients = "No ingredients available.";
    }
    let is_favorite = false;
    let is_viewed = false;
    is_favorite = await user_utils.isRecipeFavorite(user_id ,recipe_id);
    is_viewed = await user_utils.isRecipeViewed(user_id ,recipe_id);

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        favorite: is_favorite,
        viewed: is_viewed,
        amount: servings,
        ingredients: extendedIngredients,
        instructions: recipe_instructions_as_string
    }
}

async function CreateNewRecipe(recipe_json) {
  // Validate the recipe_json object
  if (!recipe_json || !recipe_json.title || !recipe_json.image_url || !recipe_json.prep_time || !recipe_json.servings || !recipe_json.instructions) {
    throw new Error("Invalid recipe data");
  }

  // Create a new recipe in the database
  const newRecipe = await db_utils.createNewRecipe(recipe_json);
  
  // Return the newly created recipe
  return newRecipe;
}


module.exports = {
  getRecipeDetails,
  getRandomRecipes,
  getFullRecipeDetails,
  CreateNewRecipe,
};

