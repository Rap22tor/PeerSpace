import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { get } from "./api";

function App() {
  const [status, setStatus] = useState("checking…");

  useEffect(() => {
    get<{ status: string }>("/health")
      .then((data) => {
        setStatus(data.status);
      })
      .catch((err: Error) => {
        setStatus(err.message);
      });
  }, []);

  return (
    <>
      <h1>Study Group Finder: API {status}</h1>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
