import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AlgorithmProvider } from "./contexts/AlgorithmContext";

createRoot(document.getElementById("root")!).render(
  <AlgorithmProvider>
    <App />
  </AlgorithmProvider>
);
