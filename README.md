# BQOMIS - Bank Queue Optimization Management Information System

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Setup](#database-setup)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

BQOMIS (Bank Queue Optimization Management Information System) is a comprehensive solution designed to address the persistent challenges of long wait times and inefficient service delivery in banking environments. The system leverages real-time data analytics to streamline queue management processes, resulting in improved customer satisfaction and operational efficiency.

This project was developed as part of a school assignment to demonstrate modern web development practices and real-world problem-solving skills.

## 🚀 Problem Statement

The banking sector continues to face significant challenges in managing customer queues effectively, particularly during peak periods. Despite advancements in digital banking, issues persist:

- **Long waiting times** during peak hours
- **Poorly distributed branch traffic** leading to customer dissatisfaction
- **Operational inefficiencies** in resource allocation
- **Manual token systems** that fail to address real-time fluctuations
- **Static scheduling** that doesn't adapt to dynamic service demands

BQOMIS addresses these issues by providing customers with real-time insights into branch service availability and queue lengths, while empowering administrators with powerful management tools.

## ✨ Features

### 🏦 Customer Features
- **Real-time Branch Discovery**: View nearby branches offering desired services
- **Queue Visibility**: See current queue lengths and estimated wait times
- **Smart Booking**: Reserve time slots for specific services
- **Service Selection**: Browse available banking services by branch
- **Appointment Management**: View and manage personal appointments

### 👨‍💼 Admin Features
- **Branch Management**: Add, edit, and manage bank branches
- **Service Management**: Configure services offered at each branch
- **Queue Monitoring**: Real-time queue analytics and insights
- **Time Slot Control**: Manage service availability and scheduling
- **User Management**: Handle customer accounts and permissions
- **Analytics Dashboard**: Comprehensive reporting and data visualization
- **Data Export**: Export reports in Excel/CSV format for analysis

### 🔧 System Features
- **Real-time Updates**: Live data synchronization across all components
- **Responsive Design**: Optimized for desktop and mobile devices
- **Secure Authentication**: Robust user authentication and authorization
- **Role-based Access**: Different interfaces for customers and administrators
- **Data Analytics**: Advanced reporting and business intelligence

## 🛠 Tech Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.4.5** - Application framework
- **Spring Data JPA** - Data persistence
- **Spring Security** - Authentication and authorization
- **PostgreSQL** - Primary database
- **Flyway** - Database migration
- **Maven** - Dependency management

### Frontend
- **React 19.1.0** - User interface library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and development server
- **SCSS** - Enhanced CSS with variables and mixins
- **Recharts** - Data visualization and charts
- **Context API** - State management

### Development Tools
- **VS Code** - Primary IDE
- **Git** - Version control
- **GitHub** - Repository hosting
- **Docker** - Containerization (planned)

## 📁 Project Structure

```
bqomis/
├── bqomis-backend/           # Spring Boot backend application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/bqomis/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── model/          # JPA entities
│   │   │   │   ├── repository/     # Data repositories
│   │   │   │   ├── service/        # Business logic
│   │   │   │   └── util/           # Utility classes
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/migration/   # Flyway migrations
│   │   └── test/                   # Unit and integration tests
│   ├── target/                     # Maven build output
│   └── pom.xml                     # Maven configuration
│
├── bqomis-frontend/          # React frontend application
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Page components
│   │   ├── contexts/               # React contexts
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── services/               # API service layer
│   │   ├── utils/                  # Utility functions
│   │   ├── features/               # Feature-specific modules
│   │   └── assets/                 # Static assets
│   ├── public/                     # Public assets
│   ├── package.json               # NPM configuration
│   └── vite.config.js             # Vite configuration
│
└── docs/                     # Project documentation
    ├── Backend-Docs-Summary.md
    ├── Frontend-Docs-Summary.md
    └── [Additional documentation files]
```

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:

- **Java 17** or higher
- **Node.js 22.15.0** or higher
- **PostgreSQL 12** or higher
- **Maven 3.6** or higher
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fabrice137/bqomis.git
   cd bqomis
   ```

2. **Set up the database**
   ```sql
   -- Connect to PostgreSQL and create the database
   CREATE DATABASE bqomis_db;
   CREATE USER postgres WITH ENCRYPTED PASSWORD 'your_password_here';
   GRANT ALL PRIVILEGES ON DATABASE bqomis_db TO postgres;
   ```

3. **Configure backend environment**
   ```bash
   cd bqomis-backend
   # Copy the example environment file
   cp .env.example .env
   # Edit .env file and set your database credentials:
   # DB_USERNAME=your_db_username
   # DB_PASSWORD=your_db_password
   ```

4. **Install backend dependencies and run**
   ```bash
   # Install dependencies (including spring-dotenv for .env file support)
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

5. **Install frontend dependencies and run**
   ```bash
   cd ../bqomis-frontend
   npm install
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

### Database Setup

The application uses Flyway for database migrations. The database schema will be automatically created when you first run the backend application.

**Database Configuration:**
- Host: localhost
- Port: 5432
- Database: bqomis_db
- Username: Set via `DB_USERNAME` environment variable (defaults to `postgres`)
- Password: Set via `DB_PASSWORD` environment variable

**Environment Variables:**
Create a `.env` file in the `bqomis-backend` directory with your database credentials:
```
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## 📖 Usage

### For Customers
1. **Browse Branches**: View available bank branches in your area
2. **Check Services**: See what services are offered at each branch
3. **Monitor Queues**: View real-time queue lengths and wait times
4. **Book Appointments**: Reserve time slots for specific services
5. **Manage Profile**: Update personal information and preferences

### For Administrators
1. **Access Admin Panel**: Login with admin credentials
2. **Manage Branches**: Add, edit, or remove bank branches
3. **Configure Services**: Set up services available at each branch
4. **Monitor Operations**: View real-time analytics and queue statistics
5. **Generate Reports**: Export data for analysis and reporting

## 📚 API Documentation

The backend provides a RESTful API with the following main endpoints:

- **Authentication**: `/api/auth/*`
- **Branches**: `/api/branches/*`
- **Services**: `/api/services/*`
- **Appointments**: `/api/appointments/*`
- **Users**: `/api/users/*`
- **Analytics**: `/api/analytics/*`

For detailed API documentation, please refer to the [Backend Documentation](docs/Backend-Docs-Summary.md).

## 🤝 Contributing

This is a school project, but contributions and feedback are welcome! Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Project Author**: Fabrice Haguma
- GitHub: [@fabrice137](https://github.com/fabrice137)
- Project Repository: [bqomis](https://github.com/fabrice137/bqomis)

## 🎓 Academic Context

This project was developed as part of a school assignment to demonstrate:
- Modern web development practices
- Full-stack application development
- Database design and management
- Real-world problem solving
- Software engineering principles

**Target Audience**: 3 lecturers, 2 students, 30+ users
**Development Timeline**: 1 month
**Estimated Completion**: December 2024

---

*Developed with ❤️ for optimizing banking experiences*
