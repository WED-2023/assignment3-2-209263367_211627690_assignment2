const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
require("dotenv").config();
const user = require("./user_utils");


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeDetails(recipe_id, user_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    let is_favorite = false;
    let is_viewed = false;
    //let user_saved_this_recipe = false;
    is_favorite = await user.isRecipeFavorite(user_id ,recipe_id);
    is_viewed = await user.isRecipeViewed(user_id ,recipe_id);

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




async function getRandomRecipes() {
  try {
    const response = await axios.get(`${api_domain}/random`, {
      params: {
        number: 3,
        apiKey: process.env.spooncular_apiKey
      }
    });

    const recipeIDs = response.data.recipes.map(r => r.id);
    const promises = recipeIDs.map(getRecipeDetails);
    const details = await Promise.all(promises);
    return details;

  } catch (error) {
    console.error("Error in get3RandomRecipes:", error.response?.data || error.message);
    throw error;
  }
}


module.exports = {
  getRecipeInformation,
  getRecipeDetails,
  getRandomRecipes
};



