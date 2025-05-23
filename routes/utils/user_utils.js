const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favorites values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id) {
  const result = await DButils.execQuery(`CALL my_favorite_json(${user_id})`);
  return result[0][0].favorite_recipes; 
//   [
//   [ // index 0 - rows returned by SELECT inside the procedure
//     {
//       favorite_recipes: '[{...}, {...}]' // JSON string בתוך אובייקט
//     }
//   ],
//   [ // index 1 - metadata (fields, column info, וכו')
//     ...
//   ]
// ]
}


async function isRecipeFavorite(user_id, recipe_id){
    const result = await DButils.execQuery(
    `SELECT 1 FROM favorites WHERE user_id = ${user_id} AND recipe_id = ${recipe_id}`
  );
  return result.length > 0;
}

async function isRecipeViewed(user_id, recipe_id){
    const result = await DButils.execQuery(
    `SELECT 1 FROM views WHERE user_id = ${user_id} AND recipe_id = ${recipe_id}`
  );
  return result.length > 0;
}

async function getMyRecipes(user_id){
    const result = await DButils.execQuery(`CALL get_my_recipes_json(${user_id})`);
    return result[0][0].recipes;
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.isRecipeFavorite = isRecipeFavorite;
exports.isRecipeViewed = isRecipeViewed;
exports.getMyRecipes = getMyRecipes;
