// frontend/app/contracts/ether-wallet/page.tsx
import EtherWalletContract from '@/components/contracts/EtherWallet'

export default function EtherWalletPage() {
  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Ether Wallet</h1>
        <EtherWalletContract />
      </div>
    </div>
  )
}