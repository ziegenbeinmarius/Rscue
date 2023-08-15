import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  function toastBoi() {
    toast({
      title: "Scheduled: Catch up",
      description: "Friday, February 10, 2023 at 5:57 PM",
    });
  }

  return (
    <>
      <Head>
        <title>Rscue</title>
        <meta name="description" content="Rscue - The rescue animal platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center">
        <Button onClick={toastBoi}>Hello</Button>
        <p className="text-2xl ">Some text</p>
        <p className="text-2xl ">More text</p>
        <p className="text-2xl ">
          {hello.data ? hello.data.greeting : "Loading tRPC query..."}
        </p>
        <AuthShowcase />
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <Button
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
}
