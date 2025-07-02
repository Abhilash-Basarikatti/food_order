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

## 📦 Setup Locally

```bash
git clone https://github.com/Abhilash-Basarikatti/online_food_order_devops_project.git
cd online_food_order_devops_project
docker-compose up --build
