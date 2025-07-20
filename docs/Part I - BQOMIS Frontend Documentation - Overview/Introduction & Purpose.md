
## I. BQOMIS Frontend Documentation - Overview

### 1. Introduction & Purpose

**Introduction**

The Bank Queue Optimizing Management Information System (BQOMIS) Frontend is a modern, responsive web application designed to serve as the primary user interface for both clients and administrative staff of the BQOMIS platform. Built with React (using Vite for a fast development experience) and SCSS for styling, it aims to provide an intuitive and efficient way to interact with the system's backend services.

**Purpose**

The core purpose of the BQOMIS Frontend is to address inefficient queue management in bank branches by providing a digital platform for:

*   **Clients:**
    *   Discovering bank branches and the services they offer.
    *   Viewing estimated queue traffic for services at different times.
    *   Booking appointments for specific services at chosen branches, thereby reducing physical waiting times.
    *   Managing their scheduled appointments.
    *   Managing their user profile and account settings.
*   **Administrative Staff (Admins/Managers):**
    *   Managing foundational data such as districts, branches, and banking services.
    *   Defining relationships between branches and the services they offer.
    *   Managing user accounts, particularly for staff and other administrators.
    *   Overseeing and managing client appointments system-wide.
    *   Accessing analytics and reports to understand operational efficiency, service demand, and branch performance.
    *   Configuring system-wide and branch-specific operational settings.
    *   Utilizing developer tools for data seeding and testing.

The frontend application acts as a client to the BQOMIS Backend (a Spring Boot application), consuming its RESTful APIs to fetch data, submit changes, and facilitate all user interactions. It emphasizes a clear separation of concerns for client and admin perspectives, providing tailored interfaces for each user role.

**Key Technologies Used:**

*   **React:** A JavaScript library for building user interfaces, chosen for its component-based architecture, efficiency, and large ecosystem.
*   **Vite:** A next-generation frontend tooling system that provides an extremely fast development server and optimized build process.
*   **JavaScript (ES6+):** The primary programming language.
*   **SCSS (Sassy CSS):** A CSS preprocessor used for more organized, maintainable, and powerful styling. A global theming approach with variables is utilized for consistency.
*   **React Router DOM:** For client-side routing and navigation within the single-page application.
*   **Recharts:** A composable charting library used for data visualization on the admin analytics dashboard.
*   **Axios (or Fetch API):** For making HTTP requests to the backend API (Fetch API has been primarily used in the generated examples).

The overall goal is to create a seamless, user-friendly experience that optimizes service delivery for bank clients and provides powerful management tools for bank staff.