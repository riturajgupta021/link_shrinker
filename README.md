# Link Shrinker 

Link Shrinker is a web application that allows users to generate short URLs for long URLs. It also keeps track of previously generated URLs, which users can view on the "Previous URLs" page. The application provides a seamless user experience by maintaining login sessions for 7 days.

## Features

- **Generate Short URLs**: Convert long URLs into shorter, shareable links.
- **View Previously Generated URLs**: Navigate to the "Previous URLs" page to see all previously created short URLs.
- **Session Management**: Once logged in, you remain logged in for 7 days without needing to log in again.
- **Caching for Improved Performance**: Reduces database requests by storing mappings of short URLs to long URLs in Redis.
- **Counter Management with Caching**: Retrieves the counter value from cache and updates it each time a new URL is generated.
- **Edge Case Handling for Counter Value**: If the counter value is missing in the cache, it is recalculated from the latest generated code.
- **Scheduled Cleanup**: A cron job removes all long URLs from Redis at 12 AM daily to maintain optimal performance.

---

## Deployment

The Link Shrinker application is deployed and accessible at the following URLs:

- **Frontend**: [https://linkshrinker.netlify.app](https://linkshrinker.netlify.app)
- **Backend API**: [https://link-shrinker-gc27.onrender.com](https://link-shrinker-gc27.onrender.com)

---

## API Endpoints

### User Routes (`/user`)

#### 1. `POST /signup`
**Description**: Register a new user.

**Request Body**:
```json
{
  "email":"string",
  "name": "string",
  "password": "string"
}
```

**Response**:
- **201 Created**: User registered successfully.
- **400 Bad Request**: Validation or registration error.

#### 2. `POST /login`
**Description**: Log in an existing user.

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:
- **200 OK**: Login successful with a token.
- **401 Unauthorized**: Invalid credentials.

---

### URL Routes

#### 1. `POST /generate`
**Description**: Generate a short URL for a given long URL.

**Middleware**: `checkForToken` (validates user authentication).

**Request Body**:
```json
{
  "title":"string"
  "longUrl": "string"
}
```

**Response**:
- **201 Created**: Short URL generated successfully.
- **401 Unauthorized**: Token is invalid or expired.
- **400 Bad Request**: Validation or generation error.

#### 2. `GET /geturls`
**Description**: Fetch all previously generated short URLs.

**Middleware**: `checkForToken` (validates user authentication).

**Response**:
- **200 OK**: Array of previously generated URLs.
- **401 Unauthorized**: Token is invalid or expired.

#### 3. `GET /:code`
**Description**: Redirect to the original long URL using the short URL code.

**Parameters**:
- `:code` - Short URL code.

**Response**:
- **302 Temporarily Moved**: Redirects to the long URL.
- **404 Not Found**: Short URL code does not exist.

---

## Middleware

### `checkForToken`
- Validates the presence and validity of the authentication token.
- Ensures secure access to protected routes.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/keshavsingh4093/link-shrinker.git
   ```

2. Navigate to the project directory:
   ```bash
   cd link-shrinker
   ```
   
3. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the application:
   ```bash
   npm run dev
   ```

---

## Technologies Used

- **Frontend**: HTML, tailwind css, javascript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Hashing**: Argon2
- **Authentication**: JWT (JSON Web Token)

---

## Future Enhancements

- Add support for custom short URL codes.
- Implement analytics for URL visits.
- Add social sharing capabilities for short URLs.

---

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any changes or enhancements you would like to see.
