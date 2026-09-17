import express from "express";
import userAuth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { geminiChat } from "../config/geminiConfig.js";
import {
  CHAT_MODEL,
  SYSTEM_PROMPT,
  chatTools,
} from "../config/chat/chatConfig.js";
import {
  buildFunctionResult,
  executeChatTool,
} from "../config/chat/executeChatTool.js";

const chatRouter = express.Router();

const handleOptionalImage = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";

  if (!contentType.includes("multipart/form-data")) {
    return next();
  }

  upload.single("image")(req, res, (uploadError) => {
    if (uploadError) {
      if (uploadError.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "Image must be 5MB or smaller",
        });
      }

      return res.status(400).json({
        message: uploadError.message,
      });
    }

    next();
  });
};

const MAX_TOOL_ROUNDS = 5;

const getFunctionCalls = (interaction) =>
  interaction.steps?.filter((step) => step.type === "function_call") ?? [];

// Keep running tools until Gemini stops calling them (e.g. getNutritionValues → createMeal).
chatRouter.post("/", userAuth, handleOptionalImage, async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const input = [
      {
        type: "text",
        text: `${SYSTEM_PROMPT}\n\nUser message:\n${message.trim()}`,
      },
    ];

    const imageContext = {};

    if (req.file) {
      imageContext.imageBase64 = req.file.buffer.toString("base64");
      imageContext.mimeType = req.file.mimetype;
      input.push({
        type: "image",
        data: imageContext.imageBase64,
        mime_type: imageContext.mimeType,
      });
    }

    let interaction = await geminiChat.interactions.create({
      model: CHAT_MODEL,
      input,
      tools: chatTools,
    });

    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      const functionCalls = getFunctionCalls(interaction);

      if (functionCalls.length === 0) {
        break;
      }

      const functionResults = await Promise.all(
        functionCalls.map(async (toolCall) => {
          const toolResult = await executeChatTool(
            toolCall,
            req.user._id,
            imageContext,
          );

          return buildFunctionResult(toolCall, toolResult);
        }),
      );

      interaction = await geminiChat.interactions.create({
        model: CHAT_MODEL,
        previous_interaction_id: interaction.id,
        input: functionResults,
        tools: chatTools,
      });
    }

    return res.status(200).json({
      message: "Chat response generated successfully",
      response: interaction.output_text,
    });
  } catch (error) {
    console.error("Chat error:", error);

    return res.status(500).json({
      message: "Something went wrong while generating the response",
    });
  }
});

export default chatRouter;
