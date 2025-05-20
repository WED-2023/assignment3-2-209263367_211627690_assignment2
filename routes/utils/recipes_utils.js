require('dotenv').config();
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
            apiKey: process.env.SPOONACULAR_API_KEY

        }
    });
}

async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function getRandomRecipes() {
    try {
        const response = await axios.get(`${api_domain}/random`, {
            params: {
                number: 3,
                apiKey: process.env.SPOONACULAR_API_KEY
            }
        });

        const recipes = response.data.recipes;


        return recipes.map(recipe => {
            let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe;

            return {
                id,
                title,
                readyInMinutes,
                image,
                popularity: aggregateLikes,
                vegan,
                vegetarian,
                glutenFree
            };
        });

    } catch (error) {
        console.error("Error fetching random recipes:", error.response?.data || error.message);
        throw error;
    }
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRandomRecipes = getRandomRecipes;



