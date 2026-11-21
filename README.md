# Friends Chat

**Friends Chat** is a full-stack real-time chat application that allows users to connect with friends and exchange messages instantly. It provides a simple and user-friendly interface for online communication.

**Live Demo:** [https://friendsmsg.vercel.app/](https://friendsmsg.vercel.app/)

## Features

- User registration and login
- Real-time messaging
- Send and receive messages instantly
- View user profiles
- Manage conversations with friends
- Block and unblock users
- Delete conversations
- Responsive user interface
- Secure authentication
- Persistent message storage

## Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Redux Toolkit
- Axios
- Vite

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- WebSocket
- SockJS

### Database

- MySQL

### Tools and Deployment

- Git and GitHub
- Vercel
- Render
- Maven

## Architecture

The application follows a client-server architecture.

- **Frontend:** Provides the user interface and communicates with the backend APIs.
- **Backend:** Handles authentication, user management, messaging, and business logic.
- **WebSocket:** Enables real-time communication between users.
- **Database:** Stores user information and chat messages.

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- Java 17 or compatible JDK
- Maven
- Node.js and npm
- MySQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ASHISHRANA982/Friends-Chat.git
cd Friends-Chat
```

### 2. Configure the Database

Create a MySQL database:

```sql
CREATE DATABASE `chart-app`;
```

Configure your database credentials and other required environment variables in the backend configuration.

### 3. Run the Backend

Navigate to the backend directory:

```bash
cd Backend
```

Run the application using Maven:

```bash
mvn spring-boot:run
```

Make sure the backend configuration uses the correct database credentials and server port.

### 4. Run the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd Frontend
npm install
```

Create a `.env` file and configure your backend API URL:

```env
VITE_API_URL=http://localhost:4563
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

> Note: Adjust the folder names and configuration values if your local project structure differs.

## Security

- Authentication and authorization are handled by Spring Security.
- JWT-based authentication is used to manage authenticated sessions.
- Backend endpoints are protected against unauthorized access.

## Project Structure

```text
Friends-Chat/
├── Backend/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Project Objective

The objective of Friends Chat is to build a real-time communication platform while gaining practical experience in full-stack development, REST APIs, authentication, database management, and WebSocket communication.

## Author

**Ashish Rana**

- GitHub:https://github.com/ASHISHRANA982
- LinkedIn:https://www.linkedin.com/in/ashish-rana-02271a391/

## License

This project is created for learning and portfolio purposes.
