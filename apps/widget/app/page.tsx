"use client";

import { Button } from "@workspace/ui/components/button"
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export default function Page() {
  const users = useQuery(api.users.getUsers);
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        widget app
        <p>{JSON.stringify(users)}</p>
      </div>
    </div>
  )
}
