import axios from "axios";

const BASE_URL = "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

export default class SkilletApi {
    // the token for interactive with the API will be stored here.
    constructor(token) {
        this.token = token || "";
    }

    async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

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
        let featuredRecipe = await this.request(`recipes/featured`);
        return featuredRecipe.featuredRecipe[0];
    };

    async getRecipe(recipeId) {
        let recipe = await this.request(`recipes/${recipeId}/info`);
        return recipe.recipe[0];
    };

    /** get random recipes */
    async getRandom(data) {
        let randomRecipes = await this.request(`recipes/random/`, data);
        return randomRecipes;
    };

    /** get search recipes */
    async getSearch(data) {
        let searchRecipes = await this.request(`recipes/search/`, data);
        return searchRecipes;
    };


    /** Users */
    /** attempt login */
    async login(data) {
        const { username, password } = data;
        try {
            let tokenRes = await this.request(`auth/token`, { username, password }, 'post');
            this.token = tokenRes.token;
            let userRes = await this.request(`users/${username}`);
            const data = {
                token: this.token,
                user: { ...userRes.user }
            };
            return data;
        } catch (error) {
            throw new Error(`Authentication failed: ${error}`);
        };
    };

    /** attempt registration */
    async register(data) {
        const { username, password, firstName, lastName, email } = data;
        try {
            let res = await this.request(`auth/register`, { username, password, firstName, lastName, email }, 'post');
            console.log('skilletApi res')
            console.log(res);
            return res;
        } catch (error) {
            throw new Error(`Registration failed: ${error}`);
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
