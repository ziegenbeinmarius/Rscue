import React from "react";
import Head from "next/head";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Rscue</title>
        <meta name="description" content="Rscue - The rescue animal platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" m-auto max-w-screen-xl p-0 sm:p-4">
        <nav className="mb-16 flex flex-row items-center justify-between py-4">
          <h2>Rscue</h2>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuContent>
                  <div className="w-full  p-4">
                    <NavigationMenuLink>Link</NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  {sessionData ? (
                    <span>Hey {sessionData.user?.name}</span>
                  ) : (
                    <span>Login</span>
                  )}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4">
                    <Button
                      className=""
                      onClick={
                        sessionData ? () => void signOut() : () => void signIn()
                      }
                    >
                      {sessionData ? "Sign out" : "Sign in"}
                    </Button>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <div>{children}</div>
      </main>
    </>
  );
};
