// config/index.tsx

import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia, arbitrumSepolia, baseSepolia, optimismSepolia, polygonAmoy } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = 'c0e27fba70fa30694729c2e3d61a7fb3'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [sepolia, arbitrumSepolia, baseSepolia, optimismSepolia, polygonAmoy]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig