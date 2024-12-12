/// <reference types="react" />

import { Eip1193Provider } from 'ethers'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }

  interface Window {
    ethereum?: Eip1193Provider & {
      isMetaMask?: boolean;
      on(event: string, listener: (payload: unknown[]) => void): void;
      removeListener(event: string, listener: (payload: unknown[]) => void): void;
    }
  }
} 