
### IV.2. Appendix - Key SCSS Variables Overview (`_variables.scss`)

The BQOMIS Frontend utilizes a centralized SCSS variables file (`src/assets/styles/_variables.scss`) to manage its design tokens. This approach ensures visual consistency, facilitates easy theming, and promotes maintainability. Below is an overview of the key categories and examples of variables defined.

*(Note: The exact values are illustrative examples based on a dark theme context from our discussions. Actual values are in the `_variables.scss` file.)*

**A. Color Palette**

This forms the foundation of the application's look and feel.

1.  **Primary Colors (Brand Colors):**
    *   `$primary-color: #646cff;` (e.g., Vite purple, used for main interactive elements, links, active states)
    *   `$primary-color-dark: #535bf2;` (Darker shade for hover/active states on primary elements)
    *   `$primary-color-light: #787eff;` (Lighter shade, potentially for borders or subtle highlights)

2.  **Secondary Colors (Supporting Colors):**
    *   `$secondary-color: #4CAF50;` (Example: Green, used for alternative actions or accents)
    *   `$secondary-color-dark: #388E3C;`
    *   `$secondary-color-light: #81C784;`

3.  **Accent/Highlight Colors:**
    *   `$accent-color: #FFC107;` (Example: Amber/Yellow, for specific highlights or calls to action)

4.  **Neutral/Grayscale Colors (Crucial for backgrounds, text, borders):**
    *   `$neutral-darkest: #1a1a1a;` (Very dark, near black)
    *   `$neutral-darker: #242424;` (Default main background)
    *   `$neutral-dark: #2c2c2e;` (Slightly lighter, e.g., sidebar background)
    *   `$neutral-medium-dark: #3a3a3a;` (e.g., for card backgrounds, form containers)
    *   `$neutral-medium: #555555;` (Borders, less important text, disabled states)
    *   `$neutral-medium-light: #777777;` (Muted text)
    *   `$neutral-light: #aaaaaa;` (Secondary text on dark backgrounds)
    *   `$neutral-lighter: #cccccc;` (Lighter text)
    *   `$neutral-lightest: #f0f0f0;` (Primary text color on dark backgrounds)
    *   `$neutral-white: #ffffff;` (Pure white, for text on very dark or colored backgrounds)

5.  **Semantic Colors (For UI states and feedback):**
    *   `$success-color: #28a745;` (Green for success messages, positive indicators)
    *   `$error-color: #dc3545;` (Red for error messages, destructive actions)
    *   `$warning-color: #ffc107;` (Yellow/Amber for warnings, moderate traffic indicators)
    *   `$info-color: #17a2b8;` (Blue for informational messages or accents)

**B. UI Element Color Mappings**

These variables map the abstract color palette to specific UI components and contexts.

*   **Backgrounds:**
    *   `$bg-primary: $neutral-darker;` (Main page background)
    *   `$bg-secondary: $neutral-dark;` (e.g., Sidebars, cards, modals)
    *   `$bg-tertiary: $neutral-medium-dark;` (e.g., Input fields, nested containers)
*   **Text:**
    *   `$text-primary: $neutral-lightest;` (Default text color)
    *   `$text-secondary: $neutral-light;` (Subtler text, descriptions)
    *   `$text-muted: $neutral-medium-light;` (Placeholder text, disabled text)
    *   `$text-link: $primary-color;`
    *   `$text-link-hover: $primary-color-dark;`
    *   `$text-on-primary-bg: $neutral-white;` (Text color for elements with `$primary-color` background)
*   **Borders:**
    *   `$border-color: $neutral-medium;` (Default border color for inputs, table cells)
    *   `$border-color-strong: $neutral-medium-dark;`
*   **Buttons (Examples):**
    *   `$btn-primary-bg: $primary-color;`
    *   `$btn-primary-text: $text-on-primary-bg;`
    *   `$btn-primary-hover-bg: $primary-color-dark;`
    *   `$btn-danger-bg: $error-color;`
    *   `$btn-danger-text: $neutral-white;`

**C. Typography (Examples)**

*   `$font-family-sans-serif: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;` (Main font stack)
*   `$font-size-base: 1rem;` (Default font size, e.g., 16px)
*   `$font-size-sm: 0.875rem;`
*   `$font-size-lg: 1.25rem;`
*   `$line-height-base: 1.5;`

**D. Spacing Units (Examples)**

Used for consistent margins, paddings, and gaps.

*   `$spacing-xs: 4px;`
*   `$spacing-sm: 8px;`
*   `$spacing-md: 16px;`
*   `$spacing-lg: 24px;`
*   `$spacing-xl: 32px;`

**E. Borders & Shadows (Examples)**

*   `$border-radius-sm: 4px;` (For buttons, inputs)
*   `$border-radius-md: 8px;` (For cards, modals)
*   `$box-shadow-sm: 0 1px 3px rgba(0,0,0,0.1);`
*   `$box-shadow-md: 0 2px 8px rgba(0,0,0,0.15);`

**F. Other UI Primitives**

*   Variables for specific component heights (e.g., `$header-height`), widths (e.g., `$sidebar-width`), z-indexes, etc., may also be defined.

**Usage:**

These variables are imported globally via `@use 'variables' as *;` in `src/assets/styles/main.scss`. This makes them directly accessible in all component-specific SCSS files without needing to re-import `_variables.scss` in each file. For instance, a component style can directly use `$primary-color` or `$spacing-md`.

This centralized variable system is fundamental to maintaining a consistent and easily adaptable visual theme for the BQOMIS frontend. Modifying these variables in `_variables.scss` will propagate changes throughout the entire application.