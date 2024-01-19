"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export default function LoggedComponent() {
  const { data: session, status } = useSession();
  const handleLogout = async () => {
    signOut();
  };
  return (
    <div className="flex flex-row items-center">
      <p className="fixed left-0 top-0 flex w-full justify-center pb-6 pt-8 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:p-4">{session ? `Logged as ${session?.user?.name}` : "You're logged out!"}</p>
      {session ? (
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        ""
      )}
    </div>
  );
}
