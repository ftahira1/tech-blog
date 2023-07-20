const axios = require('axios');
// require('dotenv').config();


// https://api.giphy.com/v1/clips/search?api_key={API_KEY}&q=travel+the+world&limit=1 
 
const search = async (searchTerm) => {
    const cleanSearchTerm = searchTerm.replace(" ", "+"); 
    const response = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY }&q=${cleanSearchTerm}&limit=2`)
    return response;
};


module.exports = {
    search
};