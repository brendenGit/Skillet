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

    //requests that require auth
    async authedRequest(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

        //there are multiple ways to pass an authorization token, this is how you pass it in the header.
        //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${this.token}` };
        const params = (method === "get")
            ? data
            : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        };
    };

    //requests that do not require auth, these will only ever be get requests
    async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, method);

        const url = `${BASE_URL}/${endpoint}`;
        const params = data;

        try {
            const data = await axios({ url, method, params })
            console.log(data)
            return data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        };
    };

    /** get featured recipe */
    async getFeatured() {
        let res = await this.request(`recipes/featured`);
        return res.data.featuredRecipe[0];
    };

    /** get multiple recipes */
    async getRecipes(data) {
        console.log('making GET request to recipes/')
        console.log(data);
        let res = await this.request(`recipes/`, data);
        console.log(res.recipes);
        return res.data;
    };
};
