// import { createTool } from "@convex-dev/agent";
// import z from "zod";
// import { internal } from "../../../_generated/api";
// import { supportAgent } from "../agents/supportAgent";

// export const escalateConversation = createTool({
//     description: "Escalate a conversation",
//     args: z.object({}),
//     handler: async (ctx, args) => {
//         if(!ctx.threadId) {
//             return "Missing thread ID";
//         }
//         await ctx.runMutation(internal.public.conversations.escalateConversation, { threadId: ctx.threadId });

//         await supportAgent.saveMessage(ctx, {
//             threadId: ctx.threadId,
//             message: {
//                 role: "assistant",
//                 content: "The conversation has been escalated."
//             }
//         })

//         return "Conversation escalated";
//     },
// })