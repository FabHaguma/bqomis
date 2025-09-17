package com.bqomis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BqomisApplication {

	public static void main(String[] args) {
		// In production we rely on real environment variables injected by Docker / host.
		// The .env file is only present during local development. To avoid startup
		// failure in containers where the file is absent, we ignore missing files.
		// Additionally, only attempt to load when running without an explicitly
		// provided Spring profile or when profile looks like a dev environment.
		String activeProfile = System.getenv("SPRING_PROFILES_ACTIVE");
				boolean isDevLike = activeProfile == null || activeProfile.contains("dev") || activeProfile.contains("local");
		if (isDevLike) {
			Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.ignoreIfMalformed()
				.load();
			// Populate System properties so Spring can pick them up (e.g. DB creds)
			dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
		}
		SpringApplication.run(BqomisApplication.class, args);
	}

}
