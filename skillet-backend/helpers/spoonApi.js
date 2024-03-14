const axios = require('axios');
require("dotenv").config();

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class SpoonApi {

    static SKILLET_URL = "http://localhost:3001/recipes";
    static SEARCH_URL = "https://api.spoonacular.com/recipes/complexSearch";
    static RECIPE_INFO_URL = "https://api.spoonacular.com/recipes";
    static API_KEY = process.env.SPOON_API_KEY;

    /** makes call to spoon api to get data on multiple recipes
     * 
     * This does not provide a full set of information for the recipes 
     * returns json with a "results" key with an array value of recipe objects containing {id, title, image, imageType}
     * return data => { "results": [
        {
            "id": 1096217,
            "title": "Healthy Cabbage Soup with Spicy Kimchi",
            "image": "https://spoonacular.com/recipeImages/1096217-312x231.jpg",
            "imageType": "jpg"
        },
        {
            ...
        }
        }}
     * 
     */
    static async getRecipes(data) {
        console.debug("SPOON API Call:");
        try {
            const params = SpoonApi.buildParams(data);
            const url = axios.getUri({
                url: SpoonApi.SEARCH_URL,
                params: { apiKey: SpoonApi.API_KEY, ...params }
            });
            console.debug("Request URL:", url);
            const resp = await axios.get(url)
            const recipeData = await SpoonApi.getRecipeStats(resp.data.results)
            return recipeData;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        };
    };

    /** builds params for recipe api call */
    static buildParams({ query, cuisine, diet, type, number }) {
        const params = {};
        if (query) params.query = query;
        if (cuisine) params.cuisine = cuisine;
        if (diet) params.diet = diet;
        if (type) params.type = type;
        if (number) params.number = number;

        return params;
    };

    /** get recipe stats */
    static async getRecipeStats(recipes) {
        try {
            const resp = await axios.post(`${SpoonApi.SKILLET_URL}/stats`, { recipes: recipes });
            return resp.data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    /** makes call to spoon api to get recipe data */
    static async getRecipeInfo(recipeId) {
        console.debug("SPOON API Call:");
        try {
            const url = axios.getUri({
                url: `${SpoonApi.RECIPE_INFO_URL}/${recipeId}/information`,
                params: { apiKey: SpoonApi.API_KEY }
            });
            console.debug("Request URL:", url);
            const rawRecipeData = await axios.get(url)
            const cleanedData = await SpoonApi.cleanRecipeInfo(rawRecipeData.data);
            const finalRecipeData = await SpoonApi.getRecipeStats([cleanedData]);
            return finalRecipeData;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        };
    };

    /** cleans data structure after receiving recipe info */
    // need data in this form for ingredients { ingredientId: int, ingredientName: string, amount: int, unit: string, consistency: string (@SOLID OR @LIQUID) }
    static async cleanRecipeInfo(recipeData) {
        const ingredients = recipeData.extendedIngredients.map(ingredient => {
            const ingredientObj = {};
            ingredientObj.ingredientId = ingredient.id;
            ingredientObj.ingredientName = ingredient.nameClean;
            ingredientObj.amount = ingredient.amount;
            ingredientObj.unit = ingredient.unit;
            ingredientObj.consistency = ingredient.consistency;
            return ingredientObj
        });

        const instructions = recipeData.analyzedInstructions[0].steps.map(step => {
            return { number: step.number, instruction: step.step };
        });

        const cleanedRecipe = {
            id: recipeData.id,
            title: recipeData.title,
            sourceName: recipeData.sourceName,
            sourceUrl: recipeData.sourceUrl,
            imageUrl: recipeData.image,
            summary: recipeData.summary,
            readyInMinutes: recipeData.readyInMinutes,
            servings: recipeData.servings,
            ingredients,
            instructions,
        };

        return cleanedRecipe;
    };
};

module.exports = SpoonApi;
