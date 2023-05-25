const dropdownButton = document.querySelector(".dropdown-btn");
const dropdownContent = document.querySelector(".dropdown-content");
const bodyTag = document.body;
const themeCheckbox = document.querySelector(".theme-checkbox");
const moonIcon = document.querySelector(".moon-icon");
const spanText = document.querySelector("#span-text");
const inputElement = document.querySelector(".input-container__input");
const searchIcon = document.querySelector(".input-container__icon");
const errorModal = document.querySelector(".error-modal");
const termMeaningWrapper = document.querySelector(".term-meaning-wrapper");
const wordSpelling = document.querySelector("#word-spelling");
const phoneticRepresentation = document.querySelector("#word-phonetic");
const playIcon = document.querySelector(".icon-play");
const playIcon2 = document.querySelector(".icon-play-2");

const iconNewWindow = document.querySelector(".icon-new-window");
const blankInputWarnSpanTag = document.querySelector(".input-container__span");
const synonymsContainer = document.querySelector(".synonyms-container div");
const termMeaningWrapper_2 = document.querySelector(".term-meaning-wrapper__2");
const termMeaningWrapper_2ListNoun = document.querySelector(
  ".term-meaning-wrapper__2--list-noun"
);
const sourceUrl = document.querySelector(".source-url-container a");
let count = 0;
const termMeaningWrapper_2HeadingNoun = document.querySelector(
  ".term-meaning-wrapper__2--heading-cont-noun"
);
const termMeaningWrapper_2MeaningText = document.querySelector(
  ".term-meaning-wrapper__2--meanings-cont-noun span"
);
const termMeaningWrapper_2ListVerb = document.querySelector(
  ".term-meaning-wrapper__2--list-verb"
);
const termMeaningWrapper_2HeadingVerb = document.querySelector(
  ".term-meaning-wrapper__2--heading-cont-verb"
);
const termMeaningWrapper_2MeaningTextVerb = document.querySelector(
  ".term-meaning-wrapper__2--meanings-cont-verb span"
);
const themeSwitchingSound = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"
);
let wordSynonymsArray = [];

let sound = "";

let audioNotFoundMessage = new SpeechSynthesisUtterance("Audio Not Available");
audioNotFoundMessage.voice = speechSynthesis.getVoices()[0];
audioNotFoundMessage.pitch = 1.5;
audioNotFoundMessage.rate = 0.8;

function dropdownContentClickHandler(event) {
  event.preventDefault();
  if (event.target.nodeName === "A") {
    const selectedFontFamily = event.target.innerText;
    if (selectedFontFamily === "Sans Serif") {
      if (bodyTag.classList.contains("dark-theme")) {
        bodyTag.className = "";
        bodyTag.classList.add("dark-theme");
      } else {
        bodyTag.className = "";
      }
      bodyTag.classList.toggle("sans-serif");
      spanText.innerText = "Sans Serif";
    }
    if (selectedFontFamily === "Serif") {
      if (bodyTag.classList.contains("dark-theme")) {
        bodyTag.className = "";
        bodyTag.classList.add("dark-theme");
      } else {
        bodyTag.className = "";
      }
      bodyTag.classList.toggle("serif");
      spanText.innerText = "Serif";
    }
    if (selectedFontFamily === "Mono") {
      if (bodyTag.classList.contains("dark-theme")) {
        bodyTag.className = "";
        bodyTag.classList.add("dark-theme");
      } else {
        bodyTag.className = "";
      }
      bodyTag.classList.toggle("mono");
      spanText.innerText = "Mono";
    }
  }
}

function themeCheckboxChangeHandler() {
  bodyTag.classList.toggle("dark-theme");
  themeSwitchingSound.play();
}

function dropdownButtonClickHandler(event) {
  event.preventDefault();
  console.log("Reached Here!");
  dropdownContent.classList.toggle("show-dropdown-content");
}

dropdownContent.addEventListener(
  "click",

  dropdownContentClickHandler
);

function checkTargetValues(targetValue) {
  const isMatchFound =
    targetValue === "DIV" ||
    targetValue === "MAIN" ||
    targetValue === "HTML" ||
    targetValue === "BODY"
      ? true
      : false;
  return isMatchFound;
}

function windowClickHandler(event) {
  if (checkTargetValues(event.target.nodeName)) {
    dropdownContent.classList.remove("show-dropdown-content");
  }
}
async function fetchWordMeaning(searchText) {
  try {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchText}`;
    const response = await fetch(apiUrl); // Fetch data from the API

    // Check if the response is not successful or if the status is 404 (Not Found)
    if (response.ok === false || response.status === 404) {
      termMeaningWrapper.classList.add("hide-term-meaning-wrapper"); // Hide the term meaning wrapper
      errorModal.classList.add("show-error-modal"); // Show the error modal
      return; // Return undefined
    } else {
      errorModal.classList.remove("show-error-modal"); // Remove the error modal
      termMeaningWrapper.classList.remove("hide-term-meaning-wrapper"); // Show the term meaning wrapper

      const jsonData = await response.json(); // Parse the response as JSON
      return jsonData; // Return the parsed JSON data
    }
  } catch (error) {
    throw error; // Throw the error to be caught by the caller
  }
}

function isValidURL(url) {
  if (url) {
    return url.startsWith("http://") || url.startsWith("https://");
  }
}

function findValidURL(urls) {
  return urls.find((url) => isValidURL(url));
}

function generateAudio(url) {
  if (url) {
    sound = new Audio(url);
  }
}

function removeAllChildElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function mergeArrays(arr) {
  const merged = [];
  for (let subArr of arr) {
    for (let element of subArr) {
      if (!merged.includes(element)) {
        merged.push(element);
      }
    }
  }
  return merged;
}

function powerTheUI(wordMeaning) {
  console.log(wordMeaning);

  // Get word and phonetic from wordMeaning object
  const { word, phonetic } = wordMeaning[0];

  // Update UI with word and phonetic
  wordSpelling.innerText = word;
  phonetic
    ? (phoneticRepresentation.innerText = phonetic)
    : (phoneticRepresentation.innerText = "");

  // Get audio URL and generate audio
  const phoneticsAudioUrls = wordMeaning[0].phonetics.map((phoneticObj) => {
    if (phoneticObj.audio.length > 0) {
      return phoneticObj.audio;
    }
  });
  const audioUrl = findValidURL(phoneticsAudioUrls);
  generateAudio(audioUrl);

  // Get parts of speech and their respective definitions
  const partsOfSpeeches = getDeepNestedValues(wordMeaning, "partOfSpeech");
  const definitions = getDeepNestedValues(wordMeaning, "definitions");
  const wordSynonyms = getDeepNestedValues(wordMeaning, "synonyms").filter(
    (synonymArr) => synonymArr.length > 0
  );
  wordSynonymsArray = mergeArrays(wordSynonyms);
  // Create arrays for noun, adjective, and adverb definitions
  const nounDefinitionsArray = [];
  const verbDefinitionsArray = [];

  // Loop through parts of speech and definitions to fill the arrays
  partsOfSpeeches.map((partOfSpeech, index) => {
    if (partOfSpeech === "noun") {
      nounDefinitionsArray.push(definitions[index]);
    }
    if (partOfSpeech === "verb") {
      verbDefinitionsArray.push(definitions[index]);
    }
  });

  // Get the definition array for each part of speech
  const nounDefinitions = getDeepNestedValues(
    nounDefinitionsArray[0],
    "definition"
  );
  const verbDefinitions = getDeepNestedValues(
    verbDefinitionsArray[0],
    "definition"
  );
  console.log(nounDefinitions);
  console.log(partsOfSpeeches);
  console.log(verbDefinitions);
  const uniquePartOfSpeeches = [];
  partsOfSpeeches.map((partOfSpeech) => {
    if (!uniquePartOfSpeeches.includes(partOfSpeech)) {
      uniquePartOfSpeeches.push(partOfSpeech);
    }
  });
  uniquePartOfSpeeches.map((partOfSpeech) => {
    if (partOfSpeech === "noun") {
      renderDefinitions("noun", nounDefinitions);
    }
    if (partOfSpeech === "verb") {
      renderDefinitions("verb", verbDefinitions);
    }
  });
  const getSourceURL = getDeepNestedValues(wordMeaning, "sourceUrls")?.[0];
  iconNewWindow.href = getSourceURL;
  sourceUrl.innerText = getSourceURL;
}
function cleanThePreviousDOM() {
  if (termMeaningWrapper_2HeadingNoun.childElementCount >= 0) {
    removeAllChildElements(termMeaningWrapper_2HeadingNoun);
  }
  if (termMeaningWrapper_2ListNoun.childElementCount >= 0) {
    removeAllChildElements(termMeaningWrapper_2ListNoun);
  }
  if (synonymsContainer.childElementCount > 0) {
    removeAllChildElements(synonymsContainer);
  }
  if (termMeaningWrapper_2HeadingVerb.childElementCount >= 0) {
    removeAllChildElements(termMeaningWrapper_2HeadingVerb);
  }
  if (termMeaningWrapper_2ListVerb.childElementCount >= 0) {
    removeAllChildElements(termMeaningWrapper_2ListVerb);
  }
}
function renderDefinitions(partOfSpeech, definitions) {
  if (partOfSpeech === "noun") {
    cleanThePreviousDOM();
    console.log(definitions);
    const spanElementNounText = document.createElement("span");
    spanElementNounText.innerHTML = partOfSpeech;
    termMeaningWrapper_2HeadingNoun.appendChild(spanElementNounText);

    termMeaningWrapper_2MeaningText.innerText = "Meaning";
    definitions.map((definition) => {
      const liElement = document.createElement("li");
      liElement.innerText = definition;
      termMeaningWrapper_2ListNoun.appendChild(liElement);
    });
    renderSynonyms(wordSynonymsArray);
  }
  if (partOfSpeech === "verb") {
    const spanElementVerbText = document.createElement("span");
    spanElementVerbText.innerHTML = partOfSpeech;
    termMeaningWrapper_2HeadingVerb.appendChild(spanElementVerbText);

    termMeaningWrapper_2MeaningTextVerb.innerText = "Meaning";

    definitions.map((definition) => {
      const liElement = document.createElement("li");
      liElement.innerText = definition;
      termMeaningWrapper_2ListVerb.appendChild(liElement);
    });
  }
}

function renderSynonyms(wordSynonymsArray) {
  const len = wordSynonymsArray.length - 1;
  wordSynonymsArray.map((synonym, index) => {
    const spanElement = document.createElement("span");
    if (len == index) {
      spanElement.innerHTML = " " + synonym + ".";
    } else {
      spanElement.innerHTML = " " + synonym + ",";
    }
    synonymsContainer.appendChild(spanElement);
  });
}

async function searchIconClickHandler() {
  sound = ""; // Initialize sound variable

  const searchText = inputElement.value; // Get the search text from input element
  inputElement.value = ""; // Clear the input element

  if (!searchText) {
    // If search text is empty
    inputElement.classList.add("make-border-red"); // Add CSS class to show red border
    blankInputWarnSpanTag.innerHTML = "Whoops, can't be empty..."; // Display error message
  } else {
    const wordMeaning = await fetchWordMeaning(searchText); // Fetch the word meaning asynchronously
    powerTheUI(wordMeaning); // Update the UI with the word meaning
  }
}

function handleEnterKeyPress(event) {
  if (event.key === "Enter") {
    // If Enter key is pressed
    searchIconClickHandler(); // Trigger search icon click handler
  }
}
themeCheckbox.addEventListener("change", themeCheckboxChangeHandler); // Add event listener for theme checkbox change
dropdownButton.addEventListener("click", dropdownButtonClickHandler); // Add event listener for dropdown button click
window.addEventListener("click", windowClickHandler); // Add event listener for window click
searchIcon.addEventListener("click", searchIconClickHandler); // Add event listener for search icon click
window.addEventListener("keypress", handleEnterKeyPress); // Add event listener for key press
playIcon.addEventListener("click", () => {
  if (sound) {
    sound.play(); // Play the sound if available
  } else {
    speechSynthesis.speak(audioNotFoundMessage); // Speak the audio not found message
  }
});
inputElement.addEventListener("focus", () => {
  if (blankInputWarnSpanTag.innerText) {
    // If error message is displayed
    blankInputWarnSpanTag.innerText = ""; // Clear the error message
    inputElement.classList.remove("make-border-red"); // Remove the CSS class for red border
  }
});

function getDeepNestedValues(obj, key) {
  let values = [];

  if (Array.isArray(obj)) {
    // If object is an array
    for (let i = 0; i < obj.length; i++) {
      values = values.concat(getDeepNestedValues(obj[i], key)); // Recursively get values from nested objects in the array
    }
  } else if (typeof obj === "object" && obj !== null) {
    // If object is a nested object
    for (let prop in obj) {
      if (prop === key) {
        // If key matches
        values.push(obj[prop]); // Add the value to the result array
      } else {
        values = values.concat(getDeepNestedValues(obj[prop], key)); // Recursively get values from nested objects
      }
    }
  }

  return values; // Return the resulting values
}
