export const validateOutput = (output) => {
    // Validates for missing fields or contradictions
    if (!output) return { valid: false, reason: 'Empty output' };
    if (output.confidence < 50) return { valid: false, reason: 'Low confidence' };
    return { valid: true };
};
