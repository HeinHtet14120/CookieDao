"use client";

import { Link } from "@radix-ui/react-navigation-menu";
import { useWallet } from "@/hooks/useWallet";
import { useState, useEffect } from "react";

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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { CircleUser } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { walletAddress, connectWallet, disconnectWallet, error } = useWallet();
  const [copied, setCopied] = useState(false);
  const [availableWallets, setAvailableWallets] = useState();

  const handleProfile = () => {
    router.push("/userprofile");
  };

  useEffect(() => {
    if (window.ethereum) {
      setAvailableWallets("Phantom");
    }
  }, []);

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <nav className="border-b border-transparent bg-zinc-950">
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
                    Jr.Mafia
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
                    className={`block select-none text-slate-200 p-2 transition-colors rounded-md hover:text-accent focus:text-accent ${pathname === "/" ? "text-slate-300" : ""}`}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/dashboard"
                    className={`block select-none text-slate-200 p-2 transition-colors rounded-md hover:text-accent focus:text-accent ${pathname === "/dashboard" ? "text-slate-300" : ""}`}
                  >
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                      href="/swap"
                      className={`block select-none text-slate-200 p-2 transition-colors rounded-md hover:text-accent focus:text-accent ${pathname === "/swap" ? "text-slate-300" : ""}`}
                  >
                    Swap
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/search"
                    className={`block select-none text-slate-200 p-2 transition-colors rounded-md hover:text-accent focus:text-accent ${pathname === "/search" ? "text-slate-300" : ""}`}
                  >
                    Search
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4 z-10">
          <div>
            {walletAddress ? (

                <Button variant="outline" onClick={handleProfile}>
                  <CircleUser />
                  Profile</Button>

            ): null}

          </div>
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
                    <input
                      id="wallet-address"
                      value={walletAddress}
                      readOnly
                      className="cursor-default border px-3 py-2 rounded"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="px-3"
                    onClick={handleCopy}
                  >
                    {copied ? "Copied!" : <Copy />}
                  </Button>
                </div>
              ) : (
                <div className="mt-4">
                  <p>Select a Wallet:</p>
                  <div className="flex flex-col space-y-2 mt-2">

                      <Button

                        onClick={connectWallet}
                        className="w-full"
                      >
                        {availableWallets}
                      </Button>

                  </div>
                  {error && <p className="mt-2 text-red-600">{error}</p>}
                </div>
              )}
              <DialogFooter className="sm:justify-start">
                {walletAddress && (
                  <>  
                    <Button variant="destructive" onClick={disconnectWallet}>
                      Disconnect Wallet
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
}
