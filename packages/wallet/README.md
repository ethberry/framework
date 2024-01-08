# Wallet provider and widget

## Provider

```tsx
<GemunionThemeProvider>
  <LocalizationProvider>
    <SnackbarProvider>
      <PopupProvider>
        <WalletProvider>
          <Wallet />
        </WalletProvider>
      </PopupProvider>
    </SnackbarProvider>
  </LocalizationProvider>
</GemunionThemeProvider>
```

## Webpack

```ts
const config: Configuration = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    modules: ["node_modules"],
    fallback: {
      // assert: require.resolve("assert/"),
      path: require.resolve("path-browserify"),
      // stream: require.resolve("stream-browserify"),
      // os: require.resolve("os-browserify/browser"),
      // crypto: require.resolve("crypto-browserify"),
      // buffer: require.resolve("buffer/"),
      // process: require.resolve("process/browser"),
      // https: require.resolve("https-browserify"),
      // http: require.resolve("stream-http"),
    },
  },
  plugins: [
    new ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ],
};
```

## package.json

```json
{
  "dependencies": {
    "@gemunion/provider-network": "0.0.3",
    "@web3-react/core": "6.1.9",
    "@web3-react/injected-connector": "6.0.7",
    "@web3-react/trezor-connector": "6.1.9",
    "@web3-react/walletconnect-connector": "6.2.8",
    "@web3-react/ledger-connector": "6.1.9",
    "@web3-react/fortmatic-connector": "6.1.6",
    "@web3-react/portis-connector": "6.1.9",
    "@web3-react/torus-connector": "6.1.9",
    "@web3-react/magic-connector": "6.1.9",
    "@web3-react/authereum-connector": "6.2.0",
    "ethers": "5.5.2"
  },
  "devDependencies": {
    "os-browserify": "0.3.0",
    "stream-browserify": "3.0.0",
    "path-browserify": "1.0.1",
    "assert": "2.0.0",
    "crypto-browserify": "3.12.0",
    "buffer": "6.0.3",
    "process": "0.11.10",
    "stream-http": "3.2.0",
    "https-browserify": "1.0.0"
  }
}
```
