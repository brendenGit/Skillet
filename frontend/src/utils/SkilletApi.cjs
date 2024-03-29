import axios from "axios";


const BASE_URL = "https://skillet.onrender.com";

export default class SkilletApi {
    constructor(token) {
        this.token = token || "";
    }

    async request(endpoint, data = {}, method = "get") {
        // uncomment for debugging
        // console.debug("API Call:", endpoint, data, method);

        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${this.token}` };

        const config = {
            url,
            method,
            headers,
            ...(method === 'get' ? { params: data } : { data })
        };

        try {
            const res = await axios(config);
            return res.data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response?.data?.error?.message || "An unknown error occurred";
            throw new Error(message);
        }
    }



    /** Recipes */
    /** get featured recipe */
    async getFeatured() {
        try {
            let featuredRecipe = await this.request(`recipes/featured`);
            return featuredRecipe.featuredRecipe[0];
        } catch (error) {
            throw new Error(`Failed to retrieve featured recipe: ${error}`);
        };
    };

    // get a single recipes info
    async getRecipe(recipeId) {
        try {
            let recipe = await this.request(`recipes/${recipeId}/info`);
            return recipe.recipe[0];
        } catch (error) {
            throw new Error(`Failed to get recipe: ${error}`);
        };
    };

    /** get random recipes */
    async getRandom(data) {
        try {
            let randomRecipes = await this.request(`recipes/random/`, data);
            return randomRecipes;
        } catch (error) {
            throw new Error(`Failed to get recipes: ${error}`);
        };
    };

    /** get search recipes */
    async getSearch(data) {
        try {
            let searchRecipes = await this.request(`recipes/search/`, data);
            return searchRecipes;
        } catch (error) {
            throw new Error(`Failed to get recipes: ${error}`);
        };
    };

    /** save a recipe */
    async saveRecipe(username, recipeId) {
        try {
            let savedRecipe = await this.request(`recipes/${username}/saved/${recipeId}`, {}, "POST");
            return savedRecipe;
        } catch (error) {
            throw new Error(`Failed to save recipe: ${error}`);
        };
    };

    /** remove a saved recipe */
    async removeSavedRecipe(username, recipeId) {
        try {
            let removedSavedRecipe = await this.request(`recipes/${username}/saved/${recipeId}`, {}, "DELETE");
            return removedSavedRecipe;
        } catch (error) {
            throw new Error(`Failed to remove saved recipe: ${error}`);
        };
    };

    /** rate a recipe */
    async rateRecipe(username, recipeId, rating) {
        try {
            let ratedRecipe = await this.request(`recipes/${username}/rate/${recipeId}`, { rating }, "POST");
            return ratedRecipe;
        } catch (error) {
            throw new Error(`Failed to rate recipe: ${error}`);
        };
    };


    /** Users */
    /** attempt login */
    async login(data) {
        const { username, password } = data;
        try {
            let res = await this.request(`auth/token`, { username, password }, 'post');
            this.token = res.token;
            return res;
        } catch (error) {
            throw new Error(`Authentication failed: ${error}`);
        };
    };

    /** attempt registration */
    async register(data) {
        const { username, password, firstName, lastName, email } = data;
        try {
            let res = await this.request(`auth/register`, { username, password, firstName, lastName, email }, 'post');
            return res;
        } catch (error) {
            throw new Error(`Registration failed: ${error}`);
        };
    };

    /** get users saved recipes */
    async getSaved(username) {
        try {
            let res = await this.request(`recipes/${username}/saved`);
            return res;
        } catch (error) {
            throw new Error(`Error retrieving saved recipes: ${error}`);
        };
    };

    /** get users rated recipes */
    async getRated(username) {
        try {
            let res = await this.request(`recipes/${username}/rated`);
            return res;
        } catch (error) {
            throw new Error(`Error retrieving rated recipes: ${error}`);
        };
    };


    /** attempt user info update */
    async update(data) {
        const { username, firstName, lastName, email } = data;
        try {
            let res = await this.request(`users/${username}`, { firstName, lastName, email }, 'patch');
            return res;
        } catch (error) {
            throw new Error(`Update failed: ${error}`);
        };
    };
};
