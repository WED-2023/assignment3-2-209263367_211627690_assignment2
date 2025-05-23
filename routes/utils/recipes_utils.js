require("dotenv").config();
const user_utils = require("./user_utils");
const api_utils = require("./recipes_utils_api");

async function getRandomRecipes(recipe_id)
{
    return await api_utils.getRandomRecipes(recipe_id);
}

async function getRecipeDetails(recipe_id, user_id) {
    let recipe_info = await api_utils.getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    let is_favorite = false;
    let is_viewed = false;
    //let user_saved_this_recipe = false;
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


module.exports = {
  getRecipeDetails,
  getRandomRecipes
};



