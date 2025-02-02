"use client";

import { useEffect, useState } from "react";
import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
const CHAIN_MAPPINGS: {
  [key in -2 | 1 | 10 | 56 | 137 | 42161 | 8453]: string;
} = {
  8453: "base", // Base chain
  1: "ethereum",
  56: "smartchain",
  137: "polygon",
  42161: "arbitrum",
  10: "optimism",
  [-2]: "solana", // Use computed property syntax for negative numbers
} as const;

const CryptoAvatar = ({
  contractAddress,
  chain,
}: {
  contractAddress: string;
  chain: number;
}) => {
  const [logo, setLogo] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkImageExists = async (url: string): Promise<boolean> => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        return response.ok;
      } catch {
        return false;
      }
    };

    const generateFallbackAvatar = () => {
      const avatar = createAvatar(identicon, {
        seed: contractAddress,
        size: 48,
        backgroundColor: ["b6e3f4"],
      });
      return avatar.toDataUri();
    };

    const fetchLogo = async () => {
      setIsLoading(true);
      try {
        const chainName = CHAIN_MAPPINGS[chain as keyof typeof CHAIN_MAPPINGS];
        const trustWalletUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainName}/assets/${contractAddress}/logo.png`;
        if (await checkImageExists(trustWalletUrl)) {
          setLogo(trustWalletUrl);
          setIsLoading(false);
          return;
        }

        setLogo(generateFallbackAvatar());
      } catch (error) {
        console.error("Error fetching logo:", error);
        setLogo(generateFallbackAvatar());
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, [contractAddress, chain]);

  if (isLoading) {
    return <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />;
  }

  return (
    <div className="relative w-7 h-7">
      <Avatar className="w-7 h-7">
        <AvatarImage src={logo} />
      </Avatar>
    </div>
  );
};

export default CryptoAvatar;
