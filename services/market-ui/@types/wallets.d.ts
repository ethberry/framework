declare global {
  export interface Window {
    zeal: {
      _chainId: number;
      _selectedAddress: string;
    };
  }
}
export = zeal;
