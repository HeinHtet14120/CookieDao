"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function TokenSwap() {
  const [inputToken, setInputToken] = useState("")
  const [outputToken, setOutputToken] = useState("")
  const [amount, setAmount] = useState("")
  const [loading] = useState(false)
  // const [quote] = useState(null)
  // const [gasFee] = useState(null)

  // Placeholder functions
  const executeSwap = () => {}
  const SOL_MINT = "SOL"
  const USDC_MINT = "USDC"

  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center relative">
      <div className="absolute inset-0 backdrop-blur-sm z-10"></div>
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-black bg-opacity-80 border border-[#38444D] rounded-2xl p-8 shadow-lg max-w-sm w-full mx-4">
          <h2 className="text-3xl font-bold text-[#1DA1F2] text-center mb-4">Coming Soon</h2>
          <p className="text-[#8899A6] text-center text-lg">
            We&#39;re working hard to bring you the Token Swap feature. Stay tuned for updates!
          </p>
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center px-4 py-2 border border-[#1DA1F2] rounded-full text-[#1DA1F2]">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#1DA1F2]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              In Development
            </div>
          </div>
        </div>
      </div>
      <Card className="w-full max-w-md p-6 bg-[#15202B] border border-[#38444D] rounded-2xl shadow-lg relative">
        <div className="pointer-events-none opacity-50">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">Token Swap</h1>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[#8899A6] font-medium">Swap From:</label>
              <Select value={inputToken} onValueChange={setInputToken} disabled>
                <SelectTrigger className="w-full bg-[#192734] border-[#38444D] text-white">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent className="bg-[#192734] border-[#38444D]">
                  <SelectItem value={SOL_MINT}>SOL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[#8899A6] font-medium">Swap To:</label>
              <Select value={outputToken} onValueChange={setOutputToken} disabled>
                <SelectTrigger className="w-full bg-[#192734] border-[#38444D] text-white">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent className="bg-[#192734] border-[#38444D]">
                  <SelectItem value={USDC_MINT}>USDC</SelectItem>
                  <SelectItem value={SOL_MINT}>SOL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[#8899A6] font-medium">Amount:</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#192734] border-[#38444D] text-white placeholder-[#8899A6]"
                placeholder="Enter amount"
                disabled
              />
            </div>

            {/*{quote && (*/}
            {/*  <div className="space-y-2 p-4 bg-[#192734] rounded-lg border border-[#38444D]">*/}
            {/*    <p className="text-[#8899A6]">*/}
            {/*      Expected Output:{" "}*/}
            {/*      <span className="font-medium text-white">*/}
            {/*        {(quote.outAmount / 1e6).toFixed(6)} {outputToken === USDC_MINT ? "USDC" : "SOL"}*/}
            {/*      </span>*/}
            {/*    </p>*/}
            {/*    <p className="text-[#8899A6]">*/}
            {/*      Price Impact:{" "}*/}
            {/*      <span className="font-medium text-white">{(quote.priceImpactPct * 100).toFixed(2)}%</span>*/}
            {/*    </p>*/}
            {/*    <p className="text-[#8899A6]">*/}
            {/*      Gas Fee:{" "}*/}
            {/*      <span className="font-medium text-white">*/}
            {/*        {gasFee ? `${gasFee.toFixed(6)} SOL` : "Calculating..."}*/}
            {/*      </span>*/}
            {/*    </p>*/}
            {/*  </div>*/}
            {/*)}*/}

            <Button
              onClick={executeSwap}
              disabled={true}
              className="w-full bg-[#1DA1F2] hover:bg-[#1A91DA] text-white font-bold py-3 rounded-full transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Swapping..." : "Swap"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

