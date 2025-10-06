/**
 * Recommend Test Cases
 *
 * Demonstrates both manual recommendation and LLM-assisted recommendation
 */

import { Recommend } from "./recommend";
import { GeminiLLM, Config } from "./gemini-llm";

/**
 * Load configuration from config.json
 */
function loadConfig(): Config {
  try {
    const config = require("../config.json");
    return config;
  } catch (error) {
    console.error(
      "❌ Error loading config.json. Please ensure it exists with your API key."
    );
    console.error("Error details:", (error as Error).message);
    process.exit(1);
  }
}

/**
 * Test Case 1: Semantic Similarity Prompt
 * - User only likes sushi.
 * - Menu includes mixed cuisines.
 */
export async function testSemanticSimilarity(): Promise<void> {
  console.log("\n🧪 TEST CASE 1: Semantic Similarity Prompt");
  console.log("========================================");

  const recommender = new Recommend();
  const config = loadConfig();
  const llm = new GeminiLLM(config);

  // Add some preferences
  recommender.addPolicy("Sushi", 5);
  recommender.addCandidate("Sushi Rolls");
  recommender.addCandidate("Ramen");
  recommender.addCandidate("Tacos");
  recommender.addCandidate("Cheeseburger");

  // Add some menu items
  recommender.addCandidate("Ramen");
  recommender.addCandidate("Sushi Rolls");
  recommender.addCandidate("Cheeseburger");
  recommender.addCandidate("Margherita Pizza");

  // Display initial state
  console.log("\n📋 Initial state - all preferences:");
  recommender.displayPreferences();
  console.log("\n📋 Initial state - all menu items:");
  recommender.displayCandidates();

  let prompt_start =
    "You are a food-recommendation AI that infers similar foods when few preferences are known. Use conceptual similarity to generalize preferences, but only select dishes from the menu list.";

  // Let the LLM recommend an item
  await recommender.recommend(llm, prompt_start);

  // Display the final recommendation
  console.log("\n📋 Final Recommendation from the LLM:");
  recommender.displayRecommendation();
}

/**
 * Test case 2: no candidates provided
 * Demonstrates error handling if there are no candidates
 */
export async function testConflictingPreferences(): Promise<void> {
  console.log("\n🧪 TEST 2: Conflicting Preferences");
  console.log("========================================");

  const recommender = new Recommend();
  const config = loadConfig();
  const llm = new GeminiLLM(config);

  recommender.addPolicy("Spicy", 5);
  recommender.addPolicy("Curry", 2);
  recommender.addCandidate("Spicy Curry");
  recommender.addCandidate("Chili Ramen");
  recommender.addCandidate("Sweet and Sour Tofu");

  // Display initial state
  console.log("\n📋 Initial state - all preferences:");
  recommender.displayPreferences();
  console.log("\n📋 Initial state - all menu items:");
  recommender.displayCandidates();

  let prompt_start =
    "You are an AI system that must handle conflicting user preferences. When conflicts occur, weigh ratings numerically and choose dishes that best satisfy the higher-rated preferences.";
  // Let the LLM recommend an item
  await recommender.recommend(llm, prompt_start);

  // Display the final recommendation
  console.log("\n📋 Final Recommendation from the LLM:");
  recommender.displayRecommendation();
}

/**
 * Test Case 3: Noisy Menu Prompt
 * - Tests robustness to typos and misspellings.
 */
export async function testNoisyMenu(): Promise<void> {
  console.log("\n🧪 TEST 3: Noisy Menu Prompt");
  console.log("========================================");

  const recommender = new Recommend();
  const config = loadConfig();
  const llm = new GeminiLLM(config);

  recommender.addPolicy("Vegetarian", 4);
  recommender.addPolicy("Noodles", 5);
  recommender.addPolicy("Meat", 1);
  recommender.addCandidate("Vegtble Noodlz w/ tofu");
  recommender.addCandidate("SpicyBeefRamen");
  recommender.addCandidate("Chicken Udon");

  // Display initial state
  console.log("\n📋 Initial state - all preferences:");
  recommender.displayPreferences();
  console.log("\n📋 Initial state - all menu items:");
  recommender.displayCandidates();

  let prompt_start =
    "You are a recommendation AI that must handle imperfect or misspelled menu data. Interpret likely typos but always return an exact match from the menu list.";
  // Let the LLM recommend an item
  await recommender.recommend(llm, prompt_start);

  // Display the final recommendation
  console.log("\n📋 Final Recommendation from the LLM:");
  recommender.displayRecommendation();
}

/**
 * Main function to run all test cases
 */
async function main(): Promise<void> {
  console.log("🎓 Recommend Test Suite");
  console.log("========================\n");

  try {
    // Run mixed scheduling test
    await testSemanticSimilarity();
    await testConflictingPreferences();
    await testNoisyMenu();

    console.log("\n🎉 All test cases completed successfully!");
  } catch (error) {
    console.error("❌ Test error:", (error as Error).message);
    process.exit(1);
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  main();
}
