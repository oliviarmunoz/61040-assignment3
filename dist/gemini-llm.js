"use strict";
/**
 * LLM Integration for DayPlanner
 *
 * Handles the requestAssignmentsFromLLM functionality using Google's Gemini API.
 * The LLM prompt is hardwired with user preferences and doesn't take external hints.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiLLM = void 0;
const generative_ai_1 = require("@google/generative-ai");
class GeminiLLM {
    constructor(config) {
        this.apiKey = config.apiKey;
    }
    async executeLLM(prompt) {
        try {
            // Initialize Gemini AI
            const genAI = new generative_ai_1.GoogleGenerativeAI(this.apiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash-lite",
                generationConfig: {
                    maxOutputTokens: 1000,
                }
            });
            // Execute the LLM
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return text;
        }
        catch (error) {
            console.error('❌ Error calling Gemini API:', error.message);
            throw error;
        }
    }
}
exports.GeminiLLM = GeminiLLM;
//# sourceMappingURL=gemini-llm.js.map