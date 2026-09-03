# 🛒 MultiShop

### Production-Oriented Multi-Vendor E-Commerce Platform

MultiShop is a full-stack, production-oriented multi-vendor e-commerce platform built with Django REST Framework, Next.js, React, PostgreSQL, Redis, Elasticsearch, Docker, and Nginx.

The project is designed with a strong focus on real-world software engineering practices including security, scalability, performance optimization, asynchronous processing, distributed locking, centralized logging, automated workflows, testing, load testing, caching, search, and backup strategies.

---

## ✨ Features

- 🔐 JWT Authentication

- 🍪 HttpOnly Cookie Authentication

- 🔄 Refresh Token Rotation

- 👥 Role-Based Access Control

- 🛍 Multi-Vendor E-Commerce

- 👤 Customer Panel

- 🏪 Vendor Panel

- 👨‍💼 Admin Panel

- 📦 Product Management

- 🛒 Shopping Cart

- 💳 Checkout & Orders

- 🎫 Customer Support Tickets

- 🔎 Elasticsearch Search

- 🎯 Advanced Filtering

- 📄 Standardized API Pagination

- ⚡ Redis Caching

- 🔒 Distributed Locks

- 🧵 Celery Background Tasks

- ⏰ Celery Beat Scheduled Tasks

- 📧 SMTP Email System

- 📬 SMTP4Dev for Email Testing

- 🔄 n8n Workflow Automation

- 📝 Audit Logging

- 📊 ELK Stack

- 🧪 Pytest

- 🚀 Load Testing

- 💾 Database Backup Strategy

- 🐳 Docker & Docker Compose

- 🌐 Nginx Reverse Proxy

- ⚛️ React

- ▲ Next.js

- 🧱 RESTful API Architecture

---

# 🏗️ System Architecture

```text

                           ┌─────────────────────┐

                           │       Client        │

                           └──────────┬──────────┘

                                      │

                                      ▼

                           ┌─────────────────────┐

                           │   Next.js / React   │

                           │      Frontend       │

                           └──────────┬──────────┘

                                      │

                                  HTTP / REST

                                      │

                                      ▼

                           ┌─────────────────────┐

                           │       Nginx         │

                           │   Reverse Proxy     │

                           └──────────┬──────────┘

                                      │

                                      ▼

                           ┌─────────────────────┐

                           │ Django REST         │

                           │ Framework           │

                           └──────────┬──────────┘

                                      │

              ┌───────────────────────┼───────────────────────┐

              │                       │                       │

              ▼                       ▼                       ▼

       ┌─────────────┐        ┌─────────────┐        ┌──────────────┐

       │ PostgreSQL  │        │    Redis    │        │ Elasticsearch│

       │  Database   │        │ Cache / Lock│        │    Search    │

       └─────────────┘        └──────┬──────┘        └──────────────┘

                                     │

                                     ▼

                              ┌─────────────┐

                              │   Celery    │

                              │   Workers   │

                              └──────┬──────┘

                                     │

                                     ▼

                              ┌─────────────┐

                              │    n8n      │

                              │ Automation  │

                              └─────────────┘



                         Logging & Observability

                                  │

                                  ▼

                     ┌───────────────────────────┐

                     │         ELK Stack         │

                     │                           │

                     │ Elasticsearch             │

                     │ Logstash                  │

                     │ Kibana                    │

                     └───────────────────────────┘









🚀 Core Features

🔐 Authentication & Authorization

MultiShop implements a secure authentication and authorization architecture using JWT.

Authentication

User Registration

Login

Logout

JWT Access Token

JWT Refresh Token

Refresh Token Rotation

HttpOnly Cookies

OTP Authentication

Email Verification

Password Reset

Forgot Password

Authorization

The application uses role-based access control for different types of users:

Customer

Vendor

Administrator

Protected endpoints use dedicated permission classes to ensure users can only access resources they are authorized to access.









👥 Role-Based Access Control

MultiShop separates application responsibilities based on user roles.

                    User

                     │

          ┌──────────┼──────────┐

          │          │          │

          ▼          ▼          ▼

      Customer     Vendor     Admin

          │          │          │

          ▼          ▼          ▼

     Customer     Vendor      Admin

       Panel       Panel       Panel



🛍️ Multi-Vendor E-Commerce

MultiShop is designed as a multi-vendor marketplace rather than a single-store e-commerce application.

Each vendor can manage their own store and resources while customers can browse products from different stores.

Marketplace Features

Multiple Stores

Vendor Management

Product Management

Product Categories

Product Images

Inventory

Pricing

Sale Pricing

Discounts

Orders

Reviews

Ratings

Support Tickets







📦 Product Management

The platform provides complete product management functionality.

Product Features

Create Products

Update Products

Delete Products

Product Categories

Product Images

Product Pricing

Sale Prices

Inventory Management

Product Discounts

Product Filtering

Product Search

Product Reviews

Product Ratings



👤 Customer Panel

Customers have access to a dedicated customer panel.

Customer Features

Profile Management

Product Browsing

Product Search

Product Filtering

Shopping Cart

Wishlist

Checkout

Orders

Order Details

Order Items

Product Reviews

Product Ratings

Support Tickets

Account Management



🏪 Vendor Panel

Vendors have a dedicated dashboard for managing their stores.

Vendor Features

Store Management

Product Management

Product Categories

Product Images

Inventory Management

Discount Management

Order Management

Order Items

Support Tickets

Store Administrators

Store Operators

Dashboard

👨‍💼 Admin Panel

The administrator panel provides centralized control over the marketplace.

Admin Features

User Management

Vendor Management

Store Management

Product Management

Category Management

Order Management

Product Moderation

Platform Management

Administrative Operations

System Monitoring



🔎 Elasticsearch Search

MultiShop uses Elasticsearch to provide fast and scalable product search.

Instead of relying entirely on PostgreSQL for search operations, product search can be handled through Elasticsearch.

Search Flow

User

 │

 ▼

Next.js

 │

 ▼

Django REST API

 │

 ▼

Elasticsearch

 │

 ▼

Search Results

 │

 ▼

Next.js

Elasticsearch can be used for:

Product Search

Full-Text Search

Search Queries

Search Filtering

Scalable Search Operations





Elasticsearch can be used for:

Product Search

Full-Text Search

Search Queries

Search Filtering

Scalable Search Operation





📄 Standardized Pagination

All major list APIs use a standardized pagination structure.

Example response:

{

  "links": {

    "next": "...",

    "previous": null

  },

  "count": 100,

  "results": []

}

This provides a consistent API contract between Django REST Framework and the Next.js frontend.

Pagination parameters:

?page=1&page_size=8





⚡ Redis

Redis is used as an infrastructure component for multiple purposes.

Redis Usage

Application Cache

Query/Data Caching

Temporary Data

Distributed Locks

Background Task Infrastructure

Redis helps reduce unnecessary database operations and improves application performance.





🔒 Distributed Locks

MultiShop uses distributed locking to prevent race conditions in critical operations.

This is especially useful when multiple requests attempt to modify shared resources concurrently.

Example:

Request A ───────────────┐

                         │

                         ▼

                    Redis Lock

                         │

                         ▼

                 Critical Operation

                         │

                         ▼

                   Release Lock

                         │

Request B ───────────────┘









Distributed locks can be used to protect operations such as:

Inventory Updates

Concurrent Requests

Checkout Operations

Shared Resource Updates

🧵 Celery

Celery is used for asynchronous background processing.

Long-running or non-blocking operations can be moved away from the main request-response cycle.

Celery Responsibilities

Background Tasks

Email Processing

Asynchronous Jobs

Long-Running Operations

Scheduled Operations

⏰ Celery Beat

Celery Beat is used for scheduled and periodic tasks.

Examples include:

Scheduled Maintenance

Periodic Jobs

Automated Tasks

Scheduled Email Operations

Backup-Related Tasks

📧 Email System

MultiShop includes an email infrastructure for transactional communication.

Supported email flows include:

Account Verification

OTP

Password Reset

Welcome Emails

Transactional Emails

Email operations can be processed asynchronously through Celery.

📬 SMTP4Dev

SMTP4Dev is used during development and testing to inspect outgoing emails locally.

Instead of sending real emails during development:

Django

   │

   ▼

Celery

   │

   ▼

SMTP

   │

   ▼

SMTP4Dev

   │

   ▼

Developer

This makes email-related development and debugging safer and easier.

🔄 n8n Workflow Automation

MultiShop integrates with n8n to support workflow automation.

n8n can be used to connect application events with external services and automated workflows.

Example:

Django

   │

   ▼

Application Event

   │

   ▼

n8n

   │

   ├── Email

   ├── Notification

   ├── External API

   ├── Data Processing

   └── Automation

This allows automation logic to remain decoupled from the core application.

📝 Audit Logging

MultiShop includes audit logging for tracking important system activities.

Audit logs provide traceability for important actions.

They can be used to track:

Administrative Actions

User Actions

Resource Changes

Important System Events

Security-Relevant Activities

Audit logging makes debugging, monitoring, and investigation easier.

📊 ELK Stack

MultiShop uses the ELK Stack for centralized logging and log analysis.

ELK Components

Elasticsearch

Logstash

Kibana

Logging Pipeline

Application

     │

     ▼

   Logstash

     │

     ▼

Elasticsearch

     │

     ▼

   Kibana

Benefits

Centralized Logs

Log Searching

Log Filtering

Error Investigation

Application Monitoring

Operational Visibility

🧪 Testing

Testing is an important part of the project.

The backend uses Pytest for automated testing.

Testing Includes

Unit Tests

API Tests

Integration Tests

Business Logic Tests

Django Tests

Run the test suite:

pytest

Run tests with verbose output:

pytest -v

Run a specific test:

pytest path/to/test_file.py

🚀 Load Testing

MultiShop includes load testing to evaluate the system under concurrent traffic.

Load testing helps identify:

API Bottlenecks

Database Bottlenecks

Response Time

Concurrent Request Behavior

Application Stability

Performance Limitations

The goal is to understand how the application behaves under realistic traffic rather than relying only on functional testing.

💾 Backup Strategy

The project includes a database backup strategy to protect application data and provide recovery capabilities.

Backup Flow

PostgreSQL

    │

    ▼

Backup Process

    │

    ▼

Backup Storage

    │

    ▼

Recovery

The backup strategy is designed to support scheduled and repeatable database backups.

🐳 Docker

MultiShop is containerized using Docker.

Docker provides isolated environments for application services and simplifies development and deployment.

Typical services include:

┌──────────────────────┐

│        Nginx         │

├──────────────────────┤

│     Django API       │

├──────────────────────┤

│     Next.js App      │

├──────────────────────┤

│     PostgreSQL       │

├──────────────────────┤

│       Redis          │

├──────────────────────┤

│   Elasticsearch      │

├──────────────────────┤

│       Celery         │

├──────────────────────┤

│        n8n            │

├──────────────────────┤

│       ELK Stack      │

└──────────────────────┘

🌐 Nginx

Nginx is used as a reverse proxy and part of the production infrastructure.

Responsibilities include:

Reverse Proxy

Request Routing

Frontend / Backend Routing

Static File Serving

HTTP Infrastructure

🖥️ Frontend

The frontend architecture is based on React and Next.js.

Frontend Stack

Next.js

React

TypeScript

Axios

TanStack Query

HTML

CSS

The frontend follows a component-based architecture.

It also separates:

API Services

Custom Hooks

Query Keys

Types

Reusable Components

Loading States

Error States

Empty States

Pagination

🧠 TanStack Query

TanStack Query is used to manage server state on the frontend.

The frontend architecture uses:

Query Keys

Custom Query Hooks

API Service Layer

Query Caching

Query Invalidation

Loading States

Error States

Pagination

Example architecture:

React Component

       │

       ▼

 Custom Hook

       │

       ▼

 TanStack Query

       │

       ▼

 API Service

       │

       ▼

 Django REST API

This keeps API communication separate from UI components.

🧱 API Architecture

The backend is built using Django REST Framework and follows a RESTful API architecture.

The application separates responsibilities between different layers:

API

 │

 ├── Views

 ├── Serializers

 ├── Services

 ├── Permissions

 ├── Models

 ├── Tasks

 ├── Signals

 └── Utilities

This approach helps maintain separation of concerns and keeps business logic manageable.

🛡️ Security

Security is an important part of the MultiShop architecture.

Implemented security mechanisms include:

JWT Authentication

HttpOnly Cookies

Refresh Token Rotation

Role-Based Permissions

Django Axes

API Throttling

CSRF Protection

CORS Configuration

Secure Authentication Flows

Distributed Locks

Audit Logging

🗄️ Database

PostgreSQL is used as the primary relational database.

The database stores core marketplace data including:

Users

Stores

Products

Categories

Orders

Order Items

Discounts

Comments

Tickets

Other application resources

Redis and Elasticsearch complement PostgreSQL for caching, distributed locking, and search workloads.

🔧 Technology Stack

Backend

Technology  Purpose

Python  Programming Language

Django  Web Framework

Django REST Framework   REST API

PostgreSQL  Primary Database

Redis   Cache / Distributed Lock

Celery  Background Processing

Celery Beat Scheduled Tasks

Elasticsearch   Search Engine

Gunicorn    Application Server

Frontend

Technology  Purpose

Next.js Frontend Framework

React   UI Library

TypeScript  Type Safety

Axios   HTTP Client

TanStack Query  Server State Management

HTML    Markup

CSS Styling

Infrastructure

Technology  Purpose

Docker  Containerization

Docker Compose  Container Orchestration

Nginx   Reverse Proxy

n8n Workflow Automation

SMTP4Dev    Email Testing

Testing & Observability

Technology  Purpose

Pytest  Automated Testing

ELK Stack   Centralized Logging

Elasticsearch   Log Storage & Search

Logstash    Log Processing

Kibana  Log Visualization

Load Testing    Performance Testing

Audit Logging   Activity Tracking

📂 Project Structure

MultiShop/

│

├── backend/

│   ├── accounts/

│   ├── products/

│   ├── carts/

│   ├── orders/

│   ├── comments/

│   ├── notifications/

│   ├── common/

│   └── core/

│

├── frontend/

│   ├── app/

│   ├── components/

│   ├── hooks/

│   ├── services/

│   ├── types/

│   └── utils/

│

├── docker/

│

├── backup/

│   └── scripts/

│

├── docker-compose.yml

├── docker-compose-stage.yml

└── README.md

⚙️ Installation

Clone the Repository

git clone https://github.com/mahdi-nabikhan/MultiShop.git

cd MultiShop

Start the Application

docker compose up --build

Run in Detached Mode

docker compose up -d --build

🔧 Environment Variables

Create the required environment variables for your environment.

Example:

SECRET_KEY=

DEBUG=

DATABASE_URL=

POSTGRES_DB=

POSTGRES_USER=

POSTGRES_PASSWORD=

REDIS_URL=

ELASTICSEARCH_URL=

JWT_SECRET_KEY=

EMAIL_HOST=

EMAIL_PORT=

EMAIL_HOST_USER=

EMAIL_HOST_PASSWORD=

Never commit real credentials, secret keys, tokens, or production environment variables to the repository.

🧪 Running Tests

Run all tests:

pytest

Run tests with verbose output:

pytest -v

Run a specific test:

pytest path/to/test_file.py

📈 Engineering Principles

MultiShop is designed beyond a basic CRUD application.

The main engineering goals are:

Clean Architecture

Separation of Concerns

Secure Authentication

Role-Based Authorization

Scalable REST APIs

Efficient Database Access

Caching

Distributed Systems Concepts

Concurrency Control

Asynchronous Processing

Centralized Logging

Observability

Automated Workflows

Automated Testing

Load Testing

Data Backup

Production-Oriented Infrastructure

🗺️ Roadmap

 Django REST API

 JWT Authentication

 Role-Based Authorization

 Customer Panel

 Vendor Panel

 Admin Panel

 Multi-Vendor Architecture

 Product Management

 Order Management

 Shopping Cart

 Product Filtering

 Elasticsearch Search

 Redis Cache

 Distributed Locks

 Celery

 Celery Beat

 Email System

 SMTP4Dev

 Docker

 Nginx

 n8n Integration

 Audit Logging

 ELK Stack

 Pytest

 Load Testing

 Backup Strategy

 Standardized Pagination

 Next.js Frontend

 React Frontend

 TanStack Query

📸 Screenshots

Screenshots and architecture diagrams can be added here.

🤝 Contributing

Contributions, issues, and feature requests are welcome.

To contribute:

git checkout -b feature/your-feature

Make your changes, add appropriate tests, and submit a Pull Request.

👨‍💻 Author

Mahdi Nabikhan

Backend Developer

Python • Django • DRF • React • Next.js • PostgreSQL • Redis • Docker

⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐.

📄 License

This project is intended for educational and portfolio purposes.