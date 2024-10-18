import { Interface } from "ethers";

import PaymentSplitterSol from "@framework/core-contracts/artifacts/contracts/Mechanics/SplitterWallet/SplitterWallet.sol/SplitterWallet.json";

export const PaymentSplitterABI = new Interface(PaymentSplitterSol.abi);
