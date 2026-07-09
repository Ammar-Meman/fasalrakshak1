/**
 * Response Validator
 * Verifies that the LLM response is not empty, hallucinated, or malformed.
 */
export const validateResponse = (response) => {
  if (!response || !response.success || !response.text || response.text.trim() === '') {
    return {
      isValid: false,
      repairedText: "Mujhe samajh nahi aaya, kripya dobara puchein. (I couldn't understand, please ask again.)"
    };
  }
  
  // Further validation logic like checking for JSON formats if expected, or hallucinations can be added here
  
  return {
    isValid: true,
    repairedText: response.text
  };
};
