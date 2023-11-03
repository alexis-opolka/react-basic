import { AZURE_API_ENDPOINT, AZURE_API_KEY } from "../env.mjs"

// call the Azure AI Vision service Image Analysis 4.0 API endpoint in the France Central region
// and return the JSON response
export function analyzeImageFromURL(promptContent){

    // construct the HTTP request
    const url = `${AZURE_API_ENDPOINT}/vision/v3.0/analyze?visualFeatures=Description&language=en`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": AZURE_API_KEY
        },
        body: JSON.stringify({
            url: promptContent
        })
    };

    // make the HTTP request
    return fetch(url, options)
        .then(response => response.json())
        .catch(error => console.log(error))
}

export function analyzeImageFromPrompt(promptContent) {
    // construct the HTTP request
    const url = `${AZURE_API_ENDPOINT}/vision/v3.0/analyze?visualFeatures=Description&language=en`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/octet-stream",
            "Ocp-Apim-Subscription-Key": AZURE_API_KEY
        },
        body: promptContent
    };

    // make the HTTP request
    return fetch(url, options)
        .then(response => response.json())
        .catch(error => console.log(error))
}