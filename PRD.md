# PRD (Project Requirements Document)

## Sweet Shop Management System Backend

---

## 1. Product Overview

**Product Name:** Sweet Shop Management System Backend
**Version:** 1.0.0
**Product Type:** Backend API for Sweet Shop Management System

The Sweet Shop Management System backend is a RESTful API designed to manage sweets inventory, user authentication, and purchase operations for a digital sweet shop. The system supports role-based access control, allowing administrators to manage inventory while users can browse and purchase sweets securely.

---

## 2. Target Users

* **Admin:** Manage sweets inventory, pricing, stock levels, and system operations
* **Customers (Users):** Browse sweets, search/filter items, and purchase sweets

---

## 3. Core Features

---

### 3.1 User Authentication & Authorization

* **User Registration:** Create user accounts using email and password
* **User Login:** Secure authentication using JWT tokens
* **Token Management:** Access token generation and validation
* **Role-Based Access Control:** Two-tier permission system (Admin, User)
* **Protected Routes:** Restrict sensitive operations to authenticated users

---

### 3.2 Sweet Management

* **Sweet Creation:** Add new sweets with name, category, price, and quantity (Admin only)
* **Sweet Listing:** View all available sweets
* **Sweet Details:** Access individual sweet information
* **Sweet Updates:** Modify sweet details such as price, category, or quantity (Admin only)
* **Sweet Deletion:** Remove sweets from inventory (Admin only)

---

### 3.3 Inventory Management

* **Purchase Sweet:** Allow users to purchase sweets, reducing stock quantity
* **Stock Validation:** Prevent purchases when stock quantity is zero
* **Restock Sweet:** Increase sweet quantity in inventory (Admin only)
* **Inventory Consistency:** Ensure quantity never drops below zero

---

### 3.4 Search & Filtering

* **Search by Name:** Find sweets by name
* **Search by Category:** Filter sweets by category
* **Price Range Filtering:** Search sweets within a specific price range

---

### 3.5 System Health

* **Health Check:** API endpoint to monitor system availability and status

---

## 4. Technical Specification

---

### 4.1 API Endpoints Structure

---

### Authentication Routes (`/api/v1/auth/`)

* **POST /register** – User registration
* **POST /login** – User authentication
* **GET /current-user** – Get logged-in user details (secured)

---

### Sweet Routes (`/api/v1/sweets/`)

* **GET /** – List all available sweets (secured)
* **POST /** – Add a new sweet (Admin only)
* **GET /search** – Search sweets by name, category, or price range (secured)
* **PUT /:sweetId** – Update sweet details (Admin only)
* **DELETE /:sweetId** – Delete a sweet from inventory (Admin only)

---

### Inventory Routes (`/api/v1/sweets/:sweetId/`)

* **POST /purchase** – Purchase a sweet and decrease quantity (secured)
* **POST /restock** – Restock sweet quantity (Admin only)

---

## 5. Non-Functional Requirements

* **Security:** JWT-based authentication and role validation
* **Performance:** API response time under 500ms
* **Reliability:** Accurate inventory updates and error handling
* **Scalability:** Modular architecture for future enhancements

---

## 6. Testing Requirements

* **Testing Approach:** Test-Driven Development (TDD)
* **Test Types:**

  * Unit tests for business logic
  * Integration tests for API endpoints
* **Coverage Goal:** Minimum 80% backend test coverage

---

## 7. AI Usage & Compliance

* AI tools may be used for boilerplate generation, testing, and refactoring
* All AI usage must be transparently documented
* AI co-authorship must be included in Git commits where applicable
* README must contain a detailed **My AI Usage** section

---

## 8. Deliverables

* Public Git repository
* Backend source code with tests
* API documentation
* Test execution report
* README with setup instructions and AI usage disclosure
* (Optional) Deployed backend service

---

## 9. Success Criteria

* All APIs function as defined
* Role-based access enforced correctly
* Inventory operations work without inconsistencies
* Test suite passes successfully
* Clean and well-documented codebase

---

## 10. Future Enhancements

* Order history tracking
* Payment gateway integration
* Admin analytics dashboard
* Notification system for low stock

