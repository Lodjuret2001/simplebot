import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import chatBotIcon from "./assets/chatbot-icon.png";
import userIcon from "./assets/user-icon.png";
import logo from "./assets/logo.png";
import { BotProps, TextMessage, ChatBotMessage, AssistantResponseSchema } from "./types";
import OpenAI, { ClientOptions } from "openai";
import DemoCard from "./DemoCard";

const Bot = (props: BotProps) => {
  const { apiKey, assistant, startMessage } = props;

  const opts: ClientOptions = { apiKey, dangerouslyAllowBrowser: true };
  const openai = new OpenAI(opts);

  const [chatBotMessages, setChatbotMessages] = useState<ChatBotMessage[]>([
    { role: "assistant", message: { type: "text", content: startMessage } },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [userInput, setUserInput] = useState<TextMessage | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  async function handleChatBot(id: string) {
    try {
      await openai.beta.threads.messages.create(id, {
        role: "user",
        content: userInput?.content ?? "",
      });

      const run = await openai.beta.threads.runs.create(id, {
        assistant_id: assistant,
      });

      let runStatus = await openai.beta.threads.runs.retrieve(id, run.id);

      while (true) {
        switch (runStatus.status) {
          case "completed":
            break;

          case "failed":
          case "cancelled":
          case "expired":
          case "incomplete":
            throw new Error(`Run failed with status: ${runStatus.status}`);

          case "queued":
          case "in_progress":
          case "requires_action":
          case "cancelling":
            await new Promise((resolve) => setTimeout(resolve, 300));
            runStatus = await openai.beta.threads.runs.retrieve(id, run.id);
            continue;

          default:
            throw new Error(`Unknown run status: ${runStatus.status}`);
        }
        break;
      }

      const messages = await openai.beta.threads.messages.list(id);

      const assistantMessage = messages.data.find(
        (msg) => msg.role === "assistant"
      );

      if (assistantMessage && assistantMessage.content[0].type === "text") {
        const json = JSON.parse(assistantMessage.content[0].text.value);
        const parsed = AssistantResponseSchema.safeParse(json);

        if (!parsed.success) {
          console.error(parsed.error);
          throw new Error("Invalid message from assistant");
        }

        const newMessage: ChatBotMessage = {
          role: "assistant",
          message: parsed.data,
        };

        setChatbotMessages((prev) => [...prev, newMessage]);
      } else {
        throw new Error("Invalid message from assistant");
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatBotMessage = {
        role: "assistant",
        message: {
          type: "text",
          content: "Something went wrong, check console.log!",
        },
      };
      setChatbotMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  }

  const initAssistant = async () => {
    const thread = await openai.beta.threads.create();
    setThreadId(thread.id);
  };

  useEffect(() => {
    initAssistant();
  }, []);

  useEffect(() => {
    if (!isThinking || !threadId) return;
    handleChatBot(threadId);
  }, [userInput]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const message: TextMessage = { type: "text", content: inputValue };
    const newMessage: ChatBotMessage = {
      role: "user",
      message,
    };
    setChatbotMessages([...chatBotMessages, newMessage]);
    setIsThinking(true);
    setInputValue("");
    setUserInput(message);
  };

  return (
    <>
      {isOpen ? (
        <Box
          sx={{
            width: 400,
            height: 600,
            position: "fixed",
            bottom: 20,
            right: 20,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 4,
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">SimpleBot</Typography>
            <IconButton onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
            <List dense>
              {chatBotMessages.map((chat, i) => (
                <ListItem key={i} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      src={chat.role === "assistant" ? chatBotIcon : userIcon}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        {chat.message.type === "text" && (
                          <Typography>{chat.message.content}</Typography>
                        )}
                        {chat.message.type === "demo" && (
                          <DemoCard demo={chat.message.content} />
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
              {isThinking && (
                <ListItem>
                  <ListItemText primary="SimpleBot is typing..." />
                </ListItem>
              )}
            </List>
          </Box>

          <Paper
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            sx={{ p: 1, display: "flex", borderTop: "1px solid #ddd" }}
          >
            <TextField
              fullWidth
              placeholder="I would like to have help with..."
              variant="standard"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              sx={{ px: 1 }}
            />
            <IconButton type="submit" color="primary">
              <SendIcon />
            </IconButton>
          </Paper>
        </Box>
      ) : (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: `url(${logo}) center / cover`,
            boxShadow: 4,
          }}
        />
      )}
    </>
  );
};

export default Bot;
