
### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.3. Core Concepts - Styling & Theming

The BQOMIS Frontend employs SCSS (Sassy CSS) for styling, enabling a more organized, maintainable, and powerful approach compared to plain CSS. A global theming strategy is implemented using SCSS variables to ensure visual consistency across the application.

**A. SCSS (Sassy CSS)**

*   **Why SCSS?**
    *   **Variables:** Allows defining reusable values for colors, fonts, spacing, etc.
    *   **Nesting:** Provides a way to nest CSS selectors in a way that mimics HTML structure, making stylesheets more readable.
    *   **Partials & Imports:** SCSS files can be broken down into smaller, manageable partials (prefixed with an underscore, e.g., `_variables.scss`) which can then be imported into other SCSS files. The modern `@use` rule is preferred over the older `@import`.
    *   **Mixins:** Enable defining reusable blocks of CSS declarations.
    *   **Functions:** Allow for more complex operations on values.
    *   **Modularity:** Styles can be co-located with their respective components or organized by feature.

*   **Compilation:** Vite handles the compilation of SCSS files into standard CSS that browsers can understand. The `sass` package is a prerequisite dependency for this.

**B. Global Theming with SCSS Variables (`_variables.scss`)**

A central file, `src/assets/styles/_variables.scss`, defines the application's design tokens.

*   **Purpose:**
    *   Provides a single source of truth for the visual identity of the application.
    *   Makes sitewide theme changes (e.g., altering the primary brand color) easy by modifying a single file.
    *   Ensures consistency in UI elements.

*   **Contents:**
    *   **Color Palette:**
        *   Primary, secondary, and accent colors (with dark/light variations).
        *   Neutral/grayscale colors for text, backgrounds, borders.
        *   Semantic colors for states like success, error, warning, info.
    *   **UI Element Colors:** Variables that map palette colors to specific UI uses (e.g., `$bg-primary`, `$text-link`, `$btn-primary-bg`).
    *   **Typography (Optional but Recommended):** Font families, base font sizes, line heights.
    *   **Spacing Units (Optional but Recommended):** Consistent spacing values (e.g., `$spacing-sm`, `$spacing-md`).
    *   **Border Radius & Other UI Primitives.**

*   **Example Snippet (`_variables.scss`):**
    ```scss
    // src/assets/styles/_variables.scss

    // --- COLOR PALETTE ---
    $primary-color: #646cff;
    $primary-color-dark: #535bf2;
    // ... other palette colors ...

    $neutral-darker: #242424;
    $neutral-lightest: #f0f0f0;
    // ... other neutral colors ...

    $error-color: #dc3545;

    // --- UI ELEMENT COLORS ---
    $bg-primary: $neutral-darker;
    $bg-secondary: #2c2c2e; // e.g., for sidebars, cards
    $bg-tertiary: #3a3a3a; // e.g., for input fields

    $text-primary: $neutral-lightest;
    $text-secondary: #aaaaaa;
    $text-link: $primary-color;

    $border-color: #555555;

    // --- SPACING ---
    $spacing-sm: 8px;
    $spacing-md: 16px;
    $spacing-lg: 24px;

    // --- BORDERS ---
    $border-radius-sm: 4px;
    $border-radius-md: 8px;
    ```

**C. Global Stylesheet (`main.scss`)**

The file `src/assets/styles/main.scss` serves as the primary entry point for global styles.

*   **Importing Variables:** It's the first file to import (using `@use ... as *;`) the `_variables.scss` file, making these variables accessible to all subsequently imported SCSS files or components whose styles are processed as part of the global build.
    ```scss
    // src/assets/styles/main.scss
    @use 'variables' as *; // Makes variables like $primary-color directly usable
    ```
*   **Resets/Normalize (Optional):** Can include CSS resets or normalize stylesheets to ensure consistent base styling across browsers.
*   **Global Base Styles:** Defines styles for fundamental HTML elements like `body`, `a`, headings (`h1`-`h6`), etc., using the defined SCSS variables.
    ```scss
    // src/assets/styles/main.scss (continued)
    body {
      margin: 0;
      font-family: $font-family-sans-serif; // Example variable use
      line-height: $line-height-base;
      color: $text-primary;
      background-color: $bg-primary;
    }

    a {
      color: $text-link;
      &:hover { color: $text-link-hover; }
    }
    ```
*   **Global Utility Classes (Optional):** Can define common utility classes (e.g., for margins, padding, text alignment) if not using a utility-first framework.
*   **Importing `main.scss`:** This global stylesheet is imported once in the application's main entry point, `src/main.jsx`, ensuring the styles are applied application-wide.
    ```javascript
    // src/main.jsx
    import './assets/styles/main.scss';
    ```

**D. Component-Specific Styles**

*   Each React component can have its own dedicated SCSS file (e.g., `MyComponent.jsx` and `MyComponent.scss`).
*   These component-specific SCSS files directly use the global variables defined in `_variables.scss` (because `main.scss` makes them available via `@use ... as *;` and `main.scss` is globally imported).
*   This approach promotes modularity and co-location of styles with their components.

    ```scss
    // src/components/common/Button.scss (Example)
    // No need to @use 'variables' again if main.scss does it with 'as *'

    .btn {
      padding: $spacing-sm $spacing-md; // Using global spacing variables
      border-radius: $border-radius-sm; // Using global border-radius
      cursor: pointer;
      font-weight: 500;
    }

    .btn-primary {
      background-color: $primary-color; // Using global color variable
      color: $text-on-primary-bg;
      &:hover { background-color: $primary-color-dark; }
    }
    ```

This styling architecture provides a robust, maintainable, and themeable foundation for the BQOMIS frontend, ensuring visual consistency while allowing for component-specific styling needs. The use of global SCSS variables is central to achieving an easily adaptable theme.