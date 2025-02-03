"use client";

import { Link } from "@radix-ui/react-navigation-menu";
import { useWallet } from "@/hooks/useWallet";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { usePathname } from "next/navigation";
import {useState} from "react";

export default function Navbar() {
  const pathname = usePathname();
  console.log(pathname);
  const { walletAddress, connectWallet, disconnectWallet, error } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <nav className="border-b bg-zinc-950">
      <div className="flex items-center justify-between p-4 max-w-full">
        <div className="flex items-center justify-between gap-20">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                      href="/"
                      className="font-bold text-3xl bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent font-fira"
                  >
                    Jr.Mafia DeFi
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-10">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                      href="/"
                      className={cn(
                          "block select-none text-slate-200 space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          pathname === "/" ? "text-slate-300" : "",
                      )}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                      href="/dashboard"
                      className={cn(
                          "block select-none text-slate-200 space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          pathname === "/dashboard" ? "text-slate-300" : "",
                      )}
                  >
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/search"
                    className={cn(
                      "block select-none text-slate-200 space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      pathname === "/search" ? "text-slate-300" : "",
                    )}
                  >
                    Search
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                {walletAddress ? "Wallet Connected" : "Connect Wallet"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect Wallet</DialogTitle>
                <DialogDescription>
                  {walletAddress
                      ? "Your wallet is connected. Below is your wallet address."
                      : "Connect your wallet to continue."}
                </DialogDescription>
              </DialogHeader>
              {walletAddress ? (
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="wallet-address" className="sr-only">
                        Wallet Address
                      </Label>
                      <Input
                          id="wallet-address"
                          value={walletAddress}
                          readOnly
                          className="cursor-default"
                      />
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        className="px-3"
                        onClick={handleCopy}
                    >
                      {copied ? "Copied!" : <Copy/>}
                    </Button>
                  </div>
              ) : (
                  <div className="mt-4">
                    <Button onClick={connectWallet}>Connect MetaMask</Button>
                    {error && <p className="mt-2 text-red-600">{error}</p>}
                  </div>
              )}
              <DialogFooter className="sm:justify-start">
                {walletAddress && (
                    <Button variant="destructive" onClick={disconnectWallet}>
                      Disconnect Wallet
                    </Button>
                )}
                {/*<DialogClose asChild>*/}
                {/*  <Button type="button" variant="secondary">*/}
                {/*    Close*/}
                {/*  </Button>*/}
                {/*</DialogClose>*/}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}
