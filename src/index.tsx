import React from "react";
import ReactDOM from "react-dom/client";
import Bot from "./Bot";

let apiKey: string | undefined;
let assistant: string | undefined;
let startMessage: string | undefined;

const isViteDev =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.MODE === "development";

if (isViteDev) {
  apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  assistant = import.meta.env.VITE_ASSISTANT_ID;
  startMessage = "Hello! How can I help you today?";
} else {
  const scriptEl =
    document.currentScript ??
    (document.getElementById("simple-bot-script") as HTMLScriptElement);
  apiKey = scriptEl.dataset.apiKey;
  assistant = scriptEl.dataset.assistant;
  startMessage = scriptEl.dataset.startMessage;
}

if (!apiKey) throw new Error("SimpleBot: Missing required api-key.");
if (!assistant) throw new Error("SimpleBot: Missing required assistant.");
if (!startMessage) throw new Error("SimpleBot: Missing required start message.");

const container = document.createElement("div");
container.id = "simple-bot";
document.body.appendChild(container);

ReactDOM.createRoot(container).render(
  <Bot {...{ apiKey, assistant, startMessage }} />
);
