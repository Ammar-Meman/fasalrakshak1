import { planTasks } from './planner.js';
import { buildExecutionGraph } from './executionGraph.js';
import { executeNode } from './toolSelector.js';
import { withFallback } from './fallbackManager.js';
import { optimizeContext } from './tokenBudgetManager.js';
import { calculateCost } from './costManager.js';
import { LatencyTracker } from './latencyManager.js';
import { validateResponse } from './responseValidator.js';
import { logAudit } from './auditTrail.js';
import { buildPrompt } from '../prompts/promptBuilder.js';
import { callLLM } from '../llm/llmService.js';
import Conversation from '../../models/Conversation.js';
import { extractAndStoreMemories } from '../memory/memoryExtractor.js';
import { generateReflection } from '../memory/reflectionGenerator.js';
import { loadUserContext } from '../context/contextLoader.js';
import { executeDecisionEngine } from '../recommendation/decisionEngine.js';
import { detectOutbreaks } from '../enterprise/outbreakDetector.js';
import { clusterFarmers } from '../enterprise/clusterEngine.js';
import { updateKnowledgeGraph } from '../enterprise/knowledgeGraph.js';
import { executeMultiAgentWorkflow } from '../multiagent/executionEngine.js';
import { triggerBackgroundLearning } from '../autonomous/learningEngine.js';

export const executeCascadeFlow = async (message, kisanId, conversationId = null, mode = 'chat') => {
  const tracker = new LatencyTracker();
  
  try {
    // 1. Context Retrieval (User Profile)
    const context = await loadUserContext(kisanId);
    tracker.mark('contextLoaded');

    // 2. Load Tools dynamically
    let availableTools = await loadAvailableTools(context);
    
    // 2.5 Multi-Agent Workforce (Phase 10) - Execute parallel DAG
    let toolOutputs = {};
    let usedTools = [];
    let agentConsensus = null;
    try {
        agentConsensus = await executeMultiAgentWorkflow(message, context);
        if (agentConsensus) {
            toolOutputs['MultiAgent Consensus'] = agentConsensus;
            usedTools.push('MultiAgent Coordinator');
            tracker.mark('multiAgentCompleted');
        }
    } catch (e) {
        console.error("Multi-Agent Execution Error:", e);
    }
    
    // 3. Fallback sequential execution if multi-agent skips or fails specific tools
    for (const tool of availableTools) {
      if (!toolOutputs[tool.intent]) {
         const result = await withFallback(executeNode(tool, context, { message, conversationId }), tool);
         toolOutputs[result.intent] = result.output;
         usedTools.push(result.intent);
      }
    }

    // 4. Execution Graph Construction
    const tasks = await planTasks(message);
    const graph = buildExecutionGraph(tasks);
    
    // Log Planning Decision
    await logAudit(kisanId, conversationId, 'planning_decision', {
      tasksRequested: tasks.map(t => t.intent),
      isParallel: graph.isParallel
    });

    // 4. Parallel Execution via Tool Orchestrator with Fallback
    const executionPromises = graph.nodes.map(node => 
      withFallback(executeNode(node, context, { message, conversationId }), node)
    );
    
    const results = await Promise.all(executionPromises);
    tracker.mark('toolsExecuted');

    // Merge results
    let memories = [];
    let reflections = [];
    let toolOutputs = {};
    let usedTools = [];
    let fallbackUsed = false;

    results.forEach(res => {
      if (res.fallbackUsed) fallbackUsed = true;
      if (res.type === 'memory') {
        memories = res.memories || [];
        reflections = res.reflections || [];
      } else if (res.type === 'tool') {
        toolOutputs[res.intent] = res.output;
        usedTools.push(res.intent);
      }
    });

    await logAudit(kisanId, conversationId, 'tools_executed', {
      tools: usedTools,
      fallbackUsed
    });

    // 4.5 Execute Central Recommendation Engine
    let recommendationJSON = null;
    try {
       recommendationJSON = await executeDecisionEngine(toolOutputs, context, { message, conversationId });
       toolOutputs['Recommendation Engine'] = recommendationJSON;
       usedTools.push('Recommendation Engine');
       tracker.mark('recommendationEngineCompleted');
       
       // Asynchronous Enterprise Intelligence Hooks (Phase 9)
       if (recommendationJSON && recommendationJSON.success) {
           const tenantId = 'TENANT_DEFAULT'; // Default tenant for current setup
           const region = context.profile?.location || 'Unknown Region';
           
           // 1. Cluster the farmer
           clusterFarmers(tenantId, recommendationJSON.crop, region).catch(e => console.error(e));
           
           // 2. Detect Outbreaks passively
           detectOutbreaks(tenantId, region, recommendationJSON.crop, recommendationJSON.disease)
             .catch(e => console.error(e));
             
           // 3. Update Knowledge Graph edges
           updateKnowledgeGraph(tenantId, recommendationJSON.crop, recommendationJSON.disease, region, recommendationJSON.pesticide?.name, true)
             .catch(e => console.error(e));
       }
       
    } catch (e) {
       console.error("Recommendation Engine Error:", e);
    }

    // If mode is 'recommend', we skip LLM and just return the JSON
    if (mode === 'recommend') {
      return toolOutputs['Recommendation Engine'] || { success: false, message: 'Recommendation Engine failed to produce output' };
    }

    // 5. Token Budgeting & Prompt Building
    // To remain backward compatible with buildPrompt signature:
    // (message, context, intent, toolOutput, memories, reflections)
    // We pass the primary intent or combine them.
    const primaryIntent = { intent: usedTools[0] || 'General Farming' };
    const optimized = optimizeContext(context, memories, toolOutputs);
    const costInfo = calculateCost(optimized.estimatedTokenCount);
    
    const prompt = buildPrompt(
      message, 
      context, 
      primaryIntent, 
      toolOutputs, 
      optimized.trimmedMemories, 
      reflections
    );
    tracker.mark('promptBuilt');

    // 6. Gemini LLM Call
    const llmResponse = await callLLM(prompt);
    tracker.mark('llmResponded');

    // 7. Response Validation
    const validated = validateResponse(llmResponse);
    const finalResponseText = validated.repairedText;

    // 8. Conversation Save
    let activeConversation;
    if (conversationId) {
      activeConversation = await Conversation.findById(conversationId);
    }
    if (!activeConversation) {
      activeConversation = new Conversation({ kisanId, title: message.substring(0, 30) });
    }

    activeConversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // 8. Phase 11 Autonomous Hook: Launch background learning threads silently
    const recommendationId = `REC_${Date.now()}`;
    triggerBackgroundLearning(kisanId, recommendationId, context)
       .catch(err => console.error("Background Learning Failed:", err));

    activeConversation.messages.push({
      role: 'agent',
      content: finalResponseText,
      toolCalls: usedTools,
      timestamp: new Date()
    });

    await activeConversation.save();
    tracker.mark('conversationSaved');

    // Asynchronous Memory Update
    extractAndStoreMemories(kisanId, message)
      .then(() => {
        if (Math.random() > 0.8) generateReflection(kisanId);
      })
      .catch(e => console.error(e));
      
    // Asynchronous Disease Memory Store
    if (toolOutputs['Disease Detection'] && toolOutputs['Disease Detection'].success) {
      const diag = toolOutputs['Disease Detection'];
      const diseaseMemory = {
        category: 'Disease History',
        importance: 'Critical',
        fact: `Crop: ${diag.crop}, Disease: ${diag.disease}, Severity: ${diag.severity}, Confidence: ${diag.confidence}, Treatment: ${diag.treatment}, Date: ${new Date().toISOString()}`,
        confidence: diag.confidence / 100.0
      };
      
      // We can use the existing saveMemories dynamically
      import('../memory/memoryWriter.js').then(({ saveMemories }) => {
        saveMemories(kisanId, [diseaseMemory]).catch(e => console.error(e));
        
        logAudit(kisanId, activeConversation._id, 'disease_memory_saved', {
          fact: diseaseMemory.fact
        }).catch(e => console.error(e));
      });
    }

    const latencies = tracker.getLatencies();

    await logAudit(kisanId, activeConversation._id, 'execution_summary', {
      cost: costInfo,
      latencies: latencies,
      responseValid: validated.isValid
    });

    // 9. Standard Response Return (matching previous format for backward compatibility)
    return {
      success: true,
      message: "Agent processed request successfully with CascadeFlow",
      intent: primaryIntent.intent,
      toolUsed: usedTools.length > 0 ? usedTools.join(', ') : null,
      contextLoaded: !context.error,
      conversationId: activeConversation._id,
      response: finalResponseText,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('[CASCADE ERROR] Runtime failure:', error);
    
    const latencies = tracker.getLatencies();
    await logAudit(kisanId, conversationId, 'cascade_error', {
      error: error.message,
      latencies
    });

    return {
      success: false,
      message: "Internal cascade failure",
      intent: "Error",
      toolUsed: null,
      contextLoaded: false,
      conversationId: conversationId || null,
      response: process.env.NODE_ENV === 'development' ? error.stack : "Mujhe khed hai, ek takniki samasya aa gayi hai. (I am sorry, there is a technical issue). Please try again.",
      timestamp: new Date().toISOString()
    };
  }
};
