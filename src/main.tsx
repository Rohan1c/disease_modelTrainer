import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

const root = document.getElementById("root") as HTMLElement;

if (!root) {
  throw new Error("Root element not found. Did you forget to add <div id=\"root\"></div> in index.html?");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
