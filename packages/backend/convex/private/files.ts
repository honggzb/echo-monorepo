import { ConvexError, v } from "convex/values";
import { action, mutation } from "../_generated/server";
import { contentHashFromArrayBuffer, guessMimeTypeFromContents, guessMimeTypeFromExtension, vEntryId } from "@convex-dev/rag";
import { extractTextContent } from "../lib/extractTextContent";
import rag from "../system/ai/rag";
import { Id } from "../_generated/dataModel";

function guessMimeType(fileName: string, bytes: ArrayBuffer): string {
    return (
        guessMimeTypeFromContents(bytes) ||
        guessMimeTypeFromExtension(fileName) ||
        "application/octet-stream"
    )
}

export const deleteFile = mutation({
    args: {
        entryId: vEntryId,
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found",
            });
        }

        const orgId = identity.orgId as string;
        if (!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found",
            });
        }

        const namespace = await rag.getNamespace(ctx, { namespace: orgId });
        if (!namespace) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid namespace",
            });
        }

        const entry = await rag.getEntry(ctx, { entryId: args.entryId });
        if (!entry) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Entry not found",
            });
        }

        if(entry.metadata?.uploadedBy !== orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "unauthorized to delete this file",
            });
        }

        if(entry.metadata?.storageId) {
            await ctx.storage.delete(entry.metadata.storageId as Id<"_storage">);
        }

        await rag.deleteAsync(ctx, { entryId: args.entryId });
    },
});

export const addFile = action({
    args: {
        filename: v.string(),
        mimeType: v.string(),
        bytes: v.bytes(),
        category: v.optional(v.string()),
     },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found",
            });
        }

        const orgId = identity.orgId as string;
        if (!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found",
            });
        }

        const { bytes, filename, category } = args;
        const mimeType = args.mimeType || guessMimeType(filename, bytes);
        const blob = new Blob([bytes], { type: mimeType });

        //https://docs.convex.dev/file-storage/upload-files
        const storageId = await ctx.storage.store(blob);

        const text = await extractTextContent(ctx, {
            storageId,
            filename,
            mimeType,
            bytes,
        })

        const { entryId, created } = await rag.add(ctx, {
            // Supper important: what search space to add this to. You cannot search across namespaces
            // if not added, it will be considered global(we do not want this)
            namespace: orgId,
            text,
            key: filename,
            title: filename,
            metadata: {
                storageId,   // important for file deletion
                uploadedBy: orgId,
                filename,
                category: category ?? null,
            },
            contentHash: await contentHashFromArrayBuffer(bytes),  // to avoid re-inserting if the file content hasn't changed
        })

        if(!entryId) {
            console.debug("entry already exists, skipping upload metadata", { filename, orgId })
            await ctx.storage.delete(storageId);
        }

        return {
            url: ctx.storage.getUrl(storageId),
            entryId
        };
    }
})