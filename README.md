# Assignment 3: An AI-Augmented Concept

## Augment the design of a concept

### Original Concept

```
concept Recommend [Item, Policy]
    purpose select an element from a set according to a policy
    principle based on the specified policy, return a single element from a set
    state
        a set of Recommends with
            a policy Policy
            a set of candidates set(Item)
            a recommendation Item
    actions
        recommend (candidates: set(Item), policy: Policy): (recommendation: Item)
            requires: candidates is non empty
            effects: returns one element from candidates according to the given policy

        addPolicy (newPolicy: Policy)
            requires: the old policy is not the same as newPolicy
            effects: updates the policy from oldPolicy to newPolicy

        updateCandidates (oldCandidates: set(Item), newCandidates: set(Item))
            requires: newCandidates is non empty, oldCandidates is not the same as newCandidates
            effects: updates the set of candidates from oldCandidates to newCandidates
```

### AI-Augmented Concept

```
concept Recommend [Item, Policy]
    purpose select an element from a set according to an inferred preference policy
    principle return a single element from a set using an LLM that interprets a learned user preference profile (policy) and reasons over item descriptions (candidates) to recommend the best match
    state
        a set of Recommenders with
            a set of candidates set(Item)
            a policy Policy
            a recommendation Item

    actions
        recommend(candidates: set(Item), policy: Policy): (recommendation: Item)
            requires: candidates is non empty
            effects: calls the LLM with candidate descriptions and the current policy. The LLM reasons about the policy and how it can be applied to candidates. Returns the item determined to best match the policy.

        addPolicy(newPolicy: Policy)
            requires: newPolicy differs from current policy
            effects: updates stored policy to reflect most recent inferred preferences

        updateCandidates(newCandidates: set(Item))
            requires: newCandidates is non empty and differs from current candidates
            effects: updates candidate set

```

### Explanation

The AI-augmented version extends the original recommendation concept by allowing the policy to represent an inferred model of user preferences, rather than an explicit rule like "likes peanuts". The LLM uses this policy, derived from the user’s prior feedback and ratings, to interpret and compare the available candidates.

Instead of relying on deterministic logic, the augmented system leverages the LLM’s ability to reason about unstructured data in the form of the policy. It interprets menu item descriptions (candidates) and aligns them with the user’s inferred likes and dislikes (policy), producing a personalized recommendation that evolves as preferences change over time.

---

## Design the user interaction

### Sketches with AI Augmentation

![UI sketch from augmentation](UI_Sketch.png)

### User Journey

A new user signs up for the app and explores their first restaurant. They browse the menu, rate a few dishes they’ve tried before, and the app begins forming an initial preference profile. That evening, the user opens the app to decide what to eat. They select a nearby restaurant, and the app automatically recommends a a peanut-free noodle bowl, which is inferred from the user’s early ratings. Relieved they don’t have to scan the menu, the user orders it and enjoys their meal. After dinner, the user rates the dish a 4/5. The app updates the user’s preference profile based on this feedback. The next time the user visits another restaurant, the app applies their updated profile and recommends a spicy tofu curry, better aligned with their evolving tastes. The user gives it a 5/5 and notices that the recommendations feel increasingly personalized without ever having to specify their preferences directly.

---

## Concept Implementation

- [Link to concept implementation](recommend.ts)
- [Link to concept spec](recommend.spec)
- Test driver: `npm test`

---

## Test Cases/Prompts

- [Link to test file](recommend-test.ts)

### Test 1: Semantic Similarity Prompt

- **Approach:** I tested whether the recommender could generalize a single strong preference (“Sushi”, which was rated 5/5) to similar dishes in the menu, such as “Sushi Rolls” or “Ramen”. This variant explicitly framed the LLM as reasoning by semantic similarity, rather than direct string matching.
- **What Worked:** The model consistently recommended dishes like “Sushi Rolls”, showing that it could use semantic similarity rather than relying on exact 1:1 matches! Explicitly telling it to “infer similar foods” in the prompt improved reasoning consistency compared to a baseline prompt with no such guidance.
- **What Went Wrong:** Occasionally, the LLM hallucinated menu items (“Salmon Sashimi”) that weren’t in the provided list. Adding a stronger constraint (“only select dishes from the list below”) fixed most of those violations.
- **What Issues Remain:** Minor inconsistencies can occur when menu items are phrased differently (e.g., “Sushi roll” vs. “Sushi rolls”), suggesting the LLM’s understanding is sensitive to spelling variation and not entirely semantic.

### Test 2: Conflicting Preferences Prompt

- **Approach:** This case explored how the model manages preference conflicts, e.g. liking “spicy” (5/5) but disliking “curry” (2/5). The goal was to see if the LLM could resolve trade-offs rather than ignoring one or both signals.
- **What Worked:** With a prompt emphasizing numerical weighting, the model seemed to prioritize the one with a stronger preference. It recommended “Chili Ramen” in most runs, which satisfies “spicy” without violating the “curry” dislike.
- **What Went Wrong:** When phrasing was ambiguous (“avoid dishes you think might be disliked”), the model over-filtered and produced overly safe, generic answers (“Tofu Stir Fry”).
- **What Issues Remain:** The LLM doesn’t actually perform numeric reasoning — it mimics it textually. Results vary if the preference descriptions are reordered or reworded.

### Test 3: Noisy Menu Prompt

- **Approach:** The goal of this test was to measure the robustness when given imperfect candidate set. The menu items contained typos and common abbreviations (e.g., “Vegtble Noodlz w/ tofu”). The LLM was prompted to infer intended meanings, but still only return items from the provided list.
- **What Worked:** The LLM handled light noise surprisingly well, and it still selected the vegetarian noodle dish most of the time.
- **What Went Wrong:** When multiple noisy items looked similar, the LLM sometimes defaulted to the first in the list rather than reasoning contextually.
- **What Issues Remain:** The model lacks a good way to clean or normalize the candidate text, especially since we want to ensure that it only outputs a valid menu item.

---

## Validators

- Invalid Recommendation (i.e. Item Recommended is Not in Candidates). The plausible issue that could happen is the LLM hallucinates and recommends an item that doesn’t exist in the provided candidate. The associated validator is the function `validateRecommendationInCandidates()`

- Ambiguous or Empty Recommendation. The plausible issue that could happen is the LLM might return a vague or invalid answer like “Any of these would work” or an empty string. The associated validator is the function `validateRecommendationIsSpecific()`

- Policy Inconsistency (Contradictory Preference Updates). The plausible issue that could happen is when updating user preferences, the LLM might try to assign conflicting ratings to the same food (e.g., “Tacos: 5” and “Tacos: 1”). We want to make sure that each preference only appears once and the rating needs to be between 1 and 5. The associated validator is the function `validatePolicyConsistency()`

Overall, there are three plausible issues that could emerge when using the LLM: invalid recommendations, ambiguous or empty outputs, and policy inconsistencies. To handle these, I implemented corresponding validators that check each of these conditions before finalizing recommendations (all wrapped in a validate function). This way, even if the LLM produces something invalid or incorrect, the user experience is unaffected.

## Run App

`npm test`
