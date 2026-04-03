# 🗂️ Task Manager – Single Tenant (Backend)

## 📌 Description

A backend system for managing tasks within a single organization (single-tenant architecture).
This system supports **role-based access control**, where admins can manage tasks and users, and users can work on assigned tasks.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* HTTP-only cookies for secure sessions
* Role-based access control (Admin & User)

---

### 🛠️ Admin Functionalities

* Create tasks
* Create User
* Assign tasks to users
* View all tasks
* View single task
* Update tasks (partial updates supported)
* Delete tasks
* View all users
* View individual user details

---

### 👤 User Functionalities *(Upcoming / Next Phase)*

* View assigned tasks
* View their particular single task
* Update task status

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
 ├── models/
 ├── routes/
 ├── middleware/
 ├── utils/
 └── app.js
```

---

## 🔌 API Endpoints (Admin)

### Tasks

```
POST   /api/admin/createuser
POST   /api/admin/tasks
GET    /api/admin/tasks
GET    /api/admin/tasks/:taskId
PUT   /api/admin/tasks/:taskId
DELETE /api/admin/tasks/:taskId
```

### Users

```
POST /api/user/login
GET /api/user/getMyTasks
GET /api/user/task/:id
patch /api/user/task/:id
```

---

## 🔐 Security Practices

* Password hashing using bcrypt
* JWT stored in HTTP-only cookies
* Protected routes using middleware
* Input validation and controlled updates

---

## 📊 Current Status

✅ Authentication system completed
✅ Admin task CRUD operations completed
✅ Role-based authorization implemented
🔄 User task operations completed
🔄 Advanced features (filtering, pagination) planned

---

## 🚀 Future Enhancements

* Task filtering & search
* Pagination
* Admin dashboard (analytics)
* Activity logs
* Redis caching

---

## 🤝 Contribution

Open to suggestions and improvements!

---

## 📬 Author

Developed by Rizwan Pasha
