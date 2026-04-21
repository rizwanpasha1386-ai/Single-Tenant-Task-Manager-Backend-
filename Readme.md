📘 Multi-Tenant Project Management API

A multi-tenant backend system built with Node.js, Express, and MongoDB that supports role-based access control (RBAC) for managing projects, members, and tasks.

🚀 Features
🏢 Multi-Tenant Architecture
Each tenant (organization) is isolated
Users can belong to multiple tenants
🔐 Authentication & Authorization
JWT-based authentication
Role-based access control:
Owner
Admin
Member
📁 Project Management
Create, update, delete projects
Assign members to projects
View projects (admin vs member)
👥 Member Management
Add/remove project members
Ensure users belong to tenant before adding
📋 Task Management
Create, update, delete tasks
Assign tasks to project members
Members can:
View their tasks
Update task status
✅ Validation Layer
Joi-based request validation
Centralized validation middleware
🧱 Tech Stack
Backend: Node.js, Express
Database: MongoDB + Mongoose
Auth: JWT
Validation: Joi
📂 Folder Structure
src/
│
├── controllers/
│   ├── auth.controller.js
│   ├── project.controller.js
│   ├── task.controller.js
│
├── routes/
│   ├── auth.routes.js
│   ├── project.routes.js
│   ├── task.routes.js
│
├── middlewares/
│   ├── auth.js
│   ├── roles.middleware.js
│   ├── project.middleware.js
│   ├── validate.js
│
├── models/
│   ├── user.model.js
│   ├── project.model.js
│   ├── task.model.js
│   ├── membership.model.js
│
├── validations/
│   ├── auth.validation.js
│   ├── project.validation.js
│   ├── task.validation.js
│
└── app.js
🔐 Roles & Permissions
Action	         Owner	Admin	Member
Create Project	   ❌	✅	❌
Delete Project	   ❌	✅ 	❌
Add Members	       ❌	✅	❌
View Projects	   ❌	✅	✅ 
Create Tasks	   ❌	✅	❌
Update Task	       ❌	✅	❌
Update Task Status ❌	❌	✅
📡 API Endpoints
🔑 Auth
POST /signup
POST /login
📁 Projects (Admin)
POST   /:tenantId/projects
GET    /:tenantId/projects
GET    /:tenantId/projects/:projectId
PATCH  /:tenantId/projects/:projectId
DELETE /:tenantId/projects/:projectId
👥 Project Members
POST   /:tenantId/projects/:projectId/members
DELETE /:tenantId/projects/:projectId/members/:memberId
GET    /:tenantId/projects/:projectId/members
👤 Member Access
GET /:tenantId/my-projects
GET /:tenantId/projects/:projectId
📋 Tasks (Admin)
POST   /:tenantId/projects/:projectId/tasks
GET    /:tenantId/projects/:projectId/tasks
PATCH  /:tenantId/projects/:projectId/tasks/:taskId
DELETE /:tenantId/projects/:projectId/tasks/:taskId
PATCH  /:tenantId/projects/:projectId/tasks/:taskId/assign
📋 Tasks (Member)
GET    /:tenantId/projects/:projectId/my-tasks
GET    /:tenantId/projects/:projectId/tasks/:taskId
PATCH  /:tenantId/projects/:projectId/tasks/:taskId/status
🧠 Key Design Decisions
✅ RESTful API Design
Resource-based URLs (/projects, /tasks)

Clear hierarchy:

tenant → project → task
✅ RBAC Enforcement
Middleware-based role validation
Project-level access control
✅ Data Integrity
Users must belong to tenant before project assignment
Tasks can only be assigned to project members
✅ Scalable Middleware
auth → authentication
roles.middleware → role checks
project.middleware → project-level authorization
🔧 Validation
Joi schemas for:
Auth
Projects
Tasks
Central middleware:
validate(schema, 'body' | 'params' | 'query')
⚠️ Future Improvements
🔹 API Versioning (/api/v1)
🔹 Rate Limiting & Security (Helmet, CORS)
🔹 Logging (Winston / Morgan)
🔹 Unit & Integration Tests
🔹 Swagger API Documentation
🔹 Soft Delete for projects/tasks
🔹 Activity Logs (audit trail)
🏁 Conclusion

This system demonstrates:

Clean backend architecture
Proper RBAC implementation
RESTful API design