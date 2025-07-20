
### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.6. Core Concepts - Common Reusable Components

To promote consistency, reduce code duplication, and streamline development, the BQOMIS Frontend utilizes several common reusable UI components. These components are typically generic in nature and can be used across various features and pages. They are primarily located in the `src/components/common/` and `src/components/layout/` directories.

**A. Purpose of Reusable Components**

*   **Consistency:** Ensure UI elements like modals, buttons, and navigation bars have a uniform look and feel throughout the application.
*   **Maintainability:** Changes to a common UI element only need to be made in one place.
*   **Efficiency:** Speeds up development as pre-built components can be easily integrated into new features.
*   **Encapsulation:** Complex UI logic or styling can be encapsulated within a component, making the consuming pages cleaner.

**B. Key Reusable Components**

1.  **Layout Components (`src/components/layout/`)**
    *   These components define the overall page structure for different sections of the application.
    *   **`AdminLayout.jsx`:**
        *   Provides the standard layout for all admin-facing pages.
        *   Typically includes a `TopNav.jsx`, `SidebarNav.jsx` (configured with admin navigation items), and a `Footer.jsx`.
        *   Uses `<Outlet />` from `react-router-dom` to render the content of specific admin pages.
    *   **`ClientLayout.jsx`:**
        *   Provides the standard layout for client-facing pages.
        *   Also includes a `TopNav.jsx`, `SidebarNav.jsx` (configured with client navigation items), and a `Footer.jsx`.
        *   Uses `<Outlet />`.
    *   **`TopNav.jsx`:**
        *   A generic top navigation bar component.
        *   Displays the application title ("BQOMIS").
        *   Shows user information (e.g., "Hi, [Username]") and a "Sign Out" button when a user is authenticated (using `AuthContext`).
        *   Used by both `AdminLayout` and `ClientLayout`.
    *   **`SidebarNav.jsx`:**
        *   A generic sidebar navigation component.
        *   Accepts a `navigationItems` prop (an array of objects defining links, labels, and icons).
        *   Displays user profile information (avatar placeholder, username, email) from `AuthContext`.
        *   Uses `<NavLink>` for navigation links to highlight the active route.
        *   Configured with different `navigationItems` for admin and client layouts.
    *   **`Footer.jsx`:**
        *   A simple footer component displaying copyright information or other branding elements.
        *   Can be generic or have slight variations for admin/client sections if needed.

2.  **Common UI Elements (`src/components/common/`)**
    *   **`Modal.jsx`:**
        *   A generic modal dialog component.
        *   Props: `isOpen` (boolean to control visibility), `onClose` (function to close the modal), `title` (string for the modal header), `children` (content to be rendered within the modal body).
        *   Provides an overlay and a content area, with a close button in the header.
        *   Used for forms (e.g., `BranchForm`, `ServiceForm`, `UserForm`, password change) and detail views.
        *   **Snippet Structure:**
            ```javascript
            // <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="My Modal">
            //   <p>Modal content goes here.</p>
            // </Modal>
            ```
    *   **`ConfirmationDialog.jsx`:**
        *   A specialized modal for prompting users to confirm actions (e.g., deletion).
        *   Built using the `Modal` component or as a standalone.
        *   Props: `isOpen`, `onClose` (for cancel), `onConfirm` (function for confirm action), `title`, `message`, `confirmButtonText`, `cancelButtonText`, `confirmButtonVariant` (e.g., "danger").
        *   Used extensively before destructive operations like deleting branches, services, users, or appointments.
        *   **Snippet Structure:**
            ```javascript
            // <ConfirmationDialog
            //   isOpen={isConfirmOpen}
            //   title="Confirm Action"
            //   message="Are you sure?"
            //   onConfirm={handleConfirm}
            //   onCancel={() => setIsConfirmOpen(false)}
            // />
            ```
    *   **Buttons, Inputs, etc. (Implicit):**
        *   While not always extracted into separate files like `<Button.jsx>` or `<Input.jsx>` in the provided examples, the SCSS styling for common HTML elements like buttons (`.btn`, `.btn-primary`, `.btn-danger`, `.btn-sm`) and form inputs (`.form-group input`, `.form-group select`) aims for global consistency.
        *   In a larger application, these might be further componentized for more complex behavior or variations (e.g., `<ButtonWithSpinner />`).

3.  **Feature-Specific Reusable Components (within `src/features/`)**
    *   **`HourChunkStatus.jsx` (`src/components/client/` or could be `src/features/client/common/`):**
        *   Displays the 8-chunk hourly traffic status visualizer for services.
        *   Accepts an `hourlyStatus` prop (array of color strings: "green", "yellow", "red").
        *   Used on the `ClientFindBranchPage.jsx`.
    *   Forms like `BranchForm.jsx`, `ServiceForm.jsx`, `UserForm.jsx` (located in `src/features/admin/...`) are also reusable in the sense that they handle both "create" and "edit" modes for their respective entities, typically displayed within a `Modal`.

**C. Benefits Realized**

*   **Standardized Modals:** All create/edit forms and confirmation prompts use a consistent modal presentation.
*   **Consistent Navigation:** Admin and Client sections share the same structural navigation components (`TopNav`, `SidebarNav`), ensuring a familiar user experience pattern.
*   **Reduced Styling Duplication:** Global SCSS variables and utility classes for common elements like buttons and form groups reduce the need to restyle similar elements repeatedly.

By leveraging these common reusable components, the BQOMIS frontend achieves a higher degree of maintainability, consistency, and development speed. As the application grows, more components may be identified as candidates for generalization and inclusion in the `common/` directory.