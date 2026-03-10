"use client";

import { Button } from "@workspace/ui/components/button"
import { add } from "@workspace/math/add";
import { useMutation, useQuery, Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";

export default function Page() {
  const users = useQuery(api.users.getUsers);
  const addUser = useMutation(api.users.addUser);

  return (
    <>
      <Authenticated>
        <UserButton />
        <div className="flex min-h-svh p-6">
          <div className="flex justify-center items-center max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
            web app
            <Button onClick={() => addUser()}>Add User</Button>
            <p>{add(1, 2)}</p>
            <hr />
            <p>{users ? JSON.stringify(users, null, 2) : 'Loading...'}</p>
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <p>Must be signed in to view this content</p>
        <SignInButton />
      </Unauthenticated>
    </>
  )
}
