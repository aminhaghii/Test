import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { reportVitals } from "./lib/vitals";

// Register Service Worker for caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

if (import.meta.env.PROD) {
  reportVitals();
}

createRoot(document.getElementById("root")!).render(<App />);
