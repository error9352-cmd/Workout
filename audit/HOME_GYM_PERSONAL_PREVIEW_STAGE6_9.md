# Home Gym Personal Preview — Stage 6.9

## Change
Home Gym personalization now shows a live workout preview inside the personalization sheet, matching the Gym recommendation flow.

## Preview behavior
- Updates immediately when level changes.
- Updates immediately when weekly frequency changes.
- Updates immediately when equipment changes.
- Shows each scheduled session with day, program name, metadata, and expandable exercise list.
- Uses the shared `apTplCard` / `apExList` presentation when available.
- Does not save or install the program until the user confirms `Buat Program Personal`.

## Safety
- Existing personalized Home Gym plans are not overwritten until the user confirms.
- Active workout protection remains unchanged.
- Gym recommendation flow is unchanged.
