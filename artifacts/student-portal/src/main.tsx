import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Entry point for the React student portal application.
 */
createRoot(document.getElementById("root")!).render(<App />);
