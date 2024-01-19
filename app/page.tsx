import LoggedComponent from "@/components/logged";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/nextauth";
import EightBall from "@/components/8ball";
import EightBallDisabled from "@/components/8ball-disabled";

export default async function Home() {
  const handleLogin = async () => {
    "use server";
    redirect("/api/auth/signin/github");
  };

  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to&nbsp;
          <code className="font-mono font-bold">8ball-todo</code>!
        </p>

        <LoggedComponent />

        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0" href="https://github.com/italogama" target="_blank" rel="noopener noreferrer">
            By{" "}
            <Avatar>
              <AvatarImage src="https://github.com/italogama.png" />
              <AvatarFallback>GC</AvatarFallback>
            </Avatar>
          </a>
        </div>
      </div>

      <div className="relative flex flex-col place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
      {!session ? (
        <>
          <EightBallDisabled />
          <form action={handleLogin}>
            <Button type="submit">
              <Image src="/github.svg" alt="Github Logo" className="dark:invert mr-2" width={24} height={24} />
              Sign in with Github
            </Button>
          </form>
        </>
      ) : (
        <EightBall />
      )}
    </main>
  );
}
