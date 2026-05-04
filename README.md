# MultiShop — Multi Shop E-commerce Platform

![MultiShop Banner](https://via.placeholder.com/1000x400?text=MultiShop+-+Multi+Vendor+Platform)

A complete **multi-vendor e-commerce platform** where multiple shops can register and manage their own products, inventory, and customers — all under one umbrella.

## 🏗 Architecture Overview

This project uses a hybrid approach:
- **Backend:** Django + Django REST Framework (DRF)
- **Frontend (current):** Django Templates + Vanilla JavaScript (Fetch API)
- **Frontend (future):** React.js (gradual migration planned)
- **Task Queue:** Celery + Redis
- **Search Engine:** Elasticsearch
- **Email Orchestration:** n8n (workflow automation)
- **Containerization:** Docker + Docker Compose

## ✨ Key Features

### Core Platform
- 🏪 **Multi-vendor Support** — Each shop has its own admin panel
- 👥 **JWT Authentication** — Secure login for shop owners and admins
- 📦 **Product Management** — Each shop can add/edit/delete their own products
- 🔍 **Advanced Filtering** — Filter products by category, price, shop, etc.
- 📊 **Shop-specific Dashboards** — Separate admin panel per shop

### Technical Features
- 🐍 **Django AXE** — Enhanced security and vulnerability scanning
- 🔐 **JWT Auth** — Token-based authentication
- 📧 **Email Templates** — Beautiful email templates (HTML/CSS)
- ⚡ **Celery** — Async email sending (non-blocking)
- 🔌 **n8n Integration** — Email workflows and automation
- 🎯 **Elasticsearch** — Fast, powerful product search
- 🔄 **API Versioning** — Future-proof APIs (`/api/v1/`, `/api/v2/`)
- 💾 **Session Management** — User sessions for hybrid rendering
- 🐳 **Docker Ready** — Full containerization

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| Backend | Django, Django REST Framework, Django AXE |
| Frontend (current) | Django Templates, JavaScript (Fetch API), HTML5, CSS3 |
| Frontend (future) | React.js |
| Database | PostgreSQL / SQLite (configured) |
| Search | Elasticsearch |
| Task Queue | Celery, Redis |
| Email Automation | n8n |
| Auth | JWT (JSON Web Tokens) + Sessions |
| Containerization | Docker, Docker Compose |
| API Versioning | DRF URL versioning |


## 🚀 Installation & Setup

### Prerequisites
- Docker & Docker Compose
- Python 3.10+
- Node.js (for future React)
- Make (optional)

### Method 1: Docker (Recommended)

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/multishop.git
cd multishop
