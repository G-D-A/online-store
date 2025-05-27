# Online Store API

## 1. Introduction

### 1.1 Purpose
The goal of this project is to build a backend system for an online store. The system will provide RESTful APIs for product catalog management, user authentication, and order processing.

---

### 1.2 Scope
The backend application will serve as the core engine for an e-commerce platform. It will support user interactions such as browsing products, placing orders, and managing user accounts. The system is designed to be scalable, testable, and secure.

---

### 1.3 Stack
- Node.js + Express.js — Backend runtime and framework
- TypeScript — Static typing and scalable architecture
- MongoDB + Mongoose — NoSQL database with ODM
- JWT — Authentication (via tokens)
- Yup — Input validation
- tsyringe — Dependency Injection
- Jest + Supertest — Testing framework
- Winston — Logging (structured)


## 2. System Overview

The application is based on a layered architecture:
- **API Layer (Express.js)**: Handles HTTP requests and responses.
- **Core Layer**: Contains business logic and application services.
- **Data Layer**: Manages data persistence with MongoDB via Mongoose.
- **Infrastructure Layer**:  Handles configuration, logging, database connection, and middleware setup.
- **Testing Layer**: Supports automated testing with Jest and Supertest.

---

## 3. Architecture

### 3.1 Layered Structure
The application is divided into the following layers:

#### 3.1.1 Core Layer (Presentation Layer)
- Entry point: `src/app.ts`
- Manages routes for products, users, and orders.
- Applies middleware for authentication, validation, and error handling.

#### 3.1.2 Core (Business Logic Layer)
- Services: `UserService`, `ProductService`, `OrderService`, `CartService`
- Implements main application logic, such as creating orders and checking stock.

#### 3.1.3 Data Layer
- Models: `UserModel`, `ProductModel`, `OrderModel`, `CartModel`
- Uses Mongoose for schema definitions and database operations.

#### 3.1.4 Infra (Infrastructure Layer)
- Manages MongoDB connection (singleton pattern).
- Handles global middleware, JWT authentication, and logging.

#### 3.1.5 Testing Layer
- Unit and integration tests located in /tests/ 
- Jest framework is used for test execution.

---

## 3.2 Project Folder Structure
```
    src/
    ├── controllers/     # Express route handlers (UserController, ProductController)
    ├── services/        # Business logic (UserService, OrderService)
    ├── models/          # Mongoose models and schemas
    ├── routes/          # API route definitions and registration
    ├── middleware/      # Custom middleware: Auth, ErrorHandler
    ├── infra/           # Infrastructure: DB connection, logger, configs
    ├── validations/     # Yup validation schemas for input validation
    └── app.ts           # Main application entry point
    tests/               # Unit and integration tests
    
```

---

## 3.3 Business Logic Services
### 3.3.1 Services:
- UserService: handles user registration and profile retrieval. 
- ProductService: manages product listing and access by ID.
- OrderService: manages order creation and user order history.
- CartService: handles adding/removing items and converting cart to order (checkout)



---

## 4. Setup and Tooling

### 4.1 Technologies Used
- Node.js 20+ & Express.js — Server and routing
- TypeScript — Type-safe development
- MongoDB + Mongoose — Database and ODM
  - Run locally at mongodb://localhost:27017/online-store
- ESLint + Prettier — Code quality and formatting
- Jest + Supertest — Testing framework

---

### 4.1 How to run
```bash
npm install
npm run dev
```
or

```bash
npm run build
npm run start
```
---

#### 4.2 Linting & Formatting
```
npm run lint
```

#### 4.3 Testing
- Run all unit and integration tests
```
npm test
```
- Generate test coverage report
```
npm run test:coverage
```

---

## 5. API Reference

```
| Method | Endpoint                     | Auth | Description                 |
|--------|------------------------------|------|-----------------------------|
| POST   | /api/users/register          | ❌   | Register new user           |
| POST   | /api/users/login             | ❌   | Login and receive JWT       |
| GET    | /api/users/profile           | ✅   | Get current user profile    |

| GET    | /api/products                | ✅   | List all products           |
| GET    | /api/products/:id            | ✅   | Get product details         |
| POST   | /api/products                | ✅   | Create a new product        |
| POST   | /api/products/:id            | ✅   | Update an existing product  |
| DELETE | /api/products/:id            | ✅   | Delete a product            |

| POST   | /api/orders                  | ✅   | Create new order            |
| GET    | /api/orders/user/:userId     | ✅   | List orders by user ID      |

| GET    | /api/cart                    | ✅   | Get current user’s cart     |
| POST   | /api/cart/add                | ✅   | Add product to cart         |
| DELETE | /api/cart/:productId         | ✅   | Remove product from cart    |
| POST   | /api/cart/checkout           | ✅   | Checkout cart as an order   |
```

---

## 6. Testing Strategy
- Jest 
- Supertest: used for integration tests of routes (API)

---

## 7. Logging

The application uses the `winston` library for runtime logging.Logger used throughout services, middleware, and error handling.
Logs are formatted in a human-readable structured format including:
- Timestamp
- Severity level (`info`, `warn`, `error`, `fatal`)
- Context message
- Stack trace (if available)

### Output Destinations
- Console: all logs
- File: critical logs saved to `logs/error.log`

This structured logging approach improves observability and helps diagnose issues in production. Log messages are consistent and can be parsed programmatically if needed.

---

## 7.1 Error Handling
All unhandled errors are routed through a centralized middleware that logs the error and returns a 500 or 422 (for validation) with a standard structure.

---

## 8. Features Implemented
- User Registration / Login (with validation & token return)
- JWT-authenticated routes
- Product catalog: create / read / update / delete
- Shopping Cart: add, remove, checkout to order
- Order history: list orders by user
- Validation: Yup for all critical inputs
- Logging: structured JSON logs (info, error)
- Error handling: centralized errorMiddleware

---

## 9. Repository and Documentation

- **Code Repository**: [GitHub Link](#)
- **Design Document**: This document will be updated alongside the project.

---

### 9.1 MongoDB Models

The following Mongoose models are defined:

- **UserModel**: stores users with `email` and `password`
- **ProductModel**: represents items in the catalog with fields such as `name`, `price`, `stock`
- **OrderModel**: tracks user orders and links to `User` and `Product` via references
- **CartModel**: stores items added to user's shopping cart with `productId`, `quantity`, and `userId`

All models are timestamped and designed to support expansion.

---

## 10. Conclusion
This backend is designed to be modular, scalable, and maintainable. With a clear architecture and testing strategy in place, the system is ready for iterative development to support a modern e-commerce platform.
