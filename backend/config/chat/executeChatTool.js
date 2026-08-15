import createMeal from "../tools/mealTool.js";
import getGoal from "../tools/goalTool.js";
import getWeeklyMeals from "../tools/weeklyMealsTool.js";

// Mongoose documents don't serialize cleanly for Gemini — convert to plain JSON first.
const serializeData = (data) => JSON.parse(JSON.stringify(data));

const toolHandlers = {
  createMeal: async (userId, args) => {
    const meal = await createMeal({ userId, ...args });
    return { success: true, data: serializeData(meal) };
  },

  getGoal: async (userId) => {
    const goal = await getGoal(userId);
    return { success: true, data: serializeData(goal) };
  },

  getWeeklyMeals: async (userId) => {
    const meals = await getWeeklyMeals(userId);
    return { success: true, data: serializeData(meals) };
  },
};

export const executeChatTool = async (toolCall, userId) => {
  try {
    const handler = toolHandlers[toolCall.name];

    if (!handler) {
      return {
        success: false,
        error: `Unknown tool: ${toolCall.name}`,
      };
    }

    return await handler(userId, toolCall.arguments ?? {});
  } catch (toolError) {
    // Return a structured failure so Gemini can tell the user what went wrong.
    return {
      success: false,
      error: toolError.message,
    };
  }
};

export const buildFunctionResult = (toolCall, toolResult) => ({
  type: "function_result",
  name: toolCall.name,
  call_id: toolCall.id,
  result: [
    {
      type: "text",
      text: JSON.stringify(toolResult),
    },
  ],
});
