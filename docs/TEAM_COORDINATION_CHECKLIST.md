# ShareAMeal v2.0.0 - Team Coordination Checklist

**Project Status:** Backend API Complete | Version 2.0.0 | Ready for Integration  
**Last Updated:** February 23, 2026

---

## 🔧 Backend Team (Current Status)

### ✅ Completed

- [x] All 37 API endpoints implemented
- [x] Sponsorship feature added (6 new endpoints)
- [x] Database schema migrated (restaurant → sme)
- [x] Swagger documentation complete (v2.0.0)
- [x] Authentication & authorization working
- [x] Rate limiting & request timeout middleware
- [x] Error handling standardized
- [x] Environment variables documented
- [x] Database migrations scripts ready

### ⏳ In Progress

- [ ] Fix 43 failing tests (response structure issues)
- [ ] Create sponsorship tests (20-30 test cases needed)
- [ ] Achieve 87/87 tests passing

### 📋 Handoff Deliverables

- [ ] **For DevOps:** Create deployment requirements document
- [ ] **For Frontend:** Schedule API walkthrough meeting
- [ ] **For Cybersecurity:** Prepare security review document
- [ ] **For Data Analysts:** Document metrics endpoints
- [ ] **For All Teams:** Share API base URL and Swagger link

---

## 🚀 DevOps Team

### Pre-Deployment Setup

- [ ] Review deployment requirements from Backend
  - Node.js version: **18+**
  - MySQL version: **8.0+**
  - Port: **3000**
- [ ] Decide on containerization approach
  - [ ] Request Dockerfile from Backend (if needed)
  - [ ] OR: Use company standard base images
- [ ] Set up environment-specific configurations
  - [ ] Development environment
  - [ ] Staging environment
  - [ ] Production environment

### Database Setup

- [ ] Review database migration scripts (`db/migrations/shareAMeal.sql`)
- [ ] Execute schema migration on staging database
- [ ] Review `scripts/migrate-rename-role.js` for role migration
- [ ] Set up database backups
- [ ] Configure read replicas (if needed for analytics)

### Environment Variables (Required)

- [ ] `PORT` - Application port (default: 3000)
- [ ] `DB_HOST` - MySQL host
- [ ] `DB_USER` - MySQL user
- [ ] `DB_PASSWORD` - MySQL password (coordinate with Security)
- [ ] `DB_NAME` - Database name (sharemeal)
- [ ] `JWT_SECRET` - JWT signing secret (coordinate with Security)
- [ ] `JWT_EXPIRES_IN` - Token expiry (default: 24h)
- [ ] `ADMIN_SECRET` - Admin registration secret
- [ ] `SERVICE_TOKEN` - AI service authentication token

### CI/CD Pipeline

- [ ] Set up automated testing in pipeline
- [ ] Configure deployment triggers (main branch)
- [ ] Set up health check monitoring (`GET /`)
- [ ] Configure logging aggregation
- [ ] Set up error tracking (e.g., Sentry)

### Post-Deployment

- [ ] Verify all 37 endpoints are accessible
- [ ] Test Swagger UI at `/api-docs`
- [ ] Monitor meal guard jobs (5-minute intervals)
- [ ] Set up API rate limit alerts
- [ ] Share production API URL with all teams

---

## 💻 Frontend Team

### API Integration Preparation

- [ ] Review Swagger documentation
  - **URL:** `http://[BASE_URL]/api-docs`
  - All 37 endpoints documented
- [ ] Schedule API walkthrough with Backend team
- [ ] Confirm error response format expectations
- [ ] Test CORS configuration with Backend

### Authentication Flow

- [ ] Implement registration flow
  - **Endpoint:** `POST /auth/register`
  - Roles: SME, NGO, Sponsor (NOT admin)
- [ ] Implement login flow
  - **User login:** `POST /auth/login`
  - **Admin login:** `POST /admin/auth/login`
- [ ] Implement JWT token storage (localStorage/sessionStorage)
- [ ] Implement token refresh logic (24h expiry)
- [ ] Add Authorization header to all protected requests
  - Format: `Authorization: Bearer <token>`

### User Role-Based Views

- [ ] **SME Dashboard:**
  - Create meal: `POST /meals`
  - View my meals: `GET /meals/my/list`
  - Update meal: `PATCH /meals/:mealId`
  - Delete meal: `DELETE /meals/:mealId`
  - Mark ready for pickup: `PATCH /claims/meal/:mealId/ready`
- [ ] **NGO Dashboard:**
  - Browse available meals: `GET /meals` or `GET /meals/status/AVAILABLE`
  - Claim meal: `POST /claims/meal/:mealId`
  - View my claims: `GET /claims/my`
  - Cancel claim: `PATCH /claims/:claimId/cancel`
  - Mark pickup: `PATCH /claims/:claimId/pickup`
  - Mark complete: `PATCH /claims/:claimId/complete`

- [ ] **Sponsor Dashboard:**
  - Create sponsorship: `POST /sponsorships`
  - View my contributions: `GET /sponsorships/my`
  - View impact metrics: `GET /sponsorships/impact`

- [ ] **Admin Dashboard:**
  - View pending users: `GET /admin/users/pending`
  - View all users: `GET /admin/users`
  - Verify user: `PATCH /admin/verify/:userId`
  - Revoke user: `PATCH /admin/revoke/:userId`

### Public Pages

- [ ] Landing page with metrics: `GET /metrics`
- [ ] Meal listing: `GET /meals`
- [ ] Meal details: `GET /meals/:mealId`
- [ ] Filter by status: `GET /meals/status/:status`

### Error Handling

- [ ] Handle 400 (validation errors)
- [ ] Handle 401 (unauthorized - redirect to login)
- [ ] Handle 403 (forbidden - show access denied)
- [ ] Handle 404 (not found)
- [ ] Handle 500 (server error - show friendly message)

### Data Models (from Swagger schemas)

- [ ] User model
- [ ] Meal model (includes meal_status ENUM)
- [ ] Claim model (includes claim_status ENUM)
- [ ] Sponsorship model

---

## 🎨 UI/UX Design Team

### User Flows to Design

- [ ] **Onboarding:**
  - Registration with role selection (SME/NGO/Sponsor)
  - Email/password validation UI
  - Admin verification waiting state
  - Account verified confirmation

- [ ] **SME Flow:**
  - Meal creation form (8 fields + validations)
  - Meal listing dashboard
  - Meal edit/delete actions
  - Mark "ready for pickup" action
  - Notification when meal is claimed

- [ ] **NGO Flow:**
  - Browse meals catalog
  - Meal detail view with SME info
  - Claim confirmation dialog
  - Active claims tracking
  - Pickup workflow (pending → in-transit → completed)
  - Cancel claim action

- [ ] **Sponsor Flow:**
  - Browse meals/NGOs to sponsor
  - Sponsorship form (meal or NGO selection)
  - Contribution history
  - Impact metrics dashboard

- [ ] **Admin Flow:**
  - Pending users queue
  - User verification actions (approve/reject)
  - All users management table

### Components to Design

- [ ] Login/Register forms
- [ ] Navigation (role-based menu items)
- [ ] Meal card component (status badges)
- [ ] Claim status timeline
- [ ] Metrics dashboard widgets
- [ ] User profile page
- [ ] Data tables (meals, claims, users)
- [ ] Empty states
- [ ] Loading states
- [ ] Error states

### Design Constraints

- [ ] Mobile-responsive (mobile-first approach)
- [ ] Accessibility standards (WCAG 2.1)
- [ ] Status color coding:
  - AVAILABLE (green)
  - CLAIMED (yellow)
  - READY_FOR_PICKUP (blue)
  - IN_TRANSIT (orange)
  - COMPLETED (green)
  - EXPIRED (gray)
  - CANCELLED (red)

---

## 🔒 Cybersecurity Team

### Pre-Deployment Security Review

- [ ] Review authentication implementation
  - JWT token generation logic
  - Password hashing (bcryptjs used)
  - Token expiry and refresh strategy
- [ ] Review authorization middleware
  - Role-based access control
  - Route protection patterns
- [ ] Test rate limiting configuration
  - Current: 100 requests per 15 minutes per IP
  - Adjust if needed
- [ ] Review input validation
  - SQL injection prevention (parameterized queries)
  - XSS prevention
  - Request body validation

### Secrets Management

- [ ] Generate production secrets:
  - [ ] `JWT_SECRET` (256-bit minimum)
  - [ ] `ADMIN_SECRET` (strong passphrase)
  - [ ] `SERVICE_TOKEN` (for AI team)
  - [ ] `DB_PASSWORD` (MySQL root password)
- [ ] Store secrets in secure vault (not in code)
- [ ] Share secrets securely with DevOps
- [ ] Set up secret rotation schedule

### CORS Configuration Review

- [ ] Review current CORS settings with Backend
- [ ] Whitelist Frontend domain(s)
- [ ] Configure allowed methods
- [ ] Configure allowed headers
- [ ] Test cross-origin requests

### API Security Testing

- [ ] Penetration testing on all 37 endpoints
- [ ] Test authentication bypass attempts
- [ ] Test role escalation vulnerabilities
- [ ] Test SQL injection on all DB queries
- [ ] Test XSS on input fields
- [ ] Test CSRF protection
- [ ] Test file upload security (if applicable)
- [ ] Test rate limiting effectiveness

### Data Protection

- [ ] Review PII handling (user emails, phone numbers)
- [ ] Ensure passwords are never logged
- [ ] Review database encryption at rest
- [ ] Review HTTPS enforcement
- [ ] GDPR compliance check (if applicable)

### Monitoring & Alerts

- [ ] Set up security event logging
- [ ] Configure alerts for:
  - Failed login attempts (brute force)
  - Rate limit violations
  - JWT token tampering
  - Unauthorized access attempts
- [ ] Review audit log requirements

---

## 📊 Data Analyst Team

### Available Metrics Endpoints (Public Access)

- [ ] Overall metrics: `GET /metrics`
  - Total meals, kg saved, NGOs served, completion rate
- [ ] SME metrics: `GET /metrics/smes`
  - Top SMEs by contribution
- [ ] NGO metrics: `GET /metrics/ngos`
  - Top NGOs by meals claimed
- [ ] Status breakdown: `GET /metrics/status`
  - Count by meal status
- [ ] Activity timeline: `GET /metrics/timeline`
  - Daily meal creation and completion
- [ ] Efficiency: `GET /metrics/completion-time`
  - Average time from prep to completion

### Database Access Requirements

- [ ] Request read-only database access from DevOps
  - Tables: users, meals, claims, sponsorships
- [ ] Coordinate on best time for heavy queries (off-peak)
- [ ] Discuss data export needs

### Analytics Requirements

- [ ] Define KPIs to track:
  - [ ] User growth (by role)
  - [ ] Meal waste reduction (kg saved)
  - [ ] Claim completion rate
  - [ ] Average claim lifecycle time
  - [ ] Sponsorship trends
  - [ ] Geographic distribution (if location data added)
  - [ ] Peak activity times

### Dashboard Needs

- [ ] Coordinate with UI team on analytics dashboard design
- [ ] Decide on real-time vs. batch reporting
- [ ] Discuss data visualization needs
- [ ] Plan predictive analytics (expiry prediction)

### AI Team Coordination

- [ ] Review AI endpoints: `/ai/meals`, `/ai/meal/:mealId/expiry`
- [ ] Coordinate on ML model training data exports
- [ ] Discuss prediction accuracy tracking

---

## 🤖 AI/ML Team (if applicable)

### Available AI Service Endpoints

**Authentication Required:** `SERVICE_TOKEN` header

- [ ] Get meal by ID: `GET /ai/meal/:mealId`
- [ ] Get all meals for training: `GET /ai/meals`
- [ ] Update expiry prediction: `POST /ai/meal/:mealId/expiry`
  - Body: `{ expiry_timestamp: "ISO8601" }`
- [ ] Update food status: `PATCH /ai/meal/:mealId/food-status`
  - Body: `{ food_status: "FRESH|NEAR_EXPIRY|EXPIRED" }`

### Integration Tasks

- [ ] Request `SERVICE_TOKEN` from Backend/Security
- [ ] Test AI endpoint authentication
- [ ] Design expiry prediction model
  - Input: prep_time, food_type, storage_type, quantity
  - Output: expiry_timestamp
- [ ] Set up automated prediction pipeline
- [ ] Coordinate with Backend on prediction update frequency

### Data Requirements

- [ ] Request historical meal data for training
- [ ] Define features for ML model
- [ ] Plan model retraining schedule
- [ ] Set up prediction accuracy monitoring

---

## 📞 Cross-Team Meetings Needed

### 1. API Integration Kickoff

**Attendees:** Backend, Frontend, UI/UX  
**Agenda:**

- Swagger demo
- Authentication flow walkthrough
- Error handling conventions
- CORS configuration
- Timeline alignment

### 2. Security Review

**Attendees:** Backend, Cybersecurity, DevOps  
**Agenda:**

- Authentication/authorization review
- Secrets management
- Environment variable security
- Rate limiting strategy
- Compliance requirements

### 3. Deployment Planning

**Attendees:** Backend, DevOps, Cybersecurity  
**Agenda:**

- Infrastructure requirements
- Docker approach
- Database migration strategy
- Environment setup
- Monitoring and logging
- Go-live timeline

### 4. Analytics & ML Integration

**Attendees:** Backend, Data Analysts, AI Team  
**Agenda:**

- Metrics endpoints demo
- Database access for analytics
- AI service authentication
- Prediction pipeline design
- Data export requirements

### 5. Design Handoff

**Attendees:** Frontend, UI/UX, Backend  
**Agenda:**

- User flow review
- Component design
- API data mapping
- Status visualization
- Mobile responsiveness

---

## 🎯 Project Timeline Recommendations

### Week 1: Foundation

- Backend: Fix remaining tests
- DevOps: Set up staging environment
- Security: Complete security audit
- Frontend: Review Swagger, set up project structure
- UI/UX: Complete user flow designs

### Week 2: Integration

- Backend: Deploy to staging
- Frontend: Implement authentication
- Frontend: Integrate core flows (register, login, meals CRUD)
- Data Analysts: Set up database access

### Week 3: Testing

- All teams: Integration testing
- Security: Penetration testing
- Frontend: E2E testing
- Backend: Load testing

### Week 4: Launch

- DevOps: Production deployment
- All teams: Smoke testing
- Monitor and iterate

---

## 📋 Critical Dependencies

| Team              | Blocked By                                    | Blocking                          |
| ----------------- | --------------------------------------------- | --------------------------------- |
| **Frontend**      | Backend (Swagger), UI/UX (designs)            | User acceptance testing           |
| **DevOps**        | Backend (requirements), Security (secrets)    | All teams (deployment)            |
| **Security**      | Backend (code review)                         | DevOps (secrets), Frontend (CORS) |
| **Data Analysts** | DevOps (DB access)                            | Management (reporting)            |
| **AI Team**       | Backend (SERVICE_TOKEN), Data (training data) | Backend (predictions)             |
| **UI/UX**         | Backend (API structure)                       | Frontend (implementation)         |

---

## 📞 Contact & Escalation

- **Backend Team Lead:** [Your Name]
- **Swagger Documentation:** `http://[BASE_URL]/api-docs`
- **Database Schema:** `db/migrations/shareAMeal.sql`
- **Migration Scripts:** `scripts/migrate-rename-role.js`
- **Project Version:** 2.0.0
- **API Versioning:** Not yet implemented (recommend adding `/v2/` prefix)

---

## ✅ Definition of Done (For Launch)

- [ ] Backend: All 87 tests passing
- [ ] Backend: Deployed to production
- [ ] Frontend: All user roles functional
- [ ] Security: Audit complete, no critical issues
- [ ] DevOps: Monitoring and alerts active
- [ ] UI/UX: Design approved by stakeholders
- [ ] Data: Analytics dashboard live
- [ ] All teams: Go-live smoke test passed

---

**Last Updated:** February 23, 2026  
**Project Status:** Backend Complete | Integration Phase Starting  
**Next Milestone:** Backend Testing Completion → Staging Deployment
