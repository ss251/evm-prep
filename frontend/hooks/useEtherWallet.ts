// frontend/hooks/useEtherWallet.ts
import { useCallback, useEffect, useState } from 'react'
import { ethers, Contract, JsonRpcSigner } from 'ethers'
import { ETHERWALLET_ABI, ETHERWALLET_ADDRESS } from '@/abi/EtherWallet.sol/EtherWallet'

export function useEtherWallet() {
  const [contract, setContract] = useState<Contract | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [owner, setOwner] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize provider and signer
  const initProvider = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error('No ethereum provider found')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const newSigner = await provider.getSigner()
      
      return newSigner
    } catch (err) {
      console.error('Provider initialization error:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize provider')
      return null
    }
  }, [])

  // Initialize contract
  const initContract = useCallback(async (signer: JsonRpcSigner) => {
    try {
      const newContract = new Contract(
        ETHERWALLET_ADDRESS,
        ETHERWALLET_ABI.abi,
        signer
      )
      setContract(newContract)
      return newContract
    } catch (err) {
      console.error('Contract initialization error:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize contract')
      return null
    }
  }, [])

  // Fetch contract data
  const fetchContractData = useCallback(async (contract: Contract) => {
    try {
      const [balanceResult, ownerResult] = await Promise.all([
        contract.getBalance(),
        contract.owner()
      ])
      
      setBalance(balanceResult.toString())
      setOwner(ownerResult)
      setError(null)
    } catch (err) {
      console.error('Data fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch contract data')
    }
  }, [])

  // Initialize everything
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true)
        const newSigner = await initProvider()
        if (!newSigner) return

        const newContract = await initContract(newSigner)
        if (!newContract) return

        await fetchContractData(newContract)
        setIsInitialized(true)
      } catch (err) {
        console.error('Initialization error:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize')
      } finally {
        setIsLoading(false)
      }
    }

    init()

    // Setup account change listener
    const ethereum = window.ethereum
    if (ethereum) {
      ethereum.on('accountsChanged', init)
      return () => {
        ethereum.removeListener('accountsChanged', init)
      }
    }
  }, [initProvider, initContract, fetchContractData])

  // Withdraw function
  const withdraw = useCallback(async (amount: string) => {
    if (!contract || !isInitialized) {
      throw new Error('Contract not initialized')
    }
    
    try {
      setIsLoading(true)
      setError(null)
      const tx = await contract.withdraw(ethers.parseEther(amount))
      await tx.wait()
      await fetchContractData(contract)
    } catch (err) {
      console.error('Withdrawal error:', err)
      setError(err instanceof Error ? err.message : 'Transaction failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [contract, isInitialized, fetchContractData])

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!contract || !isInitialized) return
    try {
      await fetchContractData(contract)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh balance')
    }
  }, [contract, isInitialized, fetchContractData])

  return {
    contract,
    balance,
    owner,
    isLoading,
    error,
    isInitialized,
    withdraw,
    refreshBalance
  }
}