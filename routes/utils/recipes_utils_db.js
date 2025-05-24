const DButils = require("../utils/DButils"); // ודא שזה הנתיב לקובץ שמבצע את השאילתה

async function createNewRecipe(recipe_json) {
  const {
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
  } = recipe_json;

  try {

    const query = `
    INSERT INTO recipeswebsite.recipes
    (user_id, title, image_url, prep_time, servings, instructions,
    extendedIngredients, likes_count, is_vegan, is_vegetarian, is_gluten_free)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const values = [
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
    ];

    console.log("SQL QUERY:", query);
    console.log("VALUES:", values);

    await DButils.execQuery(query, values);
    console.log("Recipe successfully inserted");
  } catch (err) {
    console.error("Error inserting recipe:", err);
    throw err;
  }
}





exports.createNewRecipe = createNewRecipe;