const axios = require("axios");

function pinterest(query, count = "5") {
  count = parseInt(count);
  return new Promise((resolve, reject) => {
    axios.get(
      `https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`
    )
      .then((response) => {
        const results = response.data.resource_response.data.results;
        const maxLength = results.length;
        const getRandomIndexes = (maxLength, count) => {
          const indexes = [];
          while (indexes.length < count) {
            const randomIndex = Math.floor(Math.random() * maxLength);
            if (!indexes.includes(randomIndex)) {
              indexes.push(randomIndex);
            }
          }
          return indexes;
        };

        const randomIndexes = getRandomIndexes(maxLength, count);
        const randomImages = randomIndexes.map(index => ({
          url: results[index].images.orig.url
        }));
        resolve(randomImages);
      })
      .catch((error) => {
        reject(error);
      });
  });

                      };

module.exports = { pinterest };
