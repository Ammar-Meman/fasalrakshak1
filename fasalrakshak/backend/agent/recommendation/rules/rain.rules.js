export const applyRainRules = (context, toolOutputs, draftRecommendation) => {
    const weather = toolOutputs['Weather'] || {};
    // If rain probability is high or it's currently raining
    const isRaining = weather.forecast && (weather.forecast.toLowerCase().includes('rain') || weather.forecast.toLowerCase().includes('shower'));
    
    if (isRaining && draftRecommendation.pesticide) {
        draftRecommendation.reasoning.push("Rain expected: Delaying pesticide spray to prevent chemical runoff.");
        draftRecommendation.timeline = "Delay";
        if (draftRecommendation.pesticide.action !== "Delay") {
            draftRecommendation.pesticide.action = "Delay until rain stops";
            draftRecommendation.decisionPath.push("rain.rules: delayed spray");
        }
    }
    
    if (isRaining && draftRecommendation.irrigation) {
        draftRecommendation.reasoning.push("Rain expected: Delaying irrigation to prevent waterlogging.");
        draftRecommendation.irrigation.action = "Delay";
        draftRecommendation.decisionPath.push("rain.rules: delayed irrigation");
    }
    
    return draftRecommendation;
};
