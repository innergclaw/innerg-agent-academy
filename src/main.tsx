import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AcademyApp } from "./components/AcademyApp";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AcademyApp />
  </StrictMode>,
);
