# An Express Server Template

# Quora Mock-Up Backend API

A RESTful API backend service built with Express.js and PostgreSQL, designed to simulate Quora's question and answer functionality. This project provides endpoints for managing questions and answers with full CRUD operations.

## 📋 Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Description

This project is a backend skill checkpoint that demonstrates proficiency in building RESTful APIs with Node.js, Express.js, and PostgreSQL. The API simulates a Q&A platform similar to Quora, allowing users to create, read, update, and delete questions and answers.

### What problem does it solve?
- Provides a structured way to manage questions and answers
- Demonstrates proper API design patterns
- Shows database integration with PostgreSQL
- Implements proper error handling and validation

### What makes this project stand out?
- Clean and organized code structure
- Comprehensive error handling
- Input validation and sanitization
- RESTful API design principles
- Database connection pooling for performance

## Features

- ✅ **Question Management**: Create, read, update, and delete questions
- ✅ **Answer Management**: Add and delete answers for specific questions
- ✅ **Search Functionality**: Search questions by title and category
- ✅ **Input Validation**: Comprehensive validation for all endpoints
- ✅ **Error Handling**: Detailed error messages and proper HTTP status codes
- ✅ **Database Integration**: PostgreSQL with connection pooling
- ✅ **RESTful Design**: Follows REST API best practices

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js
- **nodemon** - Development server with auto-restart

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (version 12 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend-skill-checkpoint-express-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database** (see Database Setup section below)

4. **Start the development server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:4000`

## Database Setup

1. **Create a PostgreSQL database**
   ```sql
   CREATE DATABASE Quora_MockUp;
   ```

2. **Create the required tables**
   ```sql
   -- Questions table
   CREATE TABLE questions (
       id SERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       description TEXT NOT NULL,
       category VARCHAR(100) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Answers table
   CREATE TABLE answers (
       id SERIAL PRIMARY KEY,
       question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
       content TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Update database connection** (if needed)
   - Modify the connection string in `utils/db.mjs` to match your PostgreSQL credentials

## API Endpoints

### Questions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/questions` | Get all questions |
| GET | `/questions/:questionId` | Get a specific question |
| GET | `/questions/search` | Search questions by title and category |
| POST | `/questions` | Create a new question |
| PUT | `/questions/:questionId` | Update a question |
| DELETE | `/questions/:questionId` | Delete a question |

### Answers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/questions/:questionId/answers` | Get answers for a question |
| POST | `/questions/:questionId/answers` | Add an answer to a question |
| DELETE | `/questions/:questionId/answers` | Delete all answers for a question |

### Test

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/test` | Test server connectivity |

## Usage Examples

### Create a Question
```bash
curl -X POST http://localhost:4000/questions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "What is Node.js?",
    "description": "I want to understand what Node.js is and how it works.",
    "category": "Programming"
  }'
```

### Get All Questions
```bash
curl http://localhost:4000/questions
```

### Search Questions
```bash
curl "http://localhost:4000/questions/search?title=Node.js&category=Programming"
```

### Add an Answer
```bash
curl -X POST http://localhost:4000/questions/1/answers \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Node.js is a JavaScript runtime built on Chrome V8 JavaScript engine."
  }'
```

### Update a Question
```bash
curl -X PUT http://localhost:4000/questions/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "What is Node.js and how does it work?",
    "description": "I want to understand Node.js architecture and its event-driven nature.",
    "category": "Backend Development"
  }'
```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data or missing required fields
- **404 Not Found**: Question or resource not found
- **500 Internal Server Error**: Database or server errors

Example error response:
```json
{
  "message": "Invalid request data.",
  "error": "Detailed error message"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

**Note**: This is a skill checkpoint project demonstrating backend development skills with Express.js and PostgreSQL. The database connection string should be updated for production use with proper environment variables.