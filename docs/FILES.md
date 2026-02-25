# Share-a-Meal File Map

This file explains what each file does and links to it.

## Root

- [.env](.env) - Environment variables for database, JWT, and service token.
- [.gitignore](.gitignore) - Git ignore rules for Node.js and local artifacts.
- [package.json](package.json) - Project metadata, scripts, and dependencies.
- [package-lock.json](package-lock.json) - Locked dependency versions for npm.

## Database

- [db/shareMeal.sql](db/shareMeal.sql) - SQL schema and setup for the MySQL database.

## App Entry

- [src/app.js](src/app.js) - Express app setup, middleware, routes, and guard scheduler.

## Configuration

- [src/config/db.js](src/config/db.js) - MySQL connection pool configuration.

## Controllers

- [src/controllers/adminController.js](src/controllers/adminController.js) - Admin verification and user management.
- [src/controllers/aiController.js](src/controllers/aiController.js) - AI expiry read/write endpoints.
- [src/controllers/authController.js](src/controllers/authController.js) - Register and login logic.
- [src/controllers/claimController.js](src/controllers/claimController.js) - Claim lifecycle (claim, pickup, complete).
- [src/controllers/mealController.js](src/controllers/mealController.js) - Meal CRUD and listing.
- [src/controllers/metricsController.js](src/controllers/metricsController.js) - Impact metrics queries.

## Middleware

- [src/middleware/auth.js](src/middleware/auth.js) - JWT auth, role checks, verification guard.
- [src/middleware/serviceAuth.js](src/middleware/serviceAuth.js) - Service token auth for AI endpoints.

## Jobs

- [src/jobs/mealGuards.js](src/jobs/mealGuards.js) - Auto-expire and auto-cancel guards.

## Routes

- [src/routes/adminRoutes.js](src/routes/adminRoutes.js) - Admin endpoints.
- [src/routes/aiRoutes.js](src/routes/aiRoutes.js) - AI endpoints.
- [src/routes/authRoutes.js](src/routes/authRoutes.js) - Auth endpoints.
- [src/routes/claimRoutes.js](src/routes/claimRoutes.js) - Claim endpoints.
- [src/routes/mealRoutes.js](src/routes/mealRoutes.js) - Meal endpoints.
- [src/routes/metricsRoutes.js](src/routes/metricsRoutes.js) - Metrics endpoints.

## API Route Summary

- Auth: `/api/auth/register`, `/api/auth/login`
- Admin: `/api/admin/users`, `/api/admin/users/pending`, `/api/admin/verify/:userId`, `/api/admin/revoke/:userId`
- Meals: `/api/meals`, `/api/meals/:mealId`, `/api/meals/status/:status`, `/api/meals/my/list`
- Claims: `/api/claims/meal/:mealId`, `/api/claims/my`, `/api/claims/:claimId/cancel`, `/api/claims/meal/:mealId/ready`, `/api/claims/:claimId/pickup`, `/api/claims/:claimId/complete`
- AI: `/api/ai/meals`, `/api/ai/meal/:mealId`, `/api/ai/meal/:mealId/expiry`
- Metrics: `/api/metrics`, `/api/metrics/restaurants`, `/api/metrics/ngos`, `/api/metrics/status`, `/api/metrics/timeline`, `/api/metrics/completion-time`

## Notes

- [src/models](src/models) - Currently empty (no ORM in MVP).
