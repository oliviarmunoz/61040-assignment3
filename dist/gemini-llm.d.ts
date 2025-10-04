/**
 * LLM Integration for DayPlanner
 *
 * Handles the requestAssignmentsFromLLM functionality using Google's Gemini API.
 * The LLM prompt is hardwired with user preferences and doesn't take external hints.
 */
/**
 * Configuration for API access
 */
export interface Config {
    apiKey: string;
}
export declare class GeminiLLM {
    private apiKey;
    constructor(config: Config);
    executeLLM(prompt: string): Promise<string>;
}
//# sourceMappingURL=gemini-llm.d.ts.map