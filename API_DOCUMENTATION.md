# API Documentation

This document provides information about the API endpoints available in the Oslo Languages Website.

## Base URL

In development: `http://localhost:3000/api`
In production: `https://oslolanguages.no/api`

## Authentication

Admin API endpoints require authentication via NextAuth.js. Include the session cookie in your requests.

## API Endpoints

### Contact Form

**Endpoint:** `/api/contact`
**Method:** `POST`
**Description:** Submits a contact form and sends an email via SendGrid

**Request Body:**
```typescript
{
  name: string;      // Minimum 2 characters
  email: string;     // Valid email format
  subject: string;   // Minimum 3 characters
  message: string;   // Minimum 10 characters
}
```

**Success Response:**
```json
{
  "message": "Contact form submitted successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

---

### Blog Posts

#### Get All Blog Posts

**Endpoint:** `/api/blog`
**Method:** `GET`
**Description:** Retrieves all blog posts, with optional filtering

**Query Parameters:**
- `category` (optional): Filter by category
- `page` (optional): Page number for pagination
- `limit` (optional): Number of posts per page

**Success Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Blog Post Title",
      "slug": "blog-post-title",
      "excerpt": "Short excerpt...",
      "date": "2025-04-01",
      "author": "Author Name",
      "imageUrl": "/images/default-image.jpg",
      "category": "Category"
    },
    // More posts...
  ],
  "pagination": {
    "totalPosts": 20,
    "totalPages": 2,
    "currentPage": 1,
    "limit": 10
  }
}
```

#### Get Single Blog Post

**Endpoint:** `/api/blog/[id]`
**Method:** `GET`
**Description:** Retrieves a single blog post by ID

**Success Response:**
```json
{
  "id": 1,
  "title": "Blog Post Title",
  "slug": "blog-post-title",
  "content": "Full content...",
  "excerpt": "Short excerpt...",
  "date": "2025-04-01",
  "author": "Author Name",
  "imageUrl": "/images/default-image.jpg",
  "category": "Category",
  "tags": ["tag1", "tag2"]
}
```

**Error Response:**
- `404 Not Found`: Blog post not found

#### Create Blog Post (Admin Only)

**Endpoint:** `/api/blog`
**Method:** `POST`
**Description:** Creates a new blog post
**Authentication:** Required

**Request Body:**
```typescript
{
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;        // Auto-generated if not provided
  date?: string;        // Default: current date
  author: string;
  imageUrl?: string;
  category: string;
  tags?: string[];
}
```

**Success Response:**
```json
{
  "message": "Blog post saved successfully",
  "post": {
    "id": 1,
    "title": "Blog Post Title",
    "slug": "blog-post-title",
    // Other post data...
  }
}
```

#### Update Blog Post (Admin Only)

**Endpoint:** `/api/blog/[id]`
**Method:** `PUT`
**Description:** Updates an existing blog post
**Authentication:** Required

**Request Body:** Same as create post

**Success Response:**
```json
{
  "message": "Blog post updated successfully",
  "post": {
    "id": 1,
    "title": "Updated Blog Post Title",
    // Other updated data...
  }
}
```

#### Delete Blog Post (Admin Only)

**Endpoint:** `/api/blog/[id]`
**Method:** `DELETE`
**Description:** Deletes a blog post
**Authentication:** Required

**Success Response:**
```json
{
  "message": "Blog post deleted successfully"
}
```

---

### Authentication

#### Login

**Endpoint:** `/api/auth/signin`
**Method:** `POST`
**Description:** Authenticates a user and creates a session

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Success Response:** Redirects to dashboard or returns session information

#### Logout

**Endpoint:** `/api/auth/signout`
**Method:** `POST`
**Description:** Ends the user session

**Success Response:** Redirects to login page

---

### Debug (Development Only)

**Endpoint:** `/api/debug`
**Method:** `GET`
**Description:** Returns debug information about the current session and request

**Success Response:**
```json
{
  "pathname": "current path",
  "cookies": {
    "all": ["cookie names"],
    "nextAuthSession": true/false,
    "adminAuth": true/false
  },
  "headers": {
    "referer": "referer url",
    "userAgent": "user agent string"
  }
}
```

## Error Handling

All API endpoints return errors in a consistent format:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- `400 Bad Request`: Invalid request format
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server-side error

## Rate Limiting

API endpoints have rate limiting to prevent abuse:
- Contact form: 5 requests per hour per IP address
- Authentication: 10 attempts per hour per IP address

## API Versioning

The API does not currently use versioning, but future changes may implement a versioning scheme like `/api/v1/...`.