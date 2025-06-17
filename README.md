# Blog API
This is a RESTful API for a blogging platform built with Node.js, Express, and MongoDB

---

## Requirements
1. User should be able to register 
2. User should be able to login with JWT authentication
3. Implement JWT-based authentication middleware
4. User should be able to create blog posts
5. Users should be able to get all published blog posts
6. Users should be able to get their own blog posts (published and draft)
7. Users should be able to get a specific blog post by ID
8. Users should be able to update their own blog posts
9. Users should be able to delete their own blog posts
10. Implement pagination for blog posts listing
11. Implement filtering and search functionality
12. Calculate and display reading time for blog posts
13. Track read count for published posts
14. Test application with comprehensive test suite

---

## Setup
- Install NodeJS, MongoDB
- Clone this repository
- Create `.env` file using `.env.example` as template
- Run `npm install` to install dependencies
- Run `npm run dev` for development or `npm start` for production

---

## Base URL
- localhost:3000 (development)
- your-deployed-url.com (production)

## Models
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  _id |  string |  required, auto-generated |
|  first_name |  string |  required |
|  last_name | string  |  required |
|  email  |  string |  required, unique, lowercase |
|  password |   string |  required, hashed |

### BlogPost
| field  |  data_type | constraints  |
|---|---|---|
|  _id |  string |  required, auto-generated |
|  title |  string |  required, unique, 3-100 chars |
|  description | string  |  required, 10-255 chars |
|  tags  |  array |  required, array of strings |
|  author     | string  |  required, auto-generated from user |
|  authorId |   string |  required, reference to user |
|  state |  string |  required, enum: ['draft', 'published'], default: 'draft' |
|  readCount |  number |  default: 0 |
|  readingTime |  string |  auto-calculated |
|  body |  string |  required, min 20 chars |
|  createdAt |  date |  auto-generated |
|  updatedAt |  date |  auto-generated |

## APIs
---

### Signup User

- Route: /api/v1/users/signup
- Method: POST
- Body: 
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

- Responses

Success (201)
```json
{
  "response": {
    "status": 201,
    "success": true,
    "message": "User created successfully",
    "data": {
      "user": {
        "_id": "user123abc",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

Error (409 - User already exists)
```json
{
  "response": {
    "status": 409,
    "success": false,
    "message": "User already exists"
  }
}
```

---

### Login User

- Route: /api/v1/users/login
- Method: POST
- Body: 
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

- Responses

Success (200)
```json
{
  "response": {
    "status": 200,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "user123abc",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

Error (400 - Invalid credentials)
```json
{
  "response": {
    "status": 400,
    "success": false,
    "message": "User not found" // or "Invalid password!"
  }
}
```

---

### Create Blog Post

- Route: /api/v1/blogposts
- Method: POST
- Headers:
    - Authorization: Bearer {token}
- Body: 
```json
{
  "title": "My First Blog Post",
  "description": "This is an amazing blog post about technology",
  "tags": ["tech", "programming", "nodejs"],
  "body": "This is the main content of the blog post. It contains detailed information about the topic and provides valuable insights to readers.",
  "state": "published"
}
```

- Responses

Success (201)
```json
{
  "response": {
    "status": 201,
    "success": true,
    "message": "Post created successfully",
    "data": {
      "_id": "post123abc",
      "title": "My First Blog Post",
      "description": "This is an amazing blog post about technology",
      "tags": ["tech", "programming", "nodejs"],
      "author": "John Doe",
      "authorId": "user123abc",
      "state": "published",
      "readCount": 0,
      "readingTime": "2 min",
      "body": "This is the main content...",
      "createdAt": "2025-06-17T10:30:00.000Z",
      "updatedAt": "2025-06-17T10:30:00.000Z"
    }
  }
}
```

---

### Get All Published Blog Posts

- Route: /api/v1/blogposts
- Method: GET
- Query Parameters:
    - page (default: 1)
    - author (filter by author name)
    - title (filter by title)
    - tags (comma-separated list of tags)
    - order_by (default: createdAt, options: read_count, reading_time, createdAt)
    - order (default: desc, options: asc, desc)
    - search (search in title, author, content)

- Responses

Success (200)
```json
{
  "response": {
    "status": 200,
    "success": true,
    "message": "Posts retrieved successfully",
    "data": [
      {
        "_id": "post123abc",
        "title": "My First Blog Post",
        "description": "This is an amazing blog post",
        "tags": ["tech", "programming"],
        "author": "John Doe",
        "authorId": "user123abc",
        "state": "published",
        "readCount": 5,
        "readingTime": "2 min",
        "body": "This is the main content...",
        "createdAt": "2025-06-17T10:30:00.000Z",
        "updatedAt": "2025-06-17T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCount": 25
    },
    "sorting": {
      "order_by": "createdAt",
      "order": "desc"
    }
  }
}
```

---

### Get User's Own Blog Posts

- Route: /api/v1/blogposts/myblogs
- Method: GET
- Headers:
    - Authorization: Bearer {token}
- Query Parameters:
    - state (filter by state: draft, published)
    - page (default: 1)
    - limit (default: 20)

- Responses

Success (200)
```json
{
  "message": "Blog posts fetched successfully",
  "data": [
    {
      "_id": "post123abc",
      "title": "My Draft Post",
      "description": "This is a draft post",
      "tags": ["personal"],
      "author": "John Doe",
      "authorId": "user123abc",
      "state": "draft",
      "readCount": 0,
      "readingTime": "1 min",
      "body": "Draft content...",
      "createdAt": "2025-06-17T10:30:00.000Z",
      "updatedAt": "2025-06-17T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### Get Single Blog Post

- Route: /api/v1/blogposts/:id
- Method: GET

- Responses

Success (200)
```json
{
  "response": {
    "status": 200,
    "success": true,
    "message": "Blog retrieved successfully",
    "data": {
      "_id": "post123abc",
      "title": "My First Blog Post",
      "description": "This is an amazing blog post",
      "tags": ["tech", "programming"],
      "author": "John Doe",
      "authorId": "user123abc",
      "state": "published",
      "readCount": 6,
      "readingTime": "2 min",
      "body": "This is the main content...",
      "createdAt": "2025-06-17T10:30:00.000Z",
      "updatedAt": "2025-06-17T10:30:00.000Z"
    }
  }
}
```

Error (404 - Post not found)
```json
{
  "response": {
    "status": 404,
    "success": false,
    "message": "Post not found",
    "data": null
  }
}
```

---

### Update Blog Post

- Route: /api/v1/blogposts/:id
- Method: PUT
- Headers:
    - Authorization: Bearer {token}
- Body: (All fields optional)
```json
{
  "title": "Updated Blog Post Title",
  "description": "Updated description",
  "tags": ["updated", "tech"],
  "body": "Updated content of the blog post",
  "state": "published"
}
```

- Responses

Success (200)
```json
{
  "status": 200,
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "_id": "post123abc",
    "title": "Updated Blog Post Title",
    "description": "Updated description",
    "tags": ["updated", "tech"],
    "author": "John Doe",
    "authorId": "user123abc",
    "state": "published",
    "readCount": 6,
    "readingTime": "3 min",
    "body": "Updated content...",
    "createdAt": "2025-06-17T10:30:00.000Z",
    "updatedAt": "2025-06-17T11:00:00.000Z"
  }
}
```

Error (403 - Unauthorized)
```json
{
  "status": 403,
  "success": false,
  "message": "You are not authorized to update this post"
}
```

---

### Delete Blog Post

- Route: /api/v1/blogposts/:id
- Method: DELETE
- Headers:
    - Authorization: Bearer {token}

- Responses

Success (200)
```json
{
  "response": {
    "status": 200,
    "success": true,
    "message": "Post deleted successfully"
  }
}
```

Error (403 - Unauthorized)
```json
{
  "response": {
    "status": 403,
    "success": false,
    "message": "You are not authorized to delete this post"
  }
}
```

---

## Features

### Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes with middleware

### Blog Management
- Create, read, update, delete blog posts
- Draft and published states
- Author-based authorization

### Advanced Features
- Reading time calculation (183 WPM average)
- Read count tracking for published posts
- Pagination with customizable page size
- Filtering by author, title, tags, and state
- Search functionality
- Sorting by various fields (creation date, read count, reading time)

### Validation
- Request validation using Joi
- Comprehensive error handling
- Input sanitization

---

## Testing

Run the test suite:
```bash
npm test
```

The project includes comprehensive tests for:
- User authentication (signup, login)
- Blog post CRUD operations
- Authorization checks
- Input validation
- Error scenarios

Tests use Jest and Supertest with MongoDB Memory Server for isolated testing.

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/blog-api
JWT_SECRET=your-super-secret-jwt-key
```

---

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation
- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **nanoid** - ID generation

---

## API Status Codes

- **200** - OK
- **201** - Created
- **400** - Bad Request (validation errors, invalid credentials)
- **401** - Unauthorized (missing or invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **409** - Conflict (user already exists)
- **500** - Internal Server Error

---

## Contributors
- Mayowa Badewa