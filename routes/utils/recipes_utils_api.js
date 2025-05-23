const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

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
    getRandomRecipes,
}