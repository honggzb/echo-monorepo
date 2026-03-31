"use client";

import { useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useThreadMessages, toUIMessages } from '@convex-dev/agent/react';
import { errorMessageAtom, screenAtom, organizationIdAtom, contactSessionIdAtomFamily, conversationIdAtom } from '../atoms/widget-atoms';
import { AlertTriangleIcon, ArrowLeftIcon, MenuIcon } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldGroup } from "@workspace/ui/components/field";
import { Controller, useForm } from 'react-hook-form';
import { WidgetHeader } from '../components/widget-header';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll';
import InfiniteScrollTrigger from '@workspace/ui/components/InfiniteScrollTrigger';
import DicebearAvatar from '@workspace/ui/components/dicebear-avatar';

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

  const conversation = useQuery(
    api.public.conversations.getOneConversation,
    conversationId && contactSessionId ? { conversationId, contactSessionId } : "skip"
  );

  const messages = useThreadMessages(
    api.public.messages.getManyMessages,
    conversation?.threadId && contactSessionId
      ? { threadId: conversation.threadId, contactSessionId }
      : "skip",
    { initialNumItems: 10 },
  );

  //messages.status
  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
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

  const createMessage = useAction(api.public.messages.createMessage);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) {
      return;
    }
    form.reset();
    await createMessage({
      threadId: conversation.threadId,
      prompt: values.message,
      contactSessionId,
    });
  }

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  }

  return (
    <>
      <WidgetHeader className='flex items-center justify-between'>
            <div className="flex items-center gap-x-2">
              <Button size="icon" variant="ghost" onClick={onBack}><ArrowLeftIcon /></Button>
              <p>Chat</p>
            </div>
            <Button size="icon" variant="ghost"><MenuIcon /></Button>
        </WidgetHeader>
        {/* <div className="flex flex-1 flex-col gap-y-4 p-4">
            <AlertTriangleIcon />
            <p className="text-sm">
              chat screen coming soon!
              {JSON.stringify(conversation)}<br />
              {JSON.stringify(messages)}
            </p>
        </div> */}
        <AIConversation>
          <AIConversationContent>
            <InfiniteScrollTrigger
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
            />
            {toUIMessages(messages.results ?? [])?.map((message) => (
              <AIMessage key={message.id} from={message.role === "user" ? "user" : "assistant"}>
                <AIMessageContent>
                  <AIResponse>{message.text}</AIResponse>
                </AIMessageContent>
                {/* avatar component */}
                {message.role === "assistant" && (
                  <DicebearAvatar
                    imageUrl="/logo.svg"
                    seed="assistant"
                    size={32}
                  />
                )}
              </AIMessage>
            ))}
           </AIConversationContent>
        </AIConversation>
        {/* suggestions */}
        {/* <form {...form} onSubmit={form.handleSubmit(onSubmit)}> */}
        <form
            className="rounded-none border-x-0 border-b-0"
            onSubmit={form.handleSubmit(onSubmit)}
          >
          <FieldGroup>
            <Controller
                control={form.control}
                disabled={conversation?.status === "resolved"}
                name="message"
                render={({ field }) => (
                    <AIInputTextarea
                      {...field}
                      disabled={conversation?.status === "resolved"}
                      value={field.value}
                      //onChange={field.onChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                      placeholder={
                        conversation?.status === "resolved" ? "This conversation has been resolved." : "Type your message..."}
                    />
                )}
              />
              <AIInputToolbar>
                <AIInputTools />
                <AIInputSubmit
                  disabled={conversation?.status === "resolved" || !form.formState.isValid}
                  status='ready'
                  type="submit"
                />
              </AIInputToolbar>
            </FieldGroup>
        </form>
        {/* </form> */}
    </>
  )
}

export default WidgetChatScreen;
