/**
 * DayPlanner Concept - AI Augmented Version
 */
import { GeminiLLM } from './gemini-llm';
export interface Activity {
    title: string;
    duration: number;
}
export interface Assignment {
    activity: Activity;
    startTime: number;
}
export declare class DayPlanner {
    private activities;
    private assignments;
    addActivity(title: string, duration: number): Activity;
    removeActivity(activity: Activity): void;
    assignActivity(activity: Activity, startTime: number): void;
    unassignActivity(activity: Activity): void;
    assignActivities(llm: GeminiLLM): Promise<void>;
    /**
     * Helper functions and queries follow
     */
    private isAssigned;
    /**
     * Create the prompt for Gemini with hardwired preferences
     */
    private createAssignmentPrompt;
    /**
     * Parse the LLM response and apply the generated assignments
     */
    private parseAndApplyAssignments;
    /**
     * Return assigned activities organized by time slots
     */
    getSchedule(): {
        [timeSlot: number]: Activity[];
    };
    /**
     * Format time slot number to readable time string
     * @param timeSlot - Time slot number (0-47)
     * @returns Formatted time string (e.g., "6:30 AM")
     */
    formatTimeSlot(timeSlot: number): string;
    private activitiesToString;
    private assignmentsToString;
    /**
     * Display the current schedule in a readable format
     */
    displaySchedule(): void;
}
//# sourceMappingURL=dayplanner.d.ts.map