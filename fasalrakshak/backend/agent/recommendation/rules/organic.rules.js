export const applyOrganicRules = (context, toolOutputs, draftRecommendation) => {
    // Check if farmer profile indicates organic preference
    const isOrganic = context.profile?.farmingType === 'Organic' || 
                      (context.profile?.preferences && context.profile.preferences.includes('organic'));
    
    if (isOrganic && draftRecommendation.pesticide && draftRecommendation.pesticide.type === 'Chemical') {
        draftRecommendation.reasoning.push("Organic Farmer detected: Replaced chemical pesticide with organic alternative (Neem Oil).");
        draftRecommendation.pesticide = {
            name: "Neem Oil Extract (10000 ppm)",
            dosage: "3-5 ml/L",
            type: "Organic",
            action: draftRecommendation.pesticide.action || "Apply today"
        };
        draftRecommendation.decisionPath.push("organic.rules: replaced chemical pesticide");
    }

    if (isOrganic && draftRecommendation.fertilizer && draftRecommendation.fertilizer.type === 'Chemical') {
        draftRecommendation.reasoning.push("Organic Farmer detected: Replaced chemical fertilizer with organic compost.");
        draftRecommendation.fertilizer = {
            name: "Vermicompost / FYM",
            quantity: "2-3 tonnes/acre",
            type: "Organic"
        };
        draftRecommendation.decisionPath.push("organic.rules: replaced chemical fertilizer");
    }

    return draftRecommendation;
};
