# UI Consistency v1

Visual-only refinement layer for Athletic Physique.

## Scope
- Normalize text wrapping inside cards, pills, badges, buttons, history rows, sheets, and navigation.
- Prevent flex/grid children from forcing horizontal overflow.
- Normalize control heights and line-height.
- Keep dashboard/progress/coach/intelligence cards aligned and symmetrical.
- Improve mobile wrapping for decision labels and long content.

## Non-scope
- No workout logic changes.
- No training data model changes.
- No adaptive engine changes.
- No new storage or API.

## Added
`assets/css/12-ui-consistency.css`

Loaded after the existing CSS so it acts as a final presentation layer.
