# interactive-chatbot

[**Project Description**]

This project is an interactive chatbot application with a React frontend and a Node.js (Express) backend.

---

## Project Structure

The project is organized as a monorepo with two main parts:

-   `/client`: The frontend application built with React.
-   `/server`: The backend API server built with Express.js.

---

## Technologies Used

-   **Client (Frontend):**
    -   React 19
    -   Vite
    -   React Router 7
    -   Tailwind CSS for styling
    -   TypeScript

-   **Server (Backend):**
    -   Node.js
    -   Express.js
    -   TypeScript (run with `tsx`)

---

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   Node.js (v22.x or higher, as per `client/package.json`)
-   npm (or your preferred package manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd interactive-chatbot
    ```

2.  **Set up the server:**
    ```bash
    cd server
    npm install
    ```

3.  **Set up the client:**
    ```bash
    cd ../client
    npm install
    ```

### Running the Application

Both the client and server have `dev` scripts to run them in development mode with hot-reloading.

1.  **Run the backend server:**
    Open a terminal, navigate to the `/server` directory, and run:
    ```bash
    npm run dev
    ```
    The server will start, typically on a port like `3000`. Check the server's console output for the exact URL.

2.  **Run the frontend client:**
    Open a second terminal, navigate to the `/client` directory, and run:
    ```bash
    npm run dev
    ```
    The client development server will start, typically on port `5173`. You can access the application at `http://localhost:5173`.

---

## Available Scripts

### Server (`/server`)

-   `npm run dev`: Starts the server in development mode with `tsx`.
-   `npm test`: (Not yet implemented)

### Client (`/client`)

-   `npm run dev`: Starts the development server using `react-router dev`.
-   `npm run build`: Builds the application for production using `react-router build`.
-   `npm run start`: Serves the production build.
-   `npm run typecheck`: Runs the TypeScript type checker.
