<div align="center">

# 🛒 MultiShop

### A Modern Multi-Vendor E-Commerce Platform

Scalable, Secure and Production-Ready Multi Vendor Marketplace built with Django REST Framework & Next.js.

![Python](https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python)
![Django](https://img.shields.io/badge/Django-5.x-darkgreen?style=for-the-badge&logo=django)
![DRF](https://img.shields.io/badge/Django_REST_Framework-red?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?style=for-the-badge&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-red?style=for-the-badge&logo=redis)
![Docker](https://img.shields.io/badge/Docker-blue?style=for-the-badge&logo=docker)

</div>

---

# 📌 About

MultiShop is a production-oriented **Multi Vendor E-Commerce Platform** designed with scalability, security and clean architecture in mind.

The project follows modern backend development practices using Django REST Framework while the frontend is being migrated to Next.js.

The architecture is built to be easily extensible and maintainable for real-world marketplace applications.

---

# ✨ Features

## 👤 Authentication

- JWT Authentication
- HttpOnly Cookie Authentication
- Refresh Token Rotation
- Login / Logout
- Register
- Email Verification
- Forgot Password
- Reset Password
- OTP Authentication

---

## 🛍 Marketplace

- Multi Vendor Support
- Product Categories
- Product Search
- Product Filtering
- Product Reviews
- Product Rating
- Wishlist
- Shopping Cart
- Checkout
- Orders
- Product Inventory Management

---

## 🏪 Seller Panel

- Product CRUD
- Category Management
- Inventory Control
- Order Management
- Dashboard

---

## 👨‍💼 Admin Panel

- User Management
- Vendor Management
- Product Moderation
- Order Monitoring
- Statistics

---

## ⚡ Performance

- Redis Cache
- Celery Background Tasks
- Celery Beat
- Pagination
- Optimized Database Queries

---

## 🔐 Security

- Django Axes Protection
- API Rate Limiting
- JWT Cookies
- Secure Authentication
- Permission Based Access
- CORS Protection
- CSRF Protection

---

## 📧 Email System

- Welcome Email
- Email Verification
- Password Reset
- OTP Code

---

# 🏗 Architecture

```
Client
     │
     ▼
 Next.js Frontend
     │
 REST API
     │
 Django REST Framework
     │
──────────────────────────────
Business Logic
──────────────────────────────
Models
Services
Permissions
Serializers
Signals
Tasks
──────────────────────────────
     │
 PostgreSQL
 Redis
 Elasticsearch
```

---

# 🛠 Tech Stack

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- Redis
- Celery
- Celery Beat
- Gunicorn
- Nginx

### Frontend

- Next.js
- React
- TypeScript
- Axios
- React Query

### DevOps

- Docker
- Docker Compose
- GitHub Actions

### Monitoring

- Sentry
- Elasticsearch
- Logstash
- Kibana
- Grafana

---

# 📂 Project Structure

```
backend/
│
├── accounts/
├── products/
├── carts/
├── comments/
├── orders/
├── notifications/
├── common/
├── core/
└── config/

frontend/
│
├── app/
├── components/
├── hooks/
├── services/
└── utils/
```

---

# 🚀 Future Improvements

- Payment Gateway
- Recommendation System
- AI Product Search
- Chat Between Buyer & Seller
- Notifications
- Microservices Migration

---

# 📸 Screenshots

Coming Soon...

---

# ⚙ Installation

```bash
git clone https://github.com/yourusername/MultiShop.git

cd MultiShop

docker compose up --build
```

---

# 📈 Roadmap

- [x] Authentication
- [x] Product Management
- [x] Shopping Cart
- [x] Orders
- [x] Seller Dashboard
- [x] Admin Dashboard
- [x] Redis Cache
- [x] Celery
- [x] Docker
- [x] Elasticsearch
- [ ] Kubernetes Deployment
- [ ] CI/CD Pipeline
- [ ] AI Recommendation

---

# 🤝 Contributing

Contributions are always welcome.

Feel free to fork the project and submit a Pull Request.

---

# 👨‍💻 Author

**Mahdi**

Backend Developer

Python • Django • DRF • Next.js • Docker

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.
