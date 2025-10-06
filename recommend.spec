
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

        addCandidates(newCandidate: Item)
            requires: newCandidates is non empty
            effects: updates candidate set to include newCandidate

        updateCandidates(newCandidates: set(Item))
            requires: newCandidates is non empty and differs from current candidates
            effects: updates candidate set

```
