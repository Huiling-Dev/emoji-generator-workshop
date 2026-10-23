// React entry point. Bun bundles this automatically because index.html imports it.
import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);
