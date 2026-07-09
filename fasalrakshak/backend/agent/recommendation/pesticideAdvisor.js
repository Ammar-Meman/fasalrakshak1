export const advisePesticide = (toolOutputs, context) => {
    const diag = toolOutputs['Disease Detection'];
    const forecast = toolOutputs['Disease Forecast'];
    
    if (diag?.disease && diag.disease !== 'Healthy') {
        return { name: "Broad-spectrum Fungicide / Insecticide", action: "Apply today", type: "Chemical" };
    }
    
    if (forecast?.risk === 'High') {
        return { name: "Preventive Fungicide (Mancozeb)", action: "Apply preventive spray", type: "Chemical" };
    }
    
    return null;
};
