import { Interface } from "ethers";

import PaymentSplitterSol from "@framework/core-contracts/artifacts/@ethberry/contracts-finance/contracts/PaymentSplitter.sol/PaymentSplitter.json";

export const PaymentSplitterABI = new Interface(PaymentSplitterSol.abi);
