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
##  Website Snapshots

<img width="662" height="392" alt="img-1" src="https://github.com/user-attachments/assets/c504a623-62c4-4ace-9e0f-9e54eef5772c" />
<img width="1611" height="662" alt="img-2" src="https://github.com/user-attachments/assets/60bd8a01-f727-4235-b157-a9457b408740" />
<img width="1897" height="876" alt="img-3" src="https://github.com/user-attachments/assets/61ccbf0e-3ada-4821-9a4b-f17cb47cfb8c" />
<img width="1596" height="915" alt="img-4" src="https://github.com/user-attachments/assets/824bc544-2abd-4077-aa29-9c21307dacff" />

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
