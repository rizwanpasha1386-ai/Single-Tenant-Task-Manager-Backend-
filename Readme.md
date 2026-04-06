# 🗂️ Task Manager – Project-Based System (Backend)

## 📌 Description

A backend system for managing tasks within a single organization (single-tenant architecture), upgraded to a **project-based structure**.

The system now supports **role-based access control (RBAC)** with clear separation between admin and user responsibilities:

* **Admins** manage projects, members, and tasks
* **Users** work on assigned tasks within projects

---

## 🚀 Key Upgrade (v1)

🔄 Migrated from **task-centric → project-centric architecture**

* Tasks now belong to projects
* Users are added as project members
* Access is controlled at **project level**
* Nested API structure for scalability

---

## 🔐 Authentication & Authorization

* JWT-based authentication
* HTTP-only cookies for secure sessions
* Role-based access control:

  * **Admin**
  * **User**
* Project-level authorization:

  * Only project owner (admin) can manage resources
  * Only members can access project data

---

## 🛠️ Admin Functionalities

### 📁 Project Management

* Create project
* View all projects (created by admin)
* View single project
* Update project
* Delete project

---

### 👥 Member Management

* Add users to project
* Remove users from project
* View all project members

---

### 📋 Task Management

* Create tasks within project
* Assign tasks to project members
* View all tasks in a project
* View single task
* Update tasks (partial updates supported)
* Delete tasks
* Reassign tasks

---

### 👤 User Management

* Create user
* View all users
* View single user

---

## 👤 User Functionalities

* View assigned projects
* View single project (if member)
* View tasks assigned to them within a project
* View single task
* Update task status (pending / done)

---

## 🏗️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT
* **Caching (Planned):** Redis

---

## 📁 Project Structure

```
src/
 ├── controllers/
 │    ├── admin/
 │    └── user/
 ├── routes/
 │    ├── admin/
 │    └── user/
 ├── models/
 ├── middleware/
 ├── utils/
 └── app.js
```

---

## 🔌 API Endpoints

### 👨‍💼 Admin Routes

#### 📁 Projects

```
POST   /api/admin/projects
GET    /api/admin/projects
GET    /api/admin/projects/:projectId
PATCH  /api/admin/projects/:projectId
DELETE /api/admin/projects/:projectId
```

---

#### 👥 Members

```
POST   /api/admin/projects/:projectId/members
GET    /api/admin/projects/:projectId/members
DELETE /api/admin/projects/:projectId/members/:memberId
```

---

#### 📋 Tasks

```
POST   /api/admin/projects/:projectId/tasks
GET    /api/admin/projects/:projectId/tasks
PATCH  /api/admin/projects/:projectId/tasks/:taskId
DELETE /api/admin/projects/:projectId/tasks/:taskId
PATCH  /api/admin/projects/:projectId/tasks/:taskId/assign
```

---

#### 👤 Users

```
POST   /api/admin/users
GET    /api/admin/users
GET    /api/admin/users/:userId
```

---

### 👤 User Routes

#### 📁 Projects

```
GET /api/user/projects
GET /api/user/projects/:projectId
```

---

#### 📋 Tasks

```
GET    /api/user/projects/:projectId/tasks
GET    /api/user/projects/:projectId/tasks/:taskId
PATCH  /api/user/projects/:projectId/tasks/:taskId
```

---

## 🔐 Security Practices

* Password hashing using bcrypt
* JWT stored in HTTP-only cookies
* Protected routes using middleware
* Role-based and project-based authorization
* Input validation and controlled updates

---

## 📊 Current Status

✅ Authentication system completed
✅ Project-based architecture implemented
✅ Admin project, member, and task management completed
✅ User task flow implemented
✅ Role-based authorization enforced at data level
🔄 Filtering & pagination (in progress)

---

## 🚀 Future Enhancements

* Task filtering & search
* Pagination
* Admin dashboard (analytics)
* Activity logs
* Notifications
* Redis caching
* Role hierarchy (manager vs member)

---

## 🤝 Contribution

Open to suggestions and improvements!

---

## 📬 Author

Developed by Rizwan Pasha
