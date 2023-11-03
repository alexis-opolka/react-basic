import { STABILITY_AI_API_ENDPOINT, STABILITY_AI_API_KEY } from "../env.mjs";

export function generateImageFromPrompt(promptContent){

    // Construct the HTTP Body
    const form = new FormData()
    form.append('prompt', promptContent);

    // construct the HTTP request
    const url = `${STABILITY_AI_API_ENDPOINT}`;
    const options = {
        method: "POST",
        headers: {
            "x-api-key": STABILITY_AI_API_KEY
        },
        body: form
    };

    // make the HTTP request
    return fetch(url, options)
        .then(response => response.arrayBuffer())
        .catch(error => console.log(error))
}