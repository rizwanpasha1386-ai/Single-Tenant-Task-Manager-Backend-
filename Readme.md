# 🗂️ Task Manager – Project-Based System (Backend)

## 📌 Description

A backend system for managing tasks within a single organization (single-tenant architecture), upgraded to a **project-based structure**.

The system supports **role-based access control (RBAC)** with clear separation between admin and user responsibilities:

- **Admins** manage projects, members, users, and tasks  
- **Users** work on assigned tasks within projects  

---

## 🚀 Key Upgrades

### 🔄 v1 – Architecture Upgrade
- Migrated from **task-centric → project-centric architecture**
- Tasks now belong to projects  
- Users are added as project members  
- Access controlled at **project level**  
- Nested API structure for scalability  

---

### 🔥 v2 – Advanced Query System (NEW)

Enhanced API capabilities with production-level features:

- ✅ Pagination implemented across all endpoints  
- ✅ Dynamic sorting (any field, asc/desc)  
- ✅ Multi-field search support (name, email, title)  
- ✅ Flexible filtering (status, priority, role, date range)  
- ✅ Query-based API design for scalability  

👉 APIs upgraded from **basic CRUD → production-ready endpoints**

---

## 📊 Advanced Query Features

All GET endpoints support the following query parameters:

### 🔹 Pagination
```bash
?page=1&limit=10
🔹 Sorting
?sortBy=createdAt&order=desc
?sortBy=priority&order=asc
?sortBy=name&order=asc
🔹 Filtering
?status=todo
?priority=2
?role=admin
🔹 Search (Case-insensitive)
?search=task
?search=rizwan
Supports partial matching using MongoDB regex
Works across multiple fields (name, email, title)
🔹 Date Range Filtering
?startDate=2025-01-01&endDate=2025-01-31
💡 Example Combined Query
/api/admin/projects?search=manager&sortBy=name&order=asc&page=1&limit=10
🔐 Authentication & Authorization
JWT-based authentication
HTTP-only cookies for secure sessions
Role-based access control:
Admin
User
Project-level authorization:
Only project owner (admin) can manage resources
Only members can access project data
🛡️ Validation Layer

Comprehensive input validation implemented using Joi across all modules.

✅ Covers:
Request Body Validation
Create / Update (Projects, Tasks, Users)
Assign / Reassign operations
Params Validation
userId, projectId, taskId, memberId
Query Validation
Pagination (page, limit)
Filtering (status, priority)
💡 Benefits:
Prevents invalid data from reaching controllers
Reduces runtime errors
Improves API reliability and security
🛠️ Admin Functionalities
📁 Project Management
Create project
View all projects
View single project
Update project
Delete project
👥 Member Management
Add users to project
Remove users from project
View all project members
📋 Task Management
Create tasks within project
Assign tasks to members
View all tasks in a project
View single task
Update tasks
Delete tasks
Reassign tasks
👤 User Management
Create user
View all users
View single user
Update user
Delete user
👤 User Functionalities
View assigned projects
View project details
View tasks within a project
Update task status (todo, in progress, done)
🏗️ Tech Stack
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Authentication: JWT
Validation: Joi
Caching (Planned): Redis
📁 Project Structure
src/
├── controllers/
│   ├── admin/
│   └── user/
├── routes/
│   ├── admin/
│   └── user/
├── models/
├── validations/
├── middleware/
│   └── validate.js
├── utils/
└── app.js
🔌 API Endpoints
👨‍💼 Admin Routes
📁 Projects
POST   /api/admin/projects
GET    /api/admin/projects
GET    /api/admin/projects/:projectId
PATCH  /api/admin/projects/:projectId
DELETE /api/admin/projects/:projectId
👥 Members
POST   /api/admin/projects/:projectId/members
GET    /api/admin/projects/:projectId/members
DELETE /api/admin/projects/:projectId/members/:memberId
📋 Tasks
POST   /api/admin/projects/:projectId/tasks
GET    /api/admin/projects/:projectId/tasks
PATCH  /api/admin/projects/:projectId/tasks/:taskId
DELETE /api/admin/projects/:projectId/tasks/:taskId
PATCH  /api/admin/projects/:projectId/tasks/:taskId/assign
👤 Users
POST   /api/admin/users
GET    /api/admin/users
GET    /api/admin/users/:userId
PATCH  /api/admin/users/:userId
DELETE /api/admin/users/:userId
👤 User Routes
📁 Projects
GET /api/user/projects
GET /api/user/projects/:projectId
📋 Tasks
GET   /api/user/projects/:projectId/tasks
GET   /api/user/projects/:projectId/tasks/:taskId
PATCH /api/user/projects/:projectId/tasks/:taskId
⚡ Performance Optimizations
Pagination limits applied (max 50)
Efficient query structure for filtering & sorting
Field selection to reduce payload size
Indexing recommended for production
🧠 Design Highlights
Modular architecture (controllers, routes, validations)
Scalable query handling (pagination, filtering, sorting)
Clean separation of concerns
Production-level API patterns
📊 Current Status
✅ Authentication system completed
✅ Project-based architecture implemented
✅ Admin & user flows completed
✅ Role-based authorization enforced
✅ Validation layer implemented (Joi)
✅ Pagination across all endpoints
✅ Filtering, sorting, and search added
🚀 APIs are production-ready
🚀 Future Enhancements
Cursor-based pagination
Full-text search optimization
Activity logs & audit trail
Notifications system
Redis caching
Analytics dashboard
🤝 Contribution

Open to suggestions and improvements!

📬 Author

Developed by Rizwan Pasha