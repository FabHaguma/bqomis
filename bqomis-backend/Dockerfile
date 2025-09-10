# Multi-stage build for Spring Boot backend
FROM eclipse-temurin:17-jdk-alpine AS build

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw pom.xml ./
COPY .mvn .mvn

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN chmod +x mvnw && ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Create application user
RUN addgroup -S spring && adduser -S spring -G spring

# Set working directory
WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership
RUN chown spring:spring app.jar

# Switch to non-root user
USER spring

# Expose port
EXPOSE 8080

# Health check
# HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
#     CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
