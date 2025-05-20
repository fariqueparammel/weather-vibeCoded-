import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";

// Add meta tag for PWA
const metaTag = document.createElement("link");
metaTag.rel = "manifest";
metaTag.href = "./manifest.json";
document.head.appendChild(metaTag);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
