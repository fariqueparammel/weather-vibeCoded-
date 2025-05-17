import { useEffect } from "react";
import Weather from "./components/weather/Weather";
import "./styles/weather.css";

function App() {
  // Register service worker for PWA support
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/serviceWorker.js")
          .then((registration) => {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
          })
          .catch((error) => {
            console.log("ServiceWorker registration failed: ", error);
          });
      });
    }
  }, []);

  return (
    <div className="app">
      <Weather />
    </div>
  );
}

export default App; 
