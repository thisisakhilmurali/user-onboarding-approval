# User Onboarding & Approval Platform

Full-stack implementation:
- Backend: Spring Boot (Java 17), H2 in-memory DB, JWT auth, role-based access (Admin vs User)
- Frontend: React (Vite), React Router, Context-based auth, Dark/Light theme toggle

## Features
### Backend
- POST /register: create user (status = PENDING, password hashed via SHA-256)
- POST /login: returns JWT containing role + status claims
- GET /me: returns current authenticated user profile
- Admin endpoints (JWT with ROLE_ADMIN required):
  - GET /admin/pending: list PENDING users
  - POST /admin/approve/{id}
  - POST /admin/reject/{id}
- H2 console: /h2-console (JDBC URL: jdbc:h2:mem:onboardingdb)
- Default admin user: admin@example.com / Admin@123 (status APPROVED)

### Frontend
- Registration form with client-side validation (name, email, password)
- Login form; stores JWT in localStorage
- AuthContext auto-loads /me to populate user data (name, role, status)
- Conditional navigation (admin sees pending list; users see status only)
- Admin pending list: Approve / Reject with optimistic UI updates
- Status badges (PENDING / APPROVED / REJECTED)
- Theme toggle (persisted in localStorage)
- Centralized API wrapper adds Authorization header & handles 401

## Security Notes
Current password hashing uses raw SHA-256 (per requirement of "some Java inbuilt class"). For production replace with BCrypt (Spring's PasswordEncoder /BCryptPasswordEncoder).

## Project Structure (Key Parts)
```
backend (root)
  pom.xml
  src/main/java/... (entities, services, security, controllers)
  src/main/resources/application.properties
  UserOnboarding.postman_collection.json
frontend/
  package.json
  src/
    api/client.js
    context/AuthContext.jsx
    components/*
    pages/*
    styles/global.css
    App.jsx, main.jsx, config.js
```

## Running Backend
### Prerequisites
- Java 17+
- Maven 3.9+

### Start (port 8083 configured in application.properties)
```
# From project root
mvn spring-boot:run
```
Or build & run jar:
```
mvn clean package
java -jar target/onboarding-0.0.1-SNAPSHOT.jar
```

### Change Port
Edit `src/main/resources/application.properties` (server.port) or override:
```
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8080"
```

### Default Admin
```
Email: admin@example.com
Password: Admin@123
```

## Running Frontend
### Prerequisites
- Node.js 18+ (includes npm)

### Setup & Run
```
cd frontend
npm install
npm run dev
```
Vite dev server default: http://localhost:5173

If backend port differs, create `.env` in `frontend/`:
```
VITE_API_BASE_URL=http://localhost:8083
```
(Already defaults to 8083 if not set.)

## Postman Collection
Import `UserOnboarding.postman_collection.json` in Postman. Variables included:
- baseUrl (http://localhost:8083)
- adminToken / userToken (auto set after login test scripts)

## Typical Flow
1. User registers via UI (/register form) -> status PENDING
2. User logs in -> sees dashboard with PENDING badge
3. Admin logs in -> visits Pending Users -> Approve or Reject
4. User refreshes (or re-login) -> status updates to APPROVED / REJECTED

## Frontend Auth Logic
- JWT stored in `localStorage` key: `auth_token`
- On mount, AuthContext calls `/me` (if token present)
- 401 responses trigger token clear + redirect on next guarded navigation

## Optimistic Admin Updates
Approve/Reject immediately remove row from UI; on failure original list is reloaded.

## H2 Database Inspection
Visit: http://localhost:8083/h2-console
Settings:
- JDBC URL: `jdbc:h2:mem:onboardingdb`
- User: `sa`
- Password: (blank)

Query example:
```
SELECT id, name, email, status, role, created_date FROM users ORDER BY id DESC;
```

## Enhancements (Future)
- Replace SHA-256 with BCrypt
- Token refresh / silent renewal
- Pagination & sorting for admin list
- Email notifications on approval/rejection
- Dockerfile + docker-compose (backend + frontend Nginx) (placeholder)

## License
Educational / sample implementation.

