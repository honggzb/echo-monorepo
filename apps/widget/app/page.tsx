"use client";

import { Button } from "@workspace/ui/components/button"
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useVapi } from "@/modules/widget/hooks/use-vapi";

export default function Page() {
  const users = useQuery(api.users.getUsers);
  const { startCall, endCall, isConnected, isConnecting, isSpeaking, transcript } = useVapi();

  return (
    <div className="flex flex-col justify-center items-center min-h-svh mx-auto w-full p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        widget app
      </div>
      <Button variant="secondary" onClick={() => startCall()}>Start Call</Button>
      <Button variant="secondary" onClick={() => endCall()}>End Call</Button>
      <p>IsConnected: {`${isConnected}`}</p>
      <p>IsConnecting: {`${isConnecting}`}</p>
      <p>IsSpeaking: {`${isSpeaking}`}</p>
      <p>Transcript: {JSON.stringify(transcript, null, 2)}</p>
    </div>
  )
}
