const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */

async function getRandomRecipesRaw() {
  const response = await axios.get(`${api_domain}/random`, {
    params: {
      number: 3,
      apiKey: process.env.spooncular_apiKey,
    },
  });
  return response.data.recipes;
}

async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipeInstructions(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/analyzedInstructions`, {
        params: {
            id: recipe_id,
            stepBreakdown: true,
            apiKey: process.env.spooncular_apiKey
        }
    });
}


module.exports = {
  getRandomRecipesRaw,
  getRecipeInformation,
  getRecipeInstructions,
};