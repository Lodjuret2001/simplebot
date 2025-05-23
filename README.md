# SimpleBot 🤖

A lightweight, embeddable chatbot powered by OpenAI Assistants API.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/lodjuret2001/simplebot.git
cd simplebot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
```

Enter OpenAI api dashboard and create a assistant and in the ./src/data folder you will find a simple JSON_SCHEMA for the response_format for the chatbot.

### 4. Start the development server

```bash
npm run dev
```

This will launch the chatbot in development mode.

### 📦 Building

To bundle the chatbot use:

```bash
npm run build
```

### 🔗 Embedding the Chatbot

To embed the chatbot in your website, include the following snippet in your HTML:
```bash
<script
  id="simple-bot-script"
  src="where ever you put the minified js file"
  async
  data-api-key="your-openai-api-key"
  data-assistant="your-assistant-id"
  data-start-message="Hello! How can I help you today?"
></script>
```

Or if using JS:

```bash
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const script = document.createElement("script");
    script.id = "simple-bot-script";
    script.src = "where ever you put the minified js file"";
    script.async = true;
    script.setAttribute("data-api-key", "your-openai-api-key");
    script.setAttribute("data-assistant", "your-assistant-id");
    script.setAttribute("data-start-message", "Hello! How can I help you today?");
    document.body.appendChild(script);
  });
</script>
```
