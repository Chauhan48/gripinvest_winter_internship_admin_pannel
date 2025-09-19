# Grip Invest Admin Panel

An **Admin Panel** built with **React + TypeScript + Vite + Material UI**, designed for managing products and tracking transactions.  

Admins can:
- **Add, update, and delete products**
- **View all transactions**

This project is dockerized for easy setup and deployment.

---

##  Features
-  Fast development with **Vite**
-  UI powered by **Material UI**
-  Type safety with **TypeScript**
-  Docker support for containerized builds

---

##  Prerequisites
- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

---

##  Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Chauhan48/gripinvest_winter_internship_admin_pannel.git
   cd gripinvest_winter_internship_admin_pannel

2. **Install dependencies**
   ```sh
   npm install

3. **Create .env file**
    *In the project root add*
   ```sh
   VITE_API_BASE_URL=http://localhost:8080

4. **Run locally**
   ```sh
   npm run dev

---

##  Running with Docker

1. **Build docker image**
   ```sh
   npm run docker:build


2. **Run docker container**
   ```sh
   npm run docker:run
  *This will start the app inside a Docker container.*
