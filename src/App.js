import React, { useState } from 'react';
import {analyzeImageFromPrompt, analyzeImageFromURL} from "./components/azure-image-analysis";
import {generateImageFromPrompt} from "./components/stability-text-2-image";
import { AZURE_API_ENDPOINT, AZURE_API_KEY, STABILITY_AI_API_ENDPOINT, STABILITY_AI_API_KEY } from './env.mjs';

function isConfigured(){
  // Checks that the required environment variables are set.
  // We need to ensure that the Azure API and Stability-AI API configurations
  // are set before we can make calls to them.
  // For this challenge, we will test for the presence of the Keys
  // then try to make a call to the API to ensure that the API is configured
  // correctly.

  // Azure API
  const azureAPI = fetch(`${AZURE_API_ENDPOINT}/vision/v3.0/analyze?visualFeatures=Description&language=en`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": AZURE_API_KEY
    }
  }).then(async response => {
    return await response.json()
  }).then(data => {
    if (data.code === "InvalidImageUrl") {
      // We purposely sent a POST request without body
      // to trigger this error, so we can safely say that
      // the Azure API is configured correctly
      return true;
    } else {
      return false;
    }
  })
  // Stability-AI API
  const stabilityAPI = fetch(STABILITY_AI_API_ENDPOINT, {
    method: "POST",
    headers: {
      "x-api-key": STABILITY_AI_API_KEY
    }
  }).then(async response => {
    return await response.json()
  }).then(data => {
    if (data.error === "The request is missing a required field: prompt") {
      return true;
    } else {
      return false;
    }
  })

  console.log("AZURE + STABILITY-AI:", azureAPI, stabilityAPI, azureAPI && stabilityAPI)

  if (azureAPI && stabilityAPI) {
    return true;
  } else {
    return false;
  }
}


export default function App() {

  const [promptedData, setPromptedData] = useState("");
  const [resultData, setResultData] = useState("");

  const isConfigurationWorking = isConfigured();

  return (
    <>
      {
        isConfigurationWorking === true ? (
        <div>
          <p>
            <h1>Computer Vision Challenge by <a href='https://learn.microsoft.com'>Microsoft Learn</a> </h1>
          </p>
          <p>
            Insert URL or Type a prompt:
            <input type="text" name="prompt" />
            <button onClick={() => {
              const inputValue = document.getElementsByName("prompt")[0].value;
              setPromptedData(inputValue);

              // Let's send the data to the Azure AI Vision service
              analyzeImageFromURL(inputValue)
              .then(response => setResultData(response))
              .catch(error => console.log(error))
            }}>Analyze</button>
            <button onClick={() => {
              const inputValue = document.getElementsByName("prompt")[0].value;
              
              generateImageFromPrompt(inputValue)
              .then(response => {
                const responseBlob = new Blob([response], {type: 'image/png'});
                setPromptedData(URL.createObjectURL(responseBlob));
                analyzeImageFromPrompt(responseBlob).then(
                  response => setResultData(response)
                )
              })
              .catch(error => console.log(error))

            }}>Generate</button>
          </p>
          <DisplayResults prompt={promptedData} result={resultData} />
        </div>
        ) : (
          <div className='warning'>
            <h1>Configuration Error</h1>
            <p>
              Please ensure that you have configured the Azure API and Stability-AI API correctly.
              <br />
              See the <a href='https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/how-to/call-analyze-image-40?tabs=rest&WT.mc_id=academic-105496-cacaste&pivots=programming-language-rest-api#authenticate-against-the-service'>Azure Documentation</a> and <a href="https://clipdrop.co/apis/docs/text-to-image#text-to-image-api">Stability-AI Documentation</a> for more information.
           </p>
          </div>
        )
      }
    </>
  )
}

function DisplayResults({
  prompt,
  result
}){

  return(
    <p>
      <hr />
      <h1> Computer Vision Analysis</h1>

      <img src={prompt} alt='Computer Vision prompt' width={300} />
      
      <p>
        <h2>JSON Result</h2>
        <pre style={{
          fontSize: "1.2rem",
        }}>
          <code>
            {JSON.stringify(result, null, 2)}
          </code>
        </pre>
      </p>
    </p>
  )

}