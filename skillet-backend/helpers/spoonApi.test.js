const SpoonApi = require("./spoonApi");

/************************************** normalizeUnit */

describe('check variables', () => {
    test('it should return the correct variables', () => {
        expect(SpoonApi.SEARCH_URL).toEqual("https://api.spoonacular.com/recipes/complexSearch");
        expect(SpoonApi.RECIPE_INFO_URL).toEqual("https://api.spoonacular.com/recipes");
        expect(typeof SpoonApi.API_KEY).toBe('string');
        expect(SpoonApi.API_KEY.length).toEqual(32);
    });
});

describe("get single recipe's information", () => {
    test('it should return the correct variables', async () => {
        const recipeData = await SpoonApi.getRecipeInfo(1096217);
        expect(typeof recipeData).toBe('object');
    });
});

describe('get multiple recipes', () => {
    test('it should return recipes', async () => {
        const data = {
            query: "chicken"
        }
        const recipeData = await SpoonApi.getRecipes(data);
        expect(recipeData.length).toEqual(10);
    });

    test('it works with cuisine query', async () => {
        const data = {
            cuisine: "korean",
            number: 1
        }
        const recipeData = await SpoonApi.getRecipes(data);
        expect(recipeData.length).toEqual(1);
    });

    test('it works with diet query', async () => {
        const data = {
            diet: "vegetarian",
            number: 1
        }
        const recipeData = await SpoonApi.getRecipes(data);
        expect(recipeData.length).toEqual(1);
    });

    test('it works with number query', async () => {
        const data = {
            query: "chicken",
            number: 1
        }
        const recipeData = await SpoonApi.getRecipes(data);
        expect(recipeData.length).toEqual(1);
    });
});