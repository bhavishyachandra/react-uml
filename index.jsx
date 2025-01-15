import { createRoot } from "react-dom/client";
import App2 from "./App2";
import "./index.css";

const container = document.querySelector("#app");
const root = createRoot(container);

root.render(<App2 />);
