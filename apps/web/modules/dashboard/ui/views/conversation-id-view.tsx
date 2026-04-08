"use client";

import { api } from '@workspace/backend/_generated/api';
import { Id } from '@workspace/backend/_generated/dataModel'
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { Button } from '@workspace/ui/components/button'
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll';
import { useAction, useMutation, useQuery } from 'convex/react';
import { MoreHorizontalIcon, Wand2Icon } from 'lucide-react'
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
  AIInputButton
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { Field, FieldGroup } from "@workspace/ui/components/field";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConversationStatusButton } from "../components/conversation-status-button";
import { useState } from 'react';
import InfiniteScrollTrigger from '@workspace/ui/components/InfiniteScrollTrigger';
import DicebearAvatar from '@workspace/ui/components/dicebear-avatar';

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

const ConversationIdView = ({ conversationId }: { conversationId: Id<"conversations"> }) => {
  const conversation = useQuery(api.public.conversations.getOneConversation, { conversationId });
  const messages = useThreadMessages(
    api.public.messages.getManyMessages,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: 10 }
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
  } = useInfiniteScroll({
    status: messages.status,
    loadMore: messages.loadMore,
    loadSize: 10,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const [isEnhancing, setIsEnhancing] = useState(false);
  const enhanceResponse = useAction(api.public.messages.enhanceResponse);

  const handleEnhanceResponse = async (messageId: Id<"messages">) => {
    setIsEnhancing(true);
    const currentValue = form.getValues("message");
    try {
      const enhancedMessage = await enhanceResponse({ prompt: currentValue });
      form.setValue("message",  enhancedMessage);
    } catch (error) {
      console.error("Failed to enhance response:", error);
    } finally {
      setIsEnhancing(false);
    }
  }

  const createMessage = useMutation(api.public.messages.createMessage);
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await createMessage({ prompt: data.message, conversationId });
      form.reset();
    } catch (error) {
      console.error("Failed to create message:", error);
    }
  }

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const updateConversationStatus = useMutation(api.public.conversations.updateStatus);
  const handleToggleStatus = async () => {
    if (!conversation) {
      return;
    }

    setIsUpdatingStatus(true);
    let newStatus: "unresolved" | "resolved" | "escalated";
    // Cycle through states: unresolved -> escalated -> resolved -> unresolved
    if(conversation.status === "unresolved") {
      newStatus = "escalated";
    } else if (conversation.status === "escalated") {
      newStatus = "resolved";
    } else {
      newStatus = "unresolved";
    }

    try {
      await updateConversationStatus({ conversationId, status: newStatus });
    } catch (error) {
      console.error("Failed to update conversation status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // if(conversation === undefined) {
  //   return <ConversationIdViewLoading />
  // }

  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
        {!!conversation && (
          <ConversationStatusButton
            onClick={handleToggleStatus}
            status={conversation.status}
            disabled={isUpdatingStatus}
          />
        )}
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? []).map((message) => (
            <AIMessage
              key={message.id}
              from={message.role === "user" ? "assistant" : "user"}
            >
              <AIMessageContent>
                {message.content}
              </AIMessageContent>
              {message.role === "user" && (
                <DicebearAvatar seed={conversation?.contactSessionId ?? 'user'} size={32} />
              )}
            </AIMessage>
          ))}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>
      <div className="p-2">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
                control={form.control}
                disabled={conversation?.status === "resolved"}
                name="message"
                render={({ field }) => (
                    <AIInputTextarea
                      {...field}
                      disabled={conversation?.status === "resolved" || form.formState.isSubmitting || isEnhancing}
                      value={field.value}
                      onChange={field.onChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                      placeholder={
                        conversation?.status === "resolved" ? "This conversation has been resolved." : "Type your response as an operator..."
                      }
                    />
                )}
              />
              <AIInputToolbar>
                <AIInputTools>
                  <AIInputButton
                    onClick={handleEnhanceResponse}
                    disabled={
                      conversation?.status === "resolved" ||
                      isEnhancing ||
                      !form.formState.isValid
                    }
                  >
                    <Wand2Icon />
                    {isEnhancing ? "Enhancing..." : "Enhance"}
                  </AIInputButton>
                </AIInputTools>
              </AIInputToolbar>
              <AIInputSubmit
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  isEnhancing
                }
                status="ready"
                type="submit"
              />
            </FieldGroup>
        </form>
      </div>
    </div>
  )
}

export default ConversationIdView