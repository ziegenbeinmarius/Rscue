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

import { Raleway } from "next/font/google";
import { cn } from "@/utils";
const raleway = Raleway({ subsets: ["latin"] });
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
      <main className={cn(raleway.className)}>
        <nav className="sticky top-0 z-[99] h-12 bg-slate-700 p-4 sm:h-24  sm:px-8  sm:py-4 ">
          <div className="m-auto flex max-w-screen-2xl flex-row items-center justify-between ">
            <h2>Rscue</h2>
            <NavigationMenu>
              <NavigationMenuList>
                {/* <NavigationMenuItem>
                  <p>hek</p>
                </NavigationMenuItem> */}
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
                          sessionData
                            ? () => void signOut()
                            : () => void signIn()
                        }
                      >
                        {sessionData ? "Sign out" : "Sign in"}
                      </Button>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>
        {children}
      </main>
    </>
  );
};
