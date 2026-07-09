export const analyzeRisk = (toolOutputs) => {
    const diseaseDiag = toolOutputs['Disease Detection'];
    const diseaseForecast = toolOutputs['Disease Forecast'];
    
    if (diseaseDiag?.disease && diseaseDiag.disease !== 'Healthy') {
        return 'Critical';
    }
    if (diseaseForecast?.risk === 'High') {
        return 'High';
    }
    if (diseaseForecast?.risk === 'Medium') {
        return 'Moderate';
    }
    return 'Low';
};
