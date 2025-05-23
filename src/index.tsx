import React from "react";
import ReactDOM from "react-dom/client";
import Bot from "./Bot";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

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

const host = document.createElement("div");
host.id = "simple-bot";
document.body.appendChild(host);
const shadowContainer = host.attachShadow({ mode: "open" });
const shadowRoot = document.createElement("div");
shadowRoot.id = "root";
shadowContainer.appendChild(shadowRoot);

const cache = createCache({
  key: 'css',
  prepend: true,
  container: shadowContainer,
});

ReactDOM.createRoot(shadowRoot).render(
  <CacheProvider value={cache}>
    <Bot {...{ apiKey, assistant, startMessage }} />
  </CacheProvider>,
);
