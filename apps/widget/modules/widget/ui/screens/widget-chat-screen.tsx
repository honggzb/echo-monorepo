"use client";

import { useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { errorMessageAtom, screenAtom, organizationIdAtom, contactSessionIdAtomFamily, conversationIdAtom } from '../atoms/widget-atoms';
import { AlertTriangleIcon, ArrowLeftIcon, MenuIcon } from 'lucide-react';
import { WidgetHeader } from '../components/widget-header';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { set } from 'zod/v4-mini';

const WidgeChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

  const conversation = useQuery(
    api.public.conversations.getOneConversation,
    conversationId && contactSessionId
      ? { conversationId, contactSessionId }
      : "skip"
  );

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  }

  return (
    <>
      <WidgetHeader className='flex items-center justify-center'>
            <div className="flex items-center gap-x-2">
              <Button size="icon" variant="transparent" onClick={onBack}><ArrowLeftIcon /></Button>
              <p>Chat</p>
            </div>
            <Button size="icon" variant="transparent"><MenuIcon /></Button>
        </WidgetHeader>
        <div className="flex flex-1 flex-col gap-y-4 p-4">
            <AlertTriangleIcon />
            <p className="text-sm">
              chat screen coming soon!
              {JSON.stringify(conversation)}
            </p>
        </div>
    </>
  )
}

export default WidgeChatScreen;
