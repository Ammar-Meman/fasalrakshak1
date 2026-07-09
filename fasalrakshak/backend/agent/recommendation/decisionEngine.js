import { applyRainRules } from './rules/rain.rules.js';
import { applyOrganicRules } from './rules/organic.rules.js';
import { applySoilRules } from './rules/soil.rules.js';
import { applyHarvestRules } from './rules/harvest.rules.js';
import { applyBudgetRules } from './rules/budget.rules.js';

import { advisePesticide } from './pesticideAdvisor.js';
import { adviseIrrigation } from './irrigationAdvisor.js';
import { planActions } from './actionPlanner.js';
import { analyzeRisk } from './riskAnalyzer.js';
import { calculateEstimatedCost } from './costEstimator.js';
import { resolveConflicts } from './conflictResolver.js';
import { buildFinalRecommendation } from './recommendationBuilder.js';
import { validateRecommendation } from './recommendationValidator.js';
import Recommendation from '../../models/Recommendation.js';

/**
 * Central Recommendation Engine
 * Merges insights from CascadeFlow tools, applies enterprise rules, 
 * resolves conflicts, and generates an explainable action plan.
 */
export const executeDecisionEngine = async (toolOutputs, context, message) => {
    // 1. Initialize Draft
    let draft = {
        crop: toolOutputs['Disease Forecast']?.crop || toolOutputs['Disease Detection']?.crop || 'Unknown',
        disease: toolOutputs['Disease Detection']?.disease || toolOutputs['Disease Forecast']?.disease || 'Unknown',
        reasoning: [],
        decisionPath: []
    };
    
    // 2. Aggregate Confidence
    let totalConf = 0, count = 0;
    ['Disease Detection', 'Symptom Analysis', 'Disease Forecast', 'Weather'].forEach(t => {
        if (toolOutputs[t]?.confidence) {
            totalConf += toolOutputs[t].confidence;
            count++;
        }
    });
    const avgConfidence = count > 0 ? (totalConf / count) : 80.0;

    // 3. Collect Advisor Insights
    draft.pesticide = advisePesticide(toolOutputs, context);
    if (draft.pesticide) draft.decisionPath.push('advisor: pesticide');
    
    draft.irrigation = adviseIrrigation(toolOutputs, context);
    if (draft.irrigation) draft.decisionPath.push('advisor: irrigation');
    
    draft.timeline = planActions(toolOutputs);

    // 4. Apply Enterprise Rules
    draft = applySoilRules(context, toolOutputs, draft);
    draft = applyRainRules(context, toolOutputs, draft);
    draft = applyOrganicRules(context, toolOutputs, draft);
    draft = applyHarvestRules(context, toolOutputs, draft);
    
    // 5. Calculate Cost & Risk
    draft.estimatedCost = calculateEstimatedCost(draft, context);
    draft = applyBudgetRules(context, toolOutputs, draft);
    const risk = analyzeRisk(toolOutputs);
    
    // 6. Resolve Conflicts & Validate
    draft = resolveConflicts(draft);
    draft = validateRecommendation(draft);
    
    // Calculate Overall Score (dummy heuristic for demo)
    const overallScore = Math.min(100, Math.floor(avgConfidence * 0.9 + (risk === 'Low' ? 10 : 0)));

    // 7. Build Final JSON
    const finalJSON = buildFinalRecommendation(draft, risk, draft.estimatedCost, overallScore, avgConfidence);

    // 8. Track Outcome History
    if (context.kisanId) {
        try {
            const recDoc = new Recommendation({
                entityType: 'Farmer',
                entityId: context.kisanId,
                conversationId: context.conversationId || null,
                crop: finalJSON.crop,
                recommendation: finalJSON,
                risk: finalJSON.risk,
                reasoning: finalJSON.reasoning,
                estimatedCost: finalJSON.estimatedCost,
                overallScore: finalJSON.overallScore,
                confidence: finalJSON.confidence,
                decisionPath: draft.decisionPath,
                toolOutputs: toolOutputs,
                version: 'v1',
                status: 'Pending'
            });
            await recDoc.save();
        } catch (error) {
            console.error("Failed to save recommendation history:", error);
        }
    }
    
    return finalJSON;
};
