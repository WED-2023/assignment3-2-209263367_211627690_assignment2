const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){

  if (!user_id || !recipe_id) {
    throw { status: 400, message: "Missing user_id or recipe_id" }; 
  }

  const exists = await DButils.execQuery(`SELECT 1 FROM favorites WHERE user_id = '${user_id}' AND recipe_id = ${recipe_id}`);

  const origin = exists.length > 0 ? 'DB' : 'API';
  const insert = `INSERT INTO favorites (user_id, recipe_id, origin) VALUES ('${user_id}', ${recipe_id}, '${origin}')`;
  
  await DButils.execQuery(insert);

}

async function removeFavorite(user_id, recipe_id) {
  if (!user_id || !recipe_id) {
    throw { status: 400, message: "Missing user_id or recipe_id" };
  }
  await DButils.execQuery(
    `DELETE FROM favorites WHERE user_id = '${user_id}' AND recipe_id = ${recipe_id}`
  );
}

async function getFavoriteRecipesDB(user_id) {
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

async function getFavoriteRecipesORIGIN(user_id) {
  const result = await DButils.execQuery(`SELECT recipe_id, origin FROM favorites where user_id = ${user_id}`);
  return result; 
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

async function getMyFamilyRecipes(user_id){
    const result = await DButils.execQuery(`CALL get_family_recipes_by_user_id_json(${user_id})`);
    return result[0][0].family_recipes;
}

async function getLastWatchedRecipes(user_id) {
    const result = await DButils.execQuery(`CALL get_last_watched_recipes_json(${user_id})`);
    return result[0][0].last_watched_recipes;
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipesDB = getFavoriteRecipesDB;
exports.getFavoriteRecipesORIGIN = getFavoriteRecipesORIGIN;
exports.isRecipeFavorite = isRecipeFavorite;
exports.isRecipeViewed = isRecipeViewed;
exports.getMyRecipes = getMyRecipes;
exports.getMyFamilyRecipes = getMyFamilyRecipes;
exports.getLastWatchedRecipes = getLastWatchedRecipes;
exports.removeFavorite = removeFavorite;