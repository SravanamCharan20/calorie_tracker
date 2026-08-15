import express from "express";
import userAuth from "../middlewares/auth.middleware.js";
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

// Chat runs in two steps when a tool is needed:
// 1) Gemini decides which tool to call
// 2) We run the tool, send results back, and Gemini writes the final reply
chatRouter.post("/", userAuth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const interaction = await geminiChat.interactions.create({
      model: CHAT_MODEL,
      input: [
        {
          type: "text",
          text: `${SYSTEM_PROMPT}\n\nUser message:\n${message.trim()}`,
        },
      ],
      tools: chatTools,
    });

    const functionCalls =
      interaction.steps?.filter((step) => step.type === "function_call") ?? [];

    // No tool needed — Gemini answered directly (e.g. a general nutrition question).
    if (functionCalls.length === 0) {
      return res.status(200).json({
        message: "Chat response generated successfully",
        response: interaction.output_text,
      });
    }

    const functionResults = await Promise.all(
      functionCalls.map(async (toolCall) => {
        const toolResult = await executeChatTool(toolCall, req.user._id);
        return buildFunctionResult(toolCall, toolResult);
      }),
    );

    const finalInteraction = await geminiChat.interactions.create({
      model: CHAT_MODEL,
      previous_interaction_id: interaction.id, // Links this turn to the tool call above.
      input: functionResults,
      tools: chatTools,
    });

    return res.status(200).json({
      message: "Chat response generated successfully",
      response: finalInteraction.output_text,
    });
  } catch (error) {
    console.error("Chat error:", error);

    return res.status(500).json({
      message: "Something went wrong while generating the response",
    });
  }
});

export default chatRouter;
