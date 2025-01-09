## For user creation, use the Postman collection:

**Create a user with "admin" role**

**Create a user with "team member" role**

# Project Task Management - Backend Services

Project task management microservices

## Technologies Used

- **Nest.js**: Framework for Backend application development.
- **MongoDB**: Non-relational database for storing information.
- **TypeScript**: Superset of JavaScript that allows for a better development experience with static typing.
- **Repository Design Pattern**: A design pattern that separates the process, in this case, the interaction with the database, so it can be easily changed in the future if needed.
- **JWT Token**: Used for encryption and authentication.
- **UseGuards**: Used to apply guards to routes, controllers, or specific methods. Guards are classes that implement the CanActivate interface and serve to control access to routes based on specific logic, such as authentication or authorization.

## Project Structure

The project folder structure is as follows:

📁 root/

├── 📁 Modules/ # Modules (separated microservices) for each service (Auth, Projects, Task, Comments)

├── ├── 📁 controller/ # Controller of the microservice (endpoints)

├── ├── 📁 data/ # Contains the repository that interacts with MongoDB

├── ├── 📁 service/ # Handles interaction with the repository

├── ├── 📁 utils/ # Contains necessary environment variables

├── 📁 src/ # General content of the service

├── ├── 📁 common/ # Contains schemas for MongoDB

├── ├── 📁 envs/ # Contains environment variables (local only)

├── ├── 📁 utils/ # Contains methods/classes to be used throughout the project

## Installation and Configuration

Follow these steps to install and run the project on your local machine:

1. **Install and configure MongoDB (Windows)**:

   [MongoDB for Windows](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)

   [MongoDB for Linux](https://www.mongodb.com/docs/manual/administration/install-on-linux/)

### MongoDB must be running locally on port 27017 with the database name 'projects-tasks'

2. **Clone the repository**:

   git clone git@github.com:hacm1997/project-task-service.git

3. **Navigate to the root directory**:

   cd project-task-service

4. **Install dependencies**:

   npm install

5. **Start the service in development mode**:

   npm run dev

# Authentication API Endpoints

## Overview

This document provides details about the authentication-related API endpoints for login and profile retrieval. These endpoints are part of the `AuthController` and handle user authentication and protected resource access.

---

## Endpoints

### 1. **Login**

**URL:** `/auth/login`  
**Method:** `POST`  
**Description:** Authenticates a user and returns a JWT token upon successful login.

#### Request

**Headers:**

- Content-Type: `application/json`

**Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

#### Response

**Status Code:** `200 OK`

**Body:**

```json
{
  "access_token": "string"
}
```

#### Possible Errors

- `401 Unauthorized`: Invalid credentials provided.

---

### 2. **Get Profile**

**URL:** `/auth/profile`  
**Method:** `GET`  
**Description:** Retrieves the profile of the currently authenticated user.

#### Request

**Headers:**

- Authorization: `Bearer <JWT Token>`

**Body:** None

#### Response

**Status Code:** `200 OK`

**Body:**

```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  ... // other user details
}
```

#### Possible Errors

- `401 Unauthorized`: JWT token is missing or invalid.

---

## Notes

1. The `JwtAuthGuard` is applied to the `/auth/profile` endpoint to ensure that only authenticated users can access this resource.
2. The `login` endpoint does not require authentication and is used to obtain a JWT token for subsequent requests.

# Project Management API Endpoints

## Overview

This document describes the API endpoints for managing projects. These endpoints allow for creating, retrieving, updating, and deleting projects, as well as managing collaborators and tasks associated with projects. The endpoints are protected by JWT authentication and are accessible only to authorized users.

---

## Endpoints

### 1. **Create Project**

**URL:** `/project`  
**Method:** `POST`  
**Description:** Creates a new project.

#### Request

**Headers:**

- Authorization: `Bearer <JWT Token>`
- Content-Type: `application/json`

**Body:**

```json
{
  "name": "string",
  "description": "string",
  "collaborators": ["string"]
}
```

#### Response

**Status Code:** `201 Created`

**Body:**

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "collaborators": ["string"]
}
```

**Possible Errors:**

- `401 Unauthorized`: User is not authorized.
- `400 Bad Request`: Invalid input data.

---

### 2. **Get All Projects**

**URL:** `/project`  
**Method:** `GET`  
**Description:** Retrieves all projects with optional filters.

#### Request

**Headers:**

- Authorization: `Bearer <JWT Token>`

**Query Parameters:**

- `limit`: Number of projects per page (optional).
- `page`: Page number (optional).
- `name`: Filter by project name (optional).
- `description`: Filter by project description (optional).

#### Response

**Status Code:** `200 OK`

**Body:**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "collaborators": ["string"]
    }
  ],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

**Possible Errors:**

- `401 Unauthorized`: User is not authorized.

---

### 3. **Get Projects by Collaborators**

**URL:** `/project/by-user-member`  
**Method:** `POST`  
**Description:** Retrieves projects where specified collaborators are members.

#### Request

**Headers:**

- Authorization: `Bearer <JWT Token>`
- Content-Type: `application/json`

**Body:**

```json
{
  "collaborators": ["string"]
}
```

#### Response

**Status Code:** `200 OK`

**Body:**

```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "collaborators": ["string"]
  }
]
```

**Possible Errors:**

- `401 Unauthorized`: User is not authorized.

---

### 4. **Get Project by ID**

**URL:** `/project/:id`  
**Method:** `GET`  
**Description:** Retrieves a project by its ID.

#### Request

**Headers:**

- Authorization: `Bearer <JWT Token>`

**Parameters:**

- `id`: The ID of the project.

#### Response

**Status Code:** `200 OK`

**Body:**

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "collaborators": ["string"]
}
```

**Possible Errors:**

- `401 Unauthorized`: User is not authorized.
- `404 Not Found`: Project not found.

---

### 5. **Add Collaborator to Project**

**URL:** `/project/collaborators`  
**Method:** `POST`  
**Description:** Adds collaborators to a project.

#### Request

**Headers:**

- Authorization: `Bearer <JWT Token>`
- Content-Type: `application/json`

**Body:**

```json
{
  "projectId": "string",
  "collaboratorId": ["string"]
}
```

#### Response

**Status Code:** `200 OK`

**Body:**

```json
{
  "message": "Collaborators added successfully."
}
```

**Possible Errors:**

- `401 Unauthorized`: User is not authorized.
- `404 Not Found`: Project not found.

---

### 6. **Update Project**

**URL:** `/project/:projectId`  
**Method:** `PUT`  
**Description:** Updates the details of a project.

#### Request

**Headers:**

- Authorization: `Bearer <JWT Token>`
- Content-Type: `application/json`

**Parameters:**

- `projectId`: The ID of the project to update.

**Body:**

```json
{
  "name": "string",
  "description": "string"
}
```

#### Response

**Status Code:** `200 OK`

**Body:**

```json
{
  "message": "Project updated successfully."
}
```

**Possible Errors:**

- `401 Unauthorized`: User is not authorized.
- `404 Not Found`: Project not found.

---

### 7. **Remove Collaborator from Project**

**URL:** `/project/collaborators/remove/:projectId/:collaboratorId`  
**Method:** `PUT`  
**Description:** Removes a collaborator from a project.

#### Request

**Headers:**

- Authorization: `Bearer <JWT Token>`

**Parameters:**

- `projectId`: The ID of the project.
- `collaboratorId`: The ID of the collaborator to remove.

#### Response

**Status Code:** `200 OK`

**Body:**

```json
{
  "message": "Collaborator removed successfully."
}
```

**Possible Errors:**

- `401 Unauthorized`: User is not authorized.
- `404 Not Found`: Project or collaborator not found.

---

### 8. **Add Task to Project**

**URL:** `/project/tasks/:projectId`  
**Method:** `POST`  
**Description:** Adds a task to a project.

#### Request

**Headers:**

- Authorization: `Bearer <JWT Token>`
- Content-Type: `application/json`

**Parameters:**

- `projectId`: The ID of the project.

**Body:**

```json
{
  "title": "string",
  "description": "string",
  "assignedTo": "string",
  "dueDate": "string",
  "status": "string"
}
```

#### Response

**Status Code:** `201 Created`

**Body:**

```json
{
  "message": "Task added successfully."
}
```

**Possible Errors:**

- `401 Unauthorized`: User is not authorized.
- `404 Not Found`: Project not found.

---

### 9. **Remove Task from Project**

**URL:** `/project/tasks/remove/:projectId/:taskId`  
**Method:** `PUT`  
**Description:** Removes a task from a project.

#### Request

**Headers:**

- Authorization: `Bearer <JWT Token>`

**Parameters:**

- `projectId`: The ID of the project.
- `taskId`: The ID of the task to remove.

#### Response

**Status Code:** `200 OK`

**Body:**

```json
{
  "message": "Task removed successfully."
}
```

**Possible Errors:**

- `401 Unauthorized`: User is not authorized.
- `404 Not Found`: Project or task not found.

---

### 10. **Delete Project**

**URL:** `/project/:projectId`  
**Method:** `DELETE`  
**Description:** Deletes a project.

#### Request

**Headers:**

- Authorization: `Bearer <JWT Token>`

**Parameters:**

- `projectId`: The ID of the project to delete.

#### Response

**Status Code:** `200 OK`

**Body:**

```json
{
  "message": "Project deleted successfully."
}
```

**Possible Errors:**

- `401 Unauthorized`: User is not authorized.
- `404 Not Found`: Project not found.

# Task Endpoints Documentation

## Authentication

All endpoints in this controller are protected using the `JwtAuthGuard`. Ensure to include a valid JWT token in the `Authorization` header for accessing these endpoints.

---

## Endpoints

### 1. Get Tasks by Project ID

**URL:** `GET /task/:projectId`

**Description:** Retrieves all tasks associated with a specific project.

**Query Parameters:**

- `title` (optional): Filter tasks by title.

**Path Parameters:**

- `projectId` (string): ID of the project.

**Response:**

- Returns an array of tasks (`TaskDocument[]`).

---

### 2. Search Tasks by Title

**URL:** `GET /task/search`

**Description:** Retrieves tasks that match a specific title.

**Query Parameters:**

- `title` (required): Title of the task to search for.

**Response:**

- Returns an array of tasks (`TaskDocument[]`).

---

### 3. Get Task by ID

**URL:** `GET /task/by-id/:taskId`

**Description:** Retrieves a single task based on its ID.

**Path Parameters:**

- `taskId` (string): ID of the task to retrieve.

**Response:**

- Returns a single task (`TaskDocument`).

---

### 4. Update Task

**URL:** `PUT /task/:taskId`

**Description:** Updates the details of a task.

**Path Parameters:**

- `taskId` (string): ID of the task to update.

**Request Body:**

- `title` (string, optional): New title for the task.
- `description` (string, optional): New description for the task.
- `dueDate` (Date, optional): Updated due date for the task.
- `status` (string, optional): Updated status of the task (e.g., "pending", "in progress", "completed").
- `assignedTo` (string, optional): ID of the user assigned to the task.

**Response:**

- Returns the updated task (`Task`).

---

## Models

### Task

Represents a task object.

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: string;
  assignedTo: string;
}
```

### TaskDocument

Represents a MongoDB document for a task.

```typescript
interface TaskDocument extends Task {
  createdAt: Date;
  updatedAt: Date;
}
```

# Comment API Documentation

This document describes the endpoints for managing comments within tasks in the application. Authentication is required for all endpoints, using a JWT-based guard.

---

## Base URL

`/comment`

---

## Endpoints

### 1. Create a Comment

**POST** `/comment/:taskId`

#### Description:

Creates a new comment for a specific task.

#### Request:

- **Headers:**
  - `Authorization`: `Bearer <token>`
- **Path Parameters:**
  - `taskId` (string): The ID of the task where the comment will be added.
- **Body:**
  ```json
  {
    "content": "string",
    "attachments": ["string"]
  }
  ```

#### Response:

- **200 OK**
  ```json
  {
    "id": "string",
    "content": "string",
    "attachments": ["string"],
    "createdAt": "string",
    "updatedAt": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
  ```

---

### 2. Get Comments for a Task

**GET** `/comment/:taskId`

#### Description:

Retrieves all comments associated with a specific task.

#### Request:

- **Headers:**
  - `Authorization`: `Bearer <token>`
- **Path Parameters:**
  - `taskId` (string): The ID of the task whose comments will be retrieved.

#### Response:

- **200 OK**
  ```json
  [
    {
      "id": "string",
      "content": "string",
      "attachments": ["string"],
      "createdAt": "string",
      "updatedAt": "string",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    }
  ]
  ```

---

### 3. Delete a Comment

**DELETE** `/comment/:commentId`

#### Description:

Deletes a specific comment by its ID.

#### Request:

- **Headers:**
  - `Authorization`: `Bearer <token>`
- **Path Parameters:**
  - `commentId` (string): The ID of the comment to be deleted.

#### Response:

- **200 OK**
  ```json
  {
    "message": "string",
    "success": true
  }
  ```

---

## Notes

- All endpoints are protected and require the user to be authenticated with a valid JWT token.
- `CommentDto` refers to the structure of the comment being sent to the server, including `content` and optionally `attachments`.
- The `CommentBase` response structure includes metadata about the comment and its author.
