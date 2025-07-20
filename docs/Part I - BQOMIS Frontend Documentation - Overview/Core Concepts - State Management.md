
### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.5. Core Concepts - State Management

State management in the BQOMIS Frontend primarily relies on React's built-in mechanisms: local component state using the `useState` and `useReducer` hooks, and global/shared state using the React Context API. For the current scope of the application, dedicated third-party state management libraries like Redux, Zustand, or Recoil have not been heavily emphasized, favoring a simpler, React-native approach where appropriate.

**A. Local Component State (`useState`, `useReducer`)**

*   **`useState` Hook:**
    *   This is the most common way to manage state that is local to a single component or a small group of closely related components.
    *   Used for managing UI state (e.g., form input values, modal visibility, loading indicators within a component, toggle states).
    *   **Example:**
        ```javascript
        // Inside a React functional component
        const [isLoading, setIsLoading] = useState(false);
        const [formData, setFormData] = useState({ username: '', password: '' });

        const handleInputChange = (e) => {
          setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        };
        ```

*   **`useReducer` Hook:**
    *   Used for more complex state logic within a component, especially when the next state depends on the previous one, or when multiple sub-values are involved.
    *   While available, `useState` has been sufficient for most local state needs in the BQOMIS frontend examples provided so far. `useReducer` might be adopted if a component's local state logic becomes significantly more intricate.

**B. Global/Shared State (React Context API)**

The React Context API is used for state that needs to be accessible by many components at different nesting levels, without explicitly passing props down through every level of the component tree ("prop drilling").

*   **`AuthContext.jsx`:**
    *   This is the primary example of global state management in BQOMIS.
    *   It manages the authenticated user's information, JWT token, authentication status, and provides login/logout functions.
    *   **Creation:** A context is created using `createContext()`.
    *   **Provider:** An `<AuthProvider>` component wraps parts of the application (in this case, the entire `<App />`) and uses the `<AuthContext.Provider>` to make the authentication state and functions available to all descendant components.
    *   **Consumer:** Components consume the context value using the `useContext` hook (via a custom hook `useAuth()`).

    ```javascript
    // src/contexts/AuthContext.jsx (Simplified)
    import React, { createContext, useContext, useState /*, useEffect */ } from 'react';

    const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [token, setToken] = useState(null);
      // ... login, logout, loading state, etc. ...

      const value = { user, token, /* ... other auth data and functions ... */ };
      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };
    ```

*   **Other Potential Contexts (If Needed):**
    *   If other pieces of global state emerge (e.g., application-wide theme preferences, notification system state), additional contexts could be created following the same pattern.

**C. Server State Management & Caching (Considerations)**

*   **Current Approach:** Data fetched from the API is typically stored in local component state (e.g., `useState([])` for a list of branches). When data needs to be refreshed, the API call is re-triggered (often via `useEffect` or a manual refresh action).
*   **Fetching and Re-fetching Logic:**
    *   `useEffect` hook is commonly used to fetch data when a component mounts or when certain dependencies (like a user ID, filter parameters, or the auth token) change.
    *   `useCallback` is used to memoize functions like `fetchData` to prevent unnecessary re-fetches if passed as dependencies to `useEffect`.

    ```javascript
    // Example in a page component
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();

    const fetchData = useCallback(async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const result = await someApiServiceFunction(token);
        setData(result || []);
      } catch (error) { /* ... */ }
      finally { setIsLoading(false); }
    }, [token]); // Dependency on token

    useEffect(() => {
      fetchData();
    }, [fetchData]); // Re-fetch if fetchData identity changes (due to token change)
    ```

*   **Future Enhancements (Data Caching Libraries):**
    *   For more sophisticated server state management, including automatic caching, background updates, optimistic updates, and deduplication of requests, libraries like:
        *   **React Query (TanStack Query)**
        *   **SWR**
    *   These libraries are not currently implemented in the BQOMIS frontend examples but are strong candidates if the application scales and requires more advanced data fetching and caching strategies to improve performance and user experience. They help manage the "server cache" distinct from UI state.

**D. Prop Drilling vs. Context**

*   For state that is only needed by a component and its direct children, passing props is the standard and simplest approach.
*   Context API is reserved for truly global state or state that needs to be shared across deeply nested components where prop drilling would become cumbersome.

**Summary of Strategy:**

The BQOMIS frontend currently employs a pragmatic state management strategy:
1.  **Local State First:** Use `useState` for component-specific UI and data.
2.  **Global State for Cross-Cutting Concerns:** Utilize React Context API (e.g., `AuthContext`) for application-wide state like authentication.
3.  **Server State:** Managed within components using `useState`/`useEffect` for fetching and storing API data, with potential to integrate dedicated data fetching/caching libraries if complexity grows.

This approach keeps the initial setup lean while providing pathways for more advanced state management solutions as the application evolves.