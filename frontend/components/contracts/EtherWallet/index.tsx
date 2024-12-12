// frontend/components/contracts/EtherWallet/index.tsx
'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { useEtherWallet } from '@/hooks/useEtherWallet'
import { ETHERWALLET_ADDRESS } from '@/abi/EtherWallet.sol/EtherWallet'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function EtherWalletContract() {
  const [amount, setAmount] = useState('')
  const { balance, owner, isLoading, error, isInitialized, withdraw } = useEtherWallet()

  const handleWithdraw = async () => {
    try {
      await withdraw(amount)
      setAmount('')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isInitialized ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Initializing contract...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Contract Info</CardTitle>
              <CardDescription>View contract details and balance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <span className="font-medium">Address:</span>
                <span className="col-span-2 font-mono break-all">{ETHERWALLET_ADDRESS}</span>
                
                <span className="font-medium">Owner:</span>
                <span className="col-span-2 font-mono break-all">{owner}</span>
                
                <span className="font-medium">Balance:</span>
                <span className="col-span-2">
                  {ethers.formatEther(balance || '0')} ETH
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Withdraw ETH</CardTitle>
              <CardDescription>Withdraw ETH from the contract (owner only)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount in ETH"
                />
                <Button 
                  onClick={handleWithdraw}
                  disabled={isLoading || !amount}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    'Withdraw'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send ETH to Contract</CardTitle>
              <CardDescription>Instructions for sending ETH</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  To send ETH to this contract, simply send it to the contract address above 
                  using your wallet or any other service that can send ETH.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}