# Maritime Communications Trainer

This project is an interactive chatbot application designed to train users in standard maritime radio protocols. It features a React frontend and a Node.js (Express) backend.

---

## Project Structure

The project is a monorepo with the following structure:

-   `/client`: A React-based frontend application.
-   `/server`: A Node.js and Express backend server.
-   `/shared`: Shared code between the client and server, such as API definitions and models.

---

## Technologies Used

### Client (Frontend)

-   **Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Routing**: [React Router 7](https://reactrouter.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with `shadcn/ui` components.
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Key Libraries**:
    -   `axios` for HTTP requests.
    -   `lucide-react` for icons.
    -   `sonner` for notifications.
    -   `zustand` for state management.
    -   `framer-motion` for animations.

### Server (Backend)

-   **Framework**: [Express.js](https://expressjs.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **TypeScript Runner**: `tsx` for running TypeScript directly.
-   **Key Libraries**:
    -   `cors` for enabling Cross-Origin Resource Sharing.
    -   `dotenv` for managing environment variables.
    -   `express-async-handler` for handling async errors in Express.
    -   `express-session` for session management.
    -   `@cerebras/cerebras_cloud_sdk` for interacting with the Cerebras Cloud for free access to language model 'llama3.1-8b'.

---

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v22.x or higher is recommended)
-   [npm](https://www.npmjs.com/) (or another package manager like `yarn` or `pnpm`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd interactive-chatbot
    ```

2.  **Install server dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install client dependencies:**
    ```bash
    cd ../client
    npm install
    ```

### Running the Application

1.  **Start the backend server:**
    In a terminal, navigate to the `/server` directory and run:
    ```bash
    npm run dev
    ```
    The server will start on port `3000`.

2.  **Start the frontend client:**
    In a separate terminal, navigate to the `/client` directory and run:
    ```bash
    npm run dev
    ```
    The client will start on port `5173` and can be accessed at `http://localhost:5173`.

---

## Available Scripts

### Server (`/server`)

-   `npm run dev`: Starts the development server with hot-reloading using `tsx`.
-   `npm test`: (Not yet implemented).
-   `npm run format`: Formats code with Prettier.

### Client (`/client`)

-   `npm run dev`: Starts the development server using `react-router dev`.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Serves the production build.
-   `npm run typecheck`: Runs the TypeScript type checker.
-   `npm run format`: Formats code with Prettier.
