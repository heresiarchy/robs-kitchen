# Density and supermarket aisles

Tighten page, card, row and form spacing while retaining 12 px body text and compact formatting controls. Reduce large decorative recipe/hero areas. Group shopping lists and list previews by standard UK supermarket departments. Infer the aisle from product names; unknown items go to Other. Allow a per-item aisle override, persisted in the existing JSON record and MCP schema. Keep quantities, IDs, checked state and recipe associations intact. Existing lists gain inferred groups without a migration. This uses local rules rather than an AI API or store-specific aisle numbers.

Verify grouping cases, override persistence, existing shopping actions, mobile layout, types and production build. Publish privately to the existing Site.
