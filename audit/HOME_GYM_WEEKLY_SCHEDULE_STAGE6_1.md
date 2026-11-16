# Home Gym Weekly Schedule Recommendation — Stage 6.1

## Finding

The Home Gym flow already had a weekly adaptation engine, but it did not expose a dedicated weekly schedule recommendation card comparable to the Gym recommendation flow.

## Change

Added a native Home Gym weekly schedule recommendation card to the Home Gym workout screen.

The recommendation is derived from the existing Home Gym planner state:
- level
- weekly frequency
- existing Home Gym split rules

Existing `focusFor()` remains the single source for the Home Gym split structure, so no second scheduling engine was introduced.

## Schedule rules shown

- 2–3 days: Full Body
- 4 days: Upper / Lower / Upper / Lower
- 5 days: level-aware existing Home Gym split
- 6 days: Push / Pull / Legs / Push / Pull / Legs

## Safety

- No Gym flow changes.
- Existing Home Gym adaptive engine remains intact.
- Existing weekly adaptation remains intact.
- No historical workout data is modified.
- No new storage key is introduced.
