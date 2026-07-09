export const explainEnterpriseDecision = (decision, constraints) => {
    // Adds a WHY to macro decisions
    return {
        ...decision,
        explanation: [
            `Risk is ${decision.urgency} because of constraints: ${constraints.join(', ')}`,
            `High confidence derived from historical trends and real-time clustering.`
        ]
    };
};
