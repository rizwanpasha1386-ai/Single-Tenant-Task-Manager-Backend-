📘 Multi-Tenant Project Management API

A scalable backend system built with Node.js, Express, and MongoDB that supports multi-tenant architecture and role-based access control (RBAC) for managing tenants, projects, members, and tasks.

🚀 Features
🏢 Multi-Tenant Architecture
Each tenant (organization) is isolated
Users can belong to multiple tenants
Tenant-level access control
🔐 Authentication & Authorization
JWT-based authentication (stored in HTTP-only cookies)
Middleware-based protection
Role-Based Access Control (RBAC):
Owner → Full control over tenant
Admin → Manage projects & tasks
Member → Access assigned projects & tasks
📁 Project Management
Create, update, delete projects
Assign members to projects
Admin vs Member access separation
Search projects by name
Filter projects by due date
👥 Member Management
Add/remove tenant members
Assign roles (Owner/Admin/Member)
Add/remove project members
Filter members by role
Search members by name/email
📋 Task Management
Create, update, delete tasks
Assign/reassign tasks to project members
Filter tasks by:
status
priority
assigned user
Members can:
View assigned tasks
Update task status
🔍 Query Features
Search using $regex (case-insensitive)
Filtering using:
$gte, $lte (dates)
$in (multiple values)
Sorting support (asc / desc)
✅ Validation Layer
Joi-based request validation
Centralized validation middleware:
validate(schema, 'body' | 'params' | 'query')
🧱 Tech Stack
Backend: Node.js, Express.js
Database: MongoDB + Mongoose
Authentication: JWT (cookie-based)
Validation: Joi
Architecture: MVC + Middleware-based RBAC
🌐 API Base Path
/api/auth
/api/tenant
/api/project
/api/task
📡 API Endpoints
🔑 Auth
POST /api/auth/signup
POST /api/auth/login
🏢 Tenant (Authenticated)
GET    /api/tenant?search=&role=
POST   /api/tenant
👑 Owner Actions
GET    /api/tenant/:tenantId
PATCH  /api/tenant/:tenantId
DELETE /api/tenant/:tenantId

POST   /api/tenant/:tenantId/createAdmin
POST   /api/tenant/:tenantId/add-members

GET    /api/tenant/:tenantId/members?role=&search=&sort=
DELETE /api/tenant/:tenantId/members/:memberId
PATCH  /api/tenant/:tenantId/role
📁 Projects (Admin)
POST   /api/project/:tenantId/projects
GET    /api/project/:tenantId/projects?search=&sort=

GET    /api/project/:tenantId/projects/:projectId
PATCH  /api/project/:tenantId/projects/:projectId
DELETE /api/project/:tenantId/projects/:projectId
👥 Project Members
POST   /api/project/:tenantId/projects/:projectId/members
DELETE /api/project/:tenantId/projects/:projectId/members/:memberId
GET    /api/project/:tenantId/projects/:projectId/members?search=&role=
👤 Member Access
GET /api/project/:tenantId/my-projects?search=&dueDate=
GET /api/project/:tenantId/my-projects/:projectId
📋 Tasks (Admin)
POST   /api/task/:tenantId/projects/:projectId/tasks
GET    /api/task/:tenantId/projects/:projectId/tasks?status=&assignedTo=&priority=&search=

PATCH  /api/task/:tenantId/projects/:projectId/tasks/:taskId
DELETE /api/task/:tenantId/projects/:projectId/tasks/:taskId

PATCH  /api/task/:tenantId/projects/:projectId/tasks/:taskId/assign
📋 Tasks (Member)
GET    /api/task/:tenantId/projects/:projectId/my-tasks?status=&priority=&search=&sortBy=&order=
GET    /api/task/:tenantId/projects/:projectId/tasks/:taskId

PATCH  /api/task/:tenantId/projects/:projectId/tasks/:taskId/updatestatus
🔐 Roles & Permissions
Action	Owner	Admin	Member
Manage Tenant	✅	❌	❌
Create Project	❌	✅	❌
Manage Projects	❌	✅	❌
Add Members	❌	✅	❌
Create Tasks	❌	✅	❌
Update Tasks	❌	✅	❌
Update Task Status	❌	❌	✅
View Projects	❌	✅	✅
🧠 Key Design Decisions
✅ RESTful API Design
Resource-based endpoints (/projects, /tasks)
Hierarchical structure:
tenant → project → task
✅ RBAC Enforcement
Middleware-based role validation
Project-level authorization checks
✅ Data Integrity
Users must belong to tenant before project assignment
Tasks can only be assigned to project members
✅ Scalable Middleware Architecture
auth → authentication
isOwner, isAdmin, isMember → role checks
IsProjectOwner, IsProjectMember → project-level access
validate → request validation
⚙️ How to Run
npm install
npm run dev
📦 Future Improvements
🔹 API Versioning (/api/v1)
🔹 Rate Limiting & Security (Helmet, CORS)
🔹 Logging (Winston / Morgan)
🔹 Unit & Integration Testing
🔹 Swagger API Documentation
🔹 Task Comments 💬
🔹 Notifications 🔔
🔹 File Uploads 📎
🔹 Activity Logs 📜
🔹 Caching (Redis) ⚡
🏁 Conclusion

This project demonstrates:

Multi-tenant backend architecture
Role-Based Access Control (RBAC)
RESTful API design with hierarchical resources
Scalable middleware-driven structure
Real-world features like search, filtering, and task assignment

Built as a step toward mastering backend development and system design.

👨‍💻 Author

Rizwan Pasha