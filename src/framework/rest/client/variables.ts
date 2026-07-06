export const PRODUCTS_PER_PAGE = 30;
export const TYPES_PER_PAGE = 15;
// Capped at 100: the categories endpoint truncates its JSON body at high
// limits (server-side serialization bug) — limit=1000 breaks JSON.parse and
// kills every consumer (search filters, home grids). 100 parses reliably.
export const CATEGORIES_PER_PAGE = 100;
export const SHOPS_PER_PAGE = 30;
export const AUTHORS_PER_PAGE = 30;
export const MANUFACTURERS_PER_PAGE = 30;
export const REFUND_POLICY_PER_PAGE = 15;
