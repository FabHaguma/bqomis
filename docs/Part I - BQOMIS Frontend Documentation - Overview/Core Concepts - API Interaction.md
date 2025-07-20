
### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.4. Core Concepts - API Interaction

The BQOMIS Frontend is a client-side application that relies heavily on communication with the BQOMIS Backend (a Spring Boot application) to fetch data, submit changes, and perform operations. This interaction is facilitated through RESTful API calls.

**A. API Service Modules (`src/api/`)**

*   **Organization:** API call logic is organized into dedicated service modules located in the `src/api/` directory. Each module typically groups functions related to a specific backend resource or controller (e.g., `userService.js`, `branchService.js`, `appointmentService.js`).
*   **Purpose:**
    *   Centralizes API call logic, making it easier to manage, update, and test.
    *   Abstracts the details of HTTP requests (method, headers, body construction, URL formation) from the UI components.
    *   Promotes reusability of API call functions across different parts of the application.

**B. Base URL Configuration**

*   The base URL for all backend API calls is configured using an environment variable.
*   This is defined in the `.env` file at the root of the project:
    ```env
    VITE_API_BASE_URL=http://localhost:8080/api
    ```
*   Vite makes these environment variables accessible in the frontend code via `import.meta.env.VITE_API_BASE_URL`.
*   API service functions prepend this base URL to the specific endpoint paths.

    ```javascript
    // Example in an API service file
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    export const getAllBranches = async (token) => {
      // ...
      const response = await fetch(`${API_BASE_URL}/branches`, { /* ... */ });
      // ...
    };
    ```

**C. Making HTTP Requests (Fetch API)**

*   The application primarily uses the browser's built-in `fetch` API for making HTTP requests.
*   Common HTTP methods used include `GET` (to retrieve data), `POST` (to create new resources), `PUT` or `PATCH` (to update existing resources), and `DELETE` (to remove resources).

**D. Request Headers**

*   **`Content-Type`:** For requests that send a body (like `POST`, `PUT`, `PATCH`), the `Content-Type` header is typically set to `application/json` to indicate that the request body is JSON formatted.
    ```javascript
    headers: {
      'Content-Type': 'application/json',
      // ... other headers
    }
    ```
*   **`Authorization` (for Protected Endpoints):**
    *   When interacting with backend endpoints that require authentication, a JSON Web Token (JWT) is included in the `Authorization` header using the "Bearer" scheme.
    *   The token is retrieved from the `AuthContext` (or `localStorage` where it's persisted).
    ```javascript
    // Example from an API service function
    const { token } = useAuth(); // Assuming token is available via context or direct retrieval

    // ...
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // ...
    ```

**E. Request Body Construction**

*   For `POST`, `PUT`, and `PATCH` requests, data is sent in the request body, typically as a JSON string.
*   The `JSON.stringify()` method is used to convert JavaScript objects into a JSON string before sending.
    ```javascript
    // Example
    const userData = { username: 'newuser', email: 'new@example.com' };
    // ...
    body: JSON.stringify(userData)
    // ...
    ```

**F. Response Handling (`handleResponse` Utility)**

A common utility function, often named `handleResponse`, is used within API service modules to process the raw response from the `fetch` API.

*   **Purpose:**
    *   Checks if the HTTP response status indicates success (e.g., `response.ok` which checks for status codes in the 200-299 range).
    *   If the response is not okay, it attempts to parse an error message from the JSON body of the error response (common for Spring Boot error handling) or falls back to the status text. It then throws an error, which can be caught by the calling component.
    *   If the response is successful:
        *   For `204 No Content` responses (common for `DELETE` or some `PUT` operations), it returns `null` or a success indicator.
        *   For responses with a JSON body, it parses the JSON using `response.json()`.
        *   For responses with other content types (e.g., plain text), it might use `response.text()`.

*   **Example `handleResponse` Snippet:**
    ```javascript
    // Typically defined in each API service file or a shared apiUtils.js
    const handleResponse = async (response) => {
      if (!response.ok) {
        // Try to parse error message from backend, otherwise use status text
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      // For DELETE or other methods that might not return JSON content but are successful
      if (response.status === 204) {
        return null; 
      }
      // Attempt to parse JSON, handle cases where it might be text for certain success responses
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      } else {
        // Could be a simple text success message from backend
        return response.text().then(text => text || null); // Return null if text is empty
      }
    };
    ```

**G. Asynchronous Operations (`async/await`)**

*   All API calls are asynchronous operations. The `async/await` syntax is used extensively to handle these promises in a more readable and synchronous-looking style.
*   UI components that trigger API calls typically use `async` functions for their event handlers or `useEffect` callbacks and `await` the completion of the API service function call.
*   `try...catch` blocks are used in components to handle potential errors thrown by the API service functions (originating from `handleResponse`).

This structured approach to API interaction ensures that:
*   Backend communication logic is encapsulated and reusable.
*   Authentication tokens are consistently applied to protected requests.
*   Responses are handled uniformly, and errors are propagated for UI display.
*   The main UI components remain focused on presentation and user interaction, delegating data fetching and submission to the API service layer.