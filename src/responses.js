// Rule-based responses module
// Loads responses from responses.json and exports getReply(input) function
// Features:
// - Input normalization (trim, lowercase, remove punctuation, collapse whitespace)
// - Word-boundary matching to prevent false positives (e.g., "hi" won't match "this")
// - Longest-first matching to prefer specific phrases over short generic words
// - Unicode normalization support for international characters
// - JSON-based responses for easy maintenance and updates

import responsesData from "./responses.json";

const DEFAULT_REPLY = "Sorry, I don't understand. Can you try again? Try asking about AI, greetings, or my capabilities!";

// Flatten the categorized responses into a single object
const responses = Object.values(responsesData).reduce((acc, category) => {
  return { ...acc, ...category };
}, {});


 // Normalize input for better matching:

function normalizeInput(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation (keep letters, numbers, spaces)
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .normalize("NFD"); // Unicode normalization for accented characters
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesInput(key, normalizedInput) {
  // For multi-word phrases, check if the phrase appears as a substring
  if (key.includes(" ")) {
    return normalizedInput.includes(key);
  }

  //Input: "this" ,Key: "hi", Without word boundaries: "hi" matches "this" (false positive).

  const wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(key)}\\b`);
  return wordBoundaryRegex.test(normalizedInput);
}


 //reply based on user input

export function getReply(input) {
  if (!input || typeof input !== "string") {
    return DEFAULT_REPLY;
  }

  const normalizedInput = normalizeInput(input);
  
  // Sort keys by length (longest first) to match specific phrases before generic words
  const sortedKeys = Object.keys(responses).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (matchesInput(key, normalizedInput)) {
      return responses[key];
    }
  }

  return DEFAULT_REPLY;
}
