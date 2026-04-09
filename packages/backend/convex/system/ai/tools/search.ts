//  https://docs.convex.dev/agents/tools
import { openai } from "@ai-sdk/openai";
import { createTool } from "@convex-dev/agent";
import { generateText } from "ai";
import { z } from "zod";
import { internal } from "../../../_generated/api";
import rag from "../rag";
import { SEARCH_INTERPRETER_PROMPT } from "../constants";
import { supportAgent } from "../agents/supportAgent";

export const search = createTool({
    description: "Search the web for information. Use this tool to find up-to-date information on any topic.",
    // args changed to inputSchema in convex 6.0.2
    inputSchema: z.object({
        query: z.string().describe("The search query to find relevant information.")
    }),
    // handler changed to execute in convex 6.0.2
    execute: async (ctx: any, args: { query: string }): Promise<string> => {
        // ctx has agent, userId, threadId, messageId
        if(!ctx.threadId) {
            return "Missing thread ID";
        }
        const conversation = await ctx.runQuery(
            internal.public.conversations.getByThreadId,
            { threadId: ctx.threadId }
        );
        if (!conversation) {
            return "Conversation not found";
        }

        const orgId = conversation.orgId;
        const searchResult = await rag.search(ctx, {
            namespace: orgId,
            query: args.query,
            limit: 5,
        });

        const contextText = `Found results in ${searchResult.entries.map((entry) => entry.title || null)
            .filter((t) => t !== null)
            .join(", ")}. Here is the context:\n\n${searchResult.text}`;

        const response = await generateText({
            messages: [
                {
                    role: "system",
                    content: SEARCH_INTERPRETER_PROMPT,    // make sure prompt is instructing the model to use the context to answer the user's question and not just repeat the context back to the user
                },
                {
                    role: "user",
                    content: `User asked: "${args.query}"\n\nSearch results: ${contextText}`,
                }
            ],
            model: openai.chat("gpt-4o-mini"),
        });

        await supportAgent.saveMessage(ctx, {
            threadId: ctx.threadId,
            message: {
                role: "assistant",
                content: response.text,
            },
        });

        return response.text;
    }
});