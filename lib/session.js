const fs = require('fs');
const { writeFile } = require('fs/promises');
const axios = require("axios");

module.exports = {
    /**
     * Write Session To file
     * @param {string} session_id The Unique Id That you got
     * @param {string} authFile The Session File name
     * Default Session name is "authfile"
     *
     * Make sure to Define global.authfile Before function
     *
     * Initialize at the top Body
     *
     * Make Sure To Give a timeout of minimum 3 seconds for the Waconnection Function
     */
    async MakeSession(session_id, authFile) {
        return new Promise(async (resolve, reject) => {
            try {
                const encodedBase = "aHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vVFNIRVBINE5HLw==";
                const baseUrl = Buffer.from(encodedBase, "base64").toString("utf-8");
                const response = await axios.get(`${baseUrl}${session_id}/raw`);
                
                if (response.status === 200 && response.data) {
                    if (!fs.existsSync(authFile)) {
                
                        const data = JSON.stringify(response.data, null, 2);
                        await writeFile(authFile, data);
                        resolve(true);
                    } else {
                        resolve(true);
                    }
                } else {
                    reject(new Error("Failed to fetch session data"));
                }
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    },
};
