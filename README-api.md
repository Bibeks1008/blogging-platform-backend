# API Usage

Below are the details for using each API endpoint in the project, including the expected input, request format, and response.

## 1. User Registration

**Endpoint:** POST "/api/users/register"

**Description:** Register a new user.

**Request Body:**

```json
{
  "email": "exampleEmail",
  "password": "examplePassword"
}
```

**Response:**

```json
{
  "message": "User created successfully!"
}
```

## 2. User Login

**Endpoint:** POST "/api/users/login"

**Description:** Authenticate user and generate a token.

**Request Body:**

```json
{
  "email": "exampleEmail",
  "password": "examplePassword"
}
```

**Response:**

```json
{
  "access_token": "your-auth-token",
  "userId": "your-user-id"
}
```

## 3. Create a Blog Post

**Endpoint:** POST "/api/posts"

**Description:** Create a new blog post.

**Headers:**
Authorization: Bearer your-auth-token

**Request Body:**

```json
{
  "title": "Blog Title",
  "content": "This is the content of the blog post"
}
```

**Response:**

```json
{
  "message": "Blog post created successfully",
  "post": {
    "title": "Blog Title",
    "author": "Author Id"
  }
}
```

## 4. Get All Blog Posts

**Endpoint:** GET "/api/posts"

**Description:** Retrieve a list of all blog posts.

**Headers:**
Authorization: Bearer your-auth-token

**Response:**

```json
[
  {
    "id": "Blog Post Id",
    "createdAt": "Blog Created time",
    "updatedAt": "Blog updated time",
    "title": "Blog Tilte",
    "content": "Blog Content",
    "authorId": "Author Id"
  }
]
```

## 5. Get One Blog Posts By Id

**Endpoint:** GET "/api/posts/:id"

**Description:** Retrieve a single blog post.

**Headers:**
Authorization: Bearer your-auth-token

**Response:**

```json
{
  "id": "Blog Post Id",
  "createdAt": "Blog Created time",
  "updatedAt": "Blog updated time",
  "title": "Blog Tilte",
  "content": "Blog Content",
  "authorId": "Author Id"
}
```

## 6. Add a Comment

**Endpoint:** POST "/api/posts/:postId/comments"

**Description:** Add a comment to a specific blog post.

**Headers:**
Authorization: Bearer your-auth-token

**Request Body:**

```json
{
  "content": "This is a comment"
}
```

**Response:**

```json
{
  "message": "Comment added successfully",
  "comment": {
    "id": "Comment Id",
    "content": "This is a comment"
  }
}
```

## 7. View all Comments For a Specific Blog Post

**Endpoint:** GET "/api/posts/:postId/comments"

**Description:** Returns all the comments of a specific post.

**Headers:**
Authorization: Bearer your-auth-token

**Response:**

```json
[
  {
    "id": "Comment Id",
    "createdAt": "comment creation tome",
    "updatedAt": "comment updated time",
    "content": "This is a comment",
    "postId": "Post Id",
    "authorId": "Author Id"
  }
]
```

## 8. Upload an Image

**Endpoint:** POST "/api/posts/:postId/images"

**Description:** Upload an image associated with a blog post.

**Headers:**
Authorization: Bearer your-auth-token

**Request Body:**
Upload FormData with the key image (JPEG or PNG only).

**Response:**

```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "http://example.com/images/1.jpg"
}
```

## 9. View User Profile

**Endpoint:** GET "/api/users/profile"

**Description:** View the profile of the authenticated user.

**Headers:**
Authorization: Bearer your-auth-token

**Response:**

```json
{
  "id": "User Id",
  "createdAt": "User created at",
  "updatedAt": "User data updated at",
  "email": "User-Email-Example",
  "role": "User-Password"
}
```

## 10. Update User Profile

**Endpoint:** PATCH "/api/users/profile"

**Description:** Update user profile information.

**Headers:**
Authorization: Bearer your-auth-token

**Request Body:**

```json
{
  "email": "new-email@example.com"
}
```

**Response:**

```json
{
  "message": "Profile updated successfully"
}
```

## How to Use the API

Use a tool like Postman or cURL or Insomnia to send requests to the endpoints.

To run the e2e test for all the endpoints run "npm run db:test:restart" and then "npm run test:e2e"
