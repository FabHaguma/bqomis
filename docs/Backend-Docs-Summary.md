**BQOMIS Backend Documentation**

**Part I: Overview**
`I.1. Introduction & Purpose`
`I.2. Project Setup & Structure (Spring Boot)`
`I.3. Core Concepts / Cross-Cutting Concerns` - `I.3.1. API Design (REST)` - `I.3.2. Auth (Spring Security, JWT - planned)` - `I.3.3. DB & Migrations (JPA, Flyway)` - `I.3.4. Validation & Error Handling` - `I.3.5. Logging (SLF4J, Logback)` - `I.3.6. Config (application.properties)` - `I.3.7. CORS Config`

**Part II: Core Modules**
`II.1. User Management`
`II.2. Role Management`
`II.3. District Management`
`II.4. Branch Management`
`II.5. Service Management`
`II.6. Branch-Service Relationship`
`II.7. Appointment Management`
`II.8. Analytics`
`II.9. Global Configuration (includes Branch Overrides via AppSettingsUtil)`

**Part III: Utilities & Shared Components**
`III.1. LookupUtil (Data Caching)`
`III.2. MapperUtil (DTO-Entity Conversion - implied)`
`III.3. Password Encoding (BCrypt)`

**Part IV: Testing**
`IV.1. Unit Testing (JUnit, Mockito)`
`IV.2. Integration Testing (Spring Boot Test)`
`IV.3. Test Data Management`

**Part V: Deployment & Operations**
`V.1. Build (Maven)`
`V.2. Deployment`
`V.3. DB Init & Seeding (Flyway)`

**Part VI: Appendix**
`VI.1. API Endpoint Summary`
`VI.2. DB Schema Details`
`VI.3. Key Dependencies`
`VI.4. Potential Future Enhancements`

---

## I. BQOMIS Backend Documentation - Overview

### 1. Introduction & Purpose

**Introduction**
The BQOMIS Backend is a Spring Boot application serving as the data, business logic, and API hub for the BQOMIS platform.

**Purpose**
To securely and efficiently:

- Manage core banking data (users, roles, districts, branches, services).
- Orchestrate appointment booking.
- Support administrative functions.
- Enable analytics.
- Ensure security.
- Facilitate system configuration.
  It exposes RESTful APIs for the frontend.

**Key Technologies:** Java, Spring Boot (Data JPA, Web, Security for BCrypt), Maven, PostgreSQL, Flyway, Lombok.

### 2. Project Setup & Structure (Spring Boot)

**2.1. Development Environment Setup**

1.  **Prerequisites:** JDK 17+, Maven 3.6+, PostgreSQL, IDE.
2.  **Clone/Create Project:** From Git or Spring Initializr (dependencies: Web, Data JPA, PostgreSQL Driver, Lombok, Security).
3.  **Database Setup:** Running PostgreSQL, create `bqomis_db`. User needs privileges.
4.  **Configure `application.properties`:** (`src/main/resources/`) for DB connection (URL, user, pass), server port, JPA.
5.  **Build:** `mvn clean install`.
6.  **Run:** Via IDE or `mvn spring-boot:run`. Default: `http://localhost:8080`.

**2.2. High-Level Folder Structure (`src`)**
Standard Maven layout:

```
src/main/
├── java/com/bqomis/       # Base package
│   ├── BqomisApplication.java # Main class
│   ├── config/              # Spring Config (WebConfig, SecurityConfig - planned)
│   ├── controller/          # REST API Controllers
│   ├── dto/                 # Data Transfer Objects
│   ├── model/               # JPA Entities
│   ├── repository/          # Spring Data JPA Repositories
│   ├── service/             # Business logic
│   └── util/                # Utilities (MapperUtil, AppSettingsUtil, LookupUtil)
└── resources/
    ├── application.properties # Main config
    ├── db/migration/        # Flyway SQL scripts (V1__init.sql, V2__first_inserts.sql)
```

- **`config/`**: `WebConfig.java` for CORS, `BCryptPasswordEncoder`. `SecurityConfig.java` planned for JWT.
- **`controller/`**: Handle HTTP, delegate to services.
- **`dto/`**: API request/response payloads.
- **`model/`**: JPA `@Entity` classes.
- **`repository/`**: Interfaces extending `JpaRepository`.
- **`service/`**: Core business logic.
- **`util/`**: `MapperUtil` (DTO-Entity), `AppSettingsUtil` (config), `LookupUtil` (caching).
- **`db/migration/`**: Flyway scripts for schema (`V1__init.sql`) and initial data (`V2__first_inserts.sql`).

### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.1. API Design & RESTful Principles

- Resource-based URLs (e.g., `/api/users`).
- Standard HTTP Methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- Statelessness.
- JSON for data exchange.
- Appropriate HTTP Status Codes.
- Controllers use `@RestController`, `@RequestMapping`, etc. DTOs shape JSON.

#### I.3.2. Authentication & Authorization (Spring Security, JWT)

- **Current:** `BCryptPasswordEncoder` for password hashing. Basic authentication logic in `UserController` and `UserService` for `/api/users/authenticate`. Rudimentary role checks.
- **Planned:** Full Spring Security with JWT.
  - `SecurityConfig.java`: Stateless session, JWT filters.
  - JWT Generation: On successful login (e.g., `/api/auth/login`), signed JWT with claims (user ID, roles).
  - JWT Authentication Filter: Extracts token from `Authorization: Bearer <token>`, validates, sets `Authentication` in `SecurityContextHolder`.
  - Authorization: `@PreAuthorize` or `@Secured` on endpoints/services.
  - `UserDetailsService`: Loads user data for Spring Security.

#### I.3.3. Database Schema & Migrations (JPA, Flyway)

PostgreSQL with Spring Data JPA (Hibernate) and Flyway.

- **JPA Entities (`model/`)**: `@Entity` classes (User, Branch, Service, Appointment, etc.) map to DB tables. Relationships defined via annotations.
- **JPA Repositories (`repository/`)**: Interfaces extending `JpaRepository` for CRUD and custom queries.
- **Flyway (`db/migration/`)**: Versioned SQL scripts for schema management. `V1__init.sql` (DDL), `V2__first_inserts.sql` (DML). Flyway applies migrations on app startup.
- **Hibernate Config (`application.properties`):** `spring.jpa.hibernate.ddl-auto` (ideally `validate` or `none` with Flyway). `spring.jpa.show-sql=true` for dev.

#### I.3.4. Data Validation & Error Handling

- **Validation:**
  - **Bean Validation (JSR 380):** Annotations (`@NotNull`, `@Email`, `@Size`) on DTOs/Entities. `@Valid` on controller `@RequestBody`. Spring returns `400 Bad Request` on failure.
  - **Custom Validators:** For complex logic.
  - **Service-Level Validation:** Business rules, throwing custom exceptions.
- **Error Handling:**
  - **`@RestControllerAdvice`:** Global exception handler. `@ExceptionHandler` methods for specific exceptions (e.g., `MethodArgumentNotValidException`, custom `ResourceNotFoundException`).
  - Returns standardized JSON error responses (timestamp, status, message, error details).
  - **Custom Exceptions:** Define specific exceptions (e.g., `ResourceNotFoundException`).

#### I.3.5. Logging Strategy (SLF4J, Logback)

Spring Boot uses SLF4J with Logback.

- Code against SLF4J API (`org.slf4j.Logger`).
- Configured in `application.properties` (levels, file output, pattern) or `logback-spring.xml` for advanced settings.
- Usage: `private static final Logger logger = LoggerFactory.getLogger(MyClass.class); logger.info("Message: {}", value);`
- Log Levels: TRACE, DEBUG, INFO, WARN, ERROR.

#### I.3.6. Configuration Management (application.properties)

Primary config in `src/main/resources/application.properties`.

- **Key Areas:** Server port, Database connection (URL, user, pass), JPA/Hibernate (`ddl-auto`, `show-sql`), Flyway (`enabled`, `locations`), Logging.
- Accessed via `@Value`, `@ConfigurationProperties`, or `Environment`.
- Spring Profiles can manage environment-specific configs (e.g., `application-dev.properties`).

#### I.3.7. CORS Configuration

Managed in `WebConfig.java` (`com.bqomis.config`).

- Implements `WebMvcConfigurer`, overrides `addCorsMappings`.
- `registry.addMapping("/api/**")`: Applies to `/api/*` paths.
- `.allowedOrigins("http://localhost:4200", "http://localhost:3000")`: Whitelists frontend origins (update for prod).
- `.allowedMethods(...)`: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS`.
- `.allowedHeaders("*")`, `.allowCredentials(true)`, `.maxAge(3600)`.

---

## Part II: Core Modules & Functionality

(Summarizing module structure: Each typically has Entity, Repository, Service, Controller, DTOs)

### 1. User Management Module (`II.1` in original outline)

- **Entity (`User.java`):** `id`, `username`, `email` (unique), `password` (hashed), `role` (String), `phoneNumber`, `profilePicture`.
- **Repository (`UserRepository`):** Extends `JpaRepository`. Custom queries: `findByEmail`, `findByUsername`, `findByRole`, `existsByEmail`.
- **Service (`UserService`):** Business logic: registration (hashes password, sets default role "CLIENT"), authentication (checks hashed password), CRUD, DTO conversion.
- **Controller (`UserController`):** API endpoints: `/api/users/register`, `/api/users/authenticate` (basic, pre-JWT), GET all (admin), GET by ID/email, PUT update, DELETE.
- **DTOs (`UserDTO`, etc.):** For request/response. `UserDTO` excludes password in responses. `LoginRequestDTO`, `UserRegistrationDTO` handle specific fields.

### 2. Role Management Module (`II.2`)

- **Entity (`Role.java`):** `id`, `name` (e.g., "ADMIN"), `description`. (Used if roles are more complex than simple strings).
- **Repository, Service, Controller:** Standard CRUD for roles. `RoleController` likely exposes `GET /api/roles` for admin UI.

### 3. District Management Module (`II.3`)

- **Entity (`District.java`):** `id`, `name`, `province`.
- **Controller (`DistrictController`):** `GET /api/districts`. (Admin CRUD implied if needed).

### 4. Branch Management Module (`II.4`)

- **Entity (`Branch.java`):** `id`, `name`, `address`, `district` (String), `province` (String).
- **Controller (`BranchController`):** `GET /api/branches`, `GET /api/branches/district/{districtName}`, `POST /api/branches`, `DELETE /api/branches/{id}`. (PUT/PATCH for updates planned).

### 5. Service Management Module (`II.5`)

- **Entity (`Service.java`):** `id`, `name`, `description` (banking services).
- **Controller (`ServiceController`):** `GET /api/services`, `POST /api/services`, `DELETE /api/services/{id}`. (PUT/PATCH for updates planned).

### 6. Branch-Service Relationship Module (`II.6`)

- **Entity (`BranchService.java`):** Link table: `id`, `branch` (FK), `service` (FK), `isActive`. Potentially unique constraint on `(branch_id, service_id)`. Backend populates denormalized `branchName`, `serviceName`, `district` in DTOs/responses.
- **Repository (`BranchServiceRepository`):** `findByBranchId`, `findByServiceId`, `findByBranchIdAndServiceId`.
- **Service (`BranchServiceService`):** Assign/remove services from branches, update link details (e.g., `isActive`).
- **Controller (`BranchServiceController`):** `POST /api/branch-services` (assign), `DELETE /api/branch-services/{id}` (remove by link ID), `GET /api/branch-services/byBranch/{branchId}` (get services for a branch).
- **DTOs (`BranchServiceDTO`):** Contains `branchId`, `serviceId`, `isActive`, and potentially names for response.

### 7. Appointment Management Module (`II.7`)

- **Entity (`Appointment.java`):** `id`, `user` (FK), `branchService` (FK), `appointmentDateTime` (ZonedDateTime), `status` (String: SCHEDULED, COMPLETED, etc.), `notes`, `createdAt`, `updatedAt`.
- **Repository (`AppointmentRepository`):** Queries by user, branch, service, date ranges, status.
- **Service (`AppointmentService`):** Core logic:
  - `bookAppointment`: Validates user, branch-service, time slot availability, booking window/notice rules (from `AppSettingsUtil`).
  - Status updates, cancellation logic (checks `allow_cancellation_hours`).
  - `getAvailableSlots`: Determines open slots for frontend.
  - Batch creation with `BatchAppointmentResponseDTO` (successes/failures).
- **Controller (`AppointmentController`):**
  - `POST /api/appointments` (book).
  - `GET /api/appointments/{id}`, `/user/{userId}`, `/branch/{branchId}?date=...`, `/today/branch/{branchId}`.
  - `GET /api/appointments` (admin, with filters: `dateFrom`, `branchId`, `status`, `districtName`).
  - `PUT /api/appointments/{id}/status`.
  - `DELETE /api/appointments/{id}` (cancel).
  - `POST /api/appointments/batch`.
- **DTOs (`AppointmentDTO`, `BatchAppointmentResponseDTO`, etc.):** `AppointmentDTO` for GET requests includes `branchName`, `serviceName`. Creation payload requires `userId`, `branchServiceId`, `date`, `time`.

### 8. Analytics Module (`II.8`)

- **Service (`AnalyticsService`):** Aggregates data from other repositories (Appointment, User, etc.). Caches results if needed. Methods: `getAppointmentCountsByStatus`, `getAppointmentsPerBranch`, `getAppointmentsPerService`, `getBookingTrends`, `getPeakBookingTimes`.
- **Controller (`AnalyticsController`):** Exposes endpoints like `/api/analytics/appointments/countsByStatus`, `/perBranch`, `/trends`, `/peak-times`. Accepts `startDate`, `endDate`, `periodType`, `branchId`, `district`, `serviceId`, `groupBy` as query params.
- **Data Structures:** Returns JSON (e.g., `Map<String, Long>`, `List<Map<String, Object>>`).

### 9. Global Configuration Module (`II.9`)

- **Managed by `AppSettingsUtil` (incorporates branch-specific overrides too).**
- **Entity (`GlobalApplicationConfiguration.java`):** Single row. Fields: `bookingWindowDays`, `minBookingNoticeHours`, `defaultQueueThresholdLow/Moderate`, `defaultSlotDurationMins`, `defaultAllowCancellationHours`, `maintenanceModeEnabled`.
- **Entity (`BranchConfigurationOverrides.java`):** `branchId` (FK), nullable overrides for global settings (e.g., `queueThresholdLow`, `slotDurationMins`, `maxAppointmentsPerSlot`). Backend logic falls back to global if override is `NULL`.
- **Util (`AppSettingsUtil.java`):** `@PostConstruct` loads global config and branch overrides. Provides getters. Handles updates and saves to DB. `refresh()` reloads from DB.
- **Controller (`GlobalApplicationConfigurationController` for global, specific Branch settings endpoints for overrides):**
  - `GET /api/settings/global`, `PUT /api/settings/global` (for `GlobalApplicationConfiguration`).
  - `GET /api/branches/{branchId}/settings`, `PUT /api/branches/{branchId}/settings` (for `BranchConfigurationOverrides`). Backend handles merging `null` in payload to mean "use global".

---

## Part III: Utilities & Shared Components

1.  **`LookupUtil` (`III.1`):** In-memory caching (loaded at startup) for frequently accessed, rarely changing data like Districts, Branches, Services, and BranchService relationships to optimize lookups and reduce DB load.
2.  **`MapperUtil` (`III.2`):** (Implied, good practice) Utility for converting between DTOs and JPA Entities (e.g., using ModelMapper or MapStruct).
3.  **Password Encoding (`III.3`):** `BCryptPasswordEncoder` bean configured in `WebConfig.java`, used by `UserService`.

---

## Part IV: Testing

1.  **Unit Testing (`IV.1`):** JUnit, Mockito for services, controllers.
2.  **Integration Testing (`IV.2`):** Spring Boot Test (`@SpringBootTest`) for testing interactions between components, repository access.
3.  **Test Data Management (`IV.3`):** Sample JSON (e.g., `test_users.json`) or SQL scripts for populating test DB.

---

## Part V: Deployment & Operations

1.  **Build Process (`V.1`):** Maven (`mvn clean install` creates JAR/WAR).
2.  **Deployment Considerations (`V.2`):** Deploy JAR to server with JRE. Environment variables for sensitive configs.
3.  **Database Initialization & Seeding (`V.3`):** Flyway manages schema (`V1__init.sql`) and initial data (`V2__first_inserts.sql`).

---

## Part VI: Appendix

1.  **API Endpoint Summary (`VI.1`):** (Effectively covered in Part II module descriptions and frontend summary. Could be auto-generated by Swagger/OpenAPI if integrated).
2.  **Detailed Database Schema (`VI.2`):** Defined by JPA Entities and `V1__init.sql`.
3.  **Key Dependencies & Versions (`VI.3`):** Spring Boot, Java, PostgreSQL, Maven, Flyway, Lombok.
4.  **Potential Future Enhancements (Backend) (`VI.4`):** Full JWT implementation, more advanced caching, asynchronous operations (notifications), enhanced analytics, more robust test coverage.
