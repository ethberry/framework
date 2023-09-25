export const myDBConfig = {
  name: "FrameworkDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "txs",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "txHash", keypath: "txHash", options: { unique: false } },
        { name: "txType", keypath: "txType", options: { unique: false } },
      ],
    },
  ],
};
