# 🎓 Learning Management System API

A robust backend API for a Learning Management System built with Node.js and Express.js. The system facilitates online education by managing courses, students, mentors, and their interactions.

## 📊 System Architecture

### 🔄 Use Case Diagram

![Use Case Diagram](./private/lms-use-cases-diagram-V02.svg)

### 🔄 ER Diagram for Database Schema

![ERD Diagram](./private/lms-class-V07.svg)

## 🌟 Key Features

### 👥 User Management

- Multi-role authentication system (Students, Mentors, Admins)
- JWT-based authentication with secure cookie handling
- Role-based access control (RBAC)
- Profile management for all user types

### 📚 Course Management

- Course creation and management by mentors
- Course content organization with modules and lessons
- Course status tracking (active, archived)

### 👨‍🎓 Student Features

- Course enrollment system
- Progress tracking for enrolled courses
- Course wishlist and cart functionality
- Course archiving capabilities
- Review and rating system

### 👨‍🏫 Mentor Features

- Course creation and management
- Course analytics
- YouTube playlist integration

### 💬 Communication

- Real-time chat functionality
- Course-specific chat rooms between students and mentors
- Comment threading for lessons

## 🛠️ Technical Stack

### 💻 Core Technologies

- **Node.js & Express.js**: Server framework and runtime

  - Route handling and middleware architecture
  - Request/response processing
  - Error handling middleware
  - Async operations management

- **MongoDB & Mongoose**: Database layer

  - Schema validation and modeling
  - Relationship management
  - Query optimization
  - Virtual fields and middleware

- **Socket.IO**: Real-time communication

### 🔒 Security Implementation

- **bcryptjs**: Password hashing
- **CORS**: Cross-origin security
- **Cookie-parser**: Secure cookie handling
- **Role-based middleware**: Access control
- **Request rate limiting**: DDoS protection

### 📂 Compression tools

- **compression**

## 🎥 YouTube Integration

The system features a robust YouTube playlist integration that allows mentors to:

- Extract complete playlists or specific video ranges
- Auto-generate course modules from playlists
- Import video metadata (duration, thumbnails, titles)
- Maintain playlist structure in course format

## 📚 API Documentation

### OpenAPI/Swagger Specification

- **YAML-Based Documentation**
  - Comprehensive endpoint documentation
  - Request/response schemas
  - Authentication specifications
  - API versioning

### Postman

- Collection-based API testing
- Environment management
