# 🍽️ Online Food Ordering System – DevOps Project

![CI/CD](https://img.shields.io/github/actions/workflow/status/Abhilash-Basarikatti/online_food_order_devops_project/deploy.yml?branch=main)
![Dockerized](https://img.shields.io/badge/docker-ready-blue)
![Status](https://img.shields.io/badge/status-deployed-green)

This is a full-stack **Online Food Ordering Web Application** developed using the **MERN stack**, fully containerized and deployed using modern **DevOps tools** like Docker, GitHub Actions, and AWS EC2.

---

## ✨ Features

- 👥 User Registration and Login  
- 🍕 Browse & Search Food Items  
- 🛒 Add to Cart and Place Orders  
- 🛠 Admin Panel for Managing Orders & Menu  
- 📦 MongoDB for Data Storage  
- 🌐 REST APIs with Node.js & Express  
- 💻 Simple and Responsive Frontend  

---

## 🧰 Tech Stack

| Layer      | Technology                            |
|------------|----------------------------------------|
| Frontend   | HTML, CSS, JavaScript                  |
| Backend    | Node.js, Express.js                    |
| Database   | MongoDB (Dockerized)                   |
| Container  | Docker, Docker Compose                 |
| DevOps     | GitHub Actions, Docker Hub, AWS EC2    |

---

## ⚙️ CI/CD Pipeline

- ✅ Code pushed to `main` triggers **GitHub Actions**
- 🐳 Docker image is built and pushed to **Docker Hub**
- ☁️ SSH into AWS EC2 to pull latest image and run with **Docker Compose**
- 🔁 Fully automated deployment

---

## ⚙️ CI/CD Workflow

### 🔄 GitHub Actions:
- On every push to `main`, GitHub Actions:
  - 🛠 Builds Docker image
  - 📦 Pushes it to Docker Hub
  - 🔐 SSHs into AWS EC2 instance
  - ⬇️ Pulls the latest image and restarts containers using Docker Compose

### 🐳 Docker Compose:
- Manages both the Node.js backend and MongoDB as services
- Ensures smooth multi-container deployment

### ☁️ AWS EC2:
- Acts as the production server
- Hosts the application behind Docker

---

## 🧠 Learning & Purpose

This project was developed to demonstrate practical **DevOps implementation** in a real-world application. It combines:

- 🌐 Web development skills (frontend + backend)
- 🔁 DevOps automation (CI/CD)
- ☁️ Cloud deployment (AWS)
- 🐳 Docker containerization

---

<pre><code>## 📁 Folder Structure <code> . ├── backend/ # Node.js & Express backend │ ├── routes/ # API routes │ ├── models/ # MongoDB models │ └── server.js # Entry point │ ├── frontend/ # Static HTML/CSS/JS frontend │ ├── index.html │ ├── style.css │ └── script.js │ ├── Dockerfile # Docker build config for app ├── docker-compose.yml # Defines Node + MongoDB services └── .github/ └── workflows/ └── deploy.yml # GitHub Actions CI/CD pipeline </code> </code></pre>

