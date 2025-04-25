import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ContentfulProvider } from "./api/ContentfulContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContentfulProvider>
      <App />
    </ContentfulProvider>
  </StrictMode>
);
