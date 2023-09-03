import React, { useEffect, useState } from "react";
import Head from "next/head";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Raleway } from "next/font/google";
import { cn } from "@/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
const raleway = Raleway({ subsets: ["latin"] });
interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { data: sessionData } = useSession();

  // Handles the event of header being on top of page to make bg transparent
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setAtTop(window.scrollY === 0 ? true : false);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [atTop]);

  return (
    <>
      <Head>
        <title>Rscue</title>
        <meta name="description" content="Rscue - The rescue animal platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={cn(raleway.className)}>
        <nav
          className={cn(
            "sticky top-0 z-[99] p-4 transition-all duration-300",
            atTop ? " " : "bg-secondary "
          )}
        >
          <div className="m-auto flex max-w-screen-2xl flex-row items-center justify-between ">
            <h2>Rscue</h2>
            <NavigationMenu className="z-[1000]">
              <NavigationMenuList className="gap-8">
                <NavigationMenuItem className="underline-offset-2 hover:underline">
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink>About us</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  {sessionData ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex flex-row gap-1 text-primary underline-offset-2 hover:underline">
                        <span>Hey {sessionData.user?.name}</span>
                        <ChevronDown></ChevronDown>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="z-[1000]">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90 focus:text-primary-foreground"
                          onClick={() => void signOut()}
                        >
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button className="" onClick={() => void signIn()}>
                      Sign in
                    </Button>
                  )}
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
