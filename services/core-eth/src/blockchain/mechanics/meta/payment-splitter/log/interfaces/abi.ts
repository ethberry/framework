import { Interface } from "ethers";

import PaymentSplitterSol from "@framework/core-contracts/artifacts/@gemunion/contracts-finance/contracts/PaymentSplitter.sol/PaymentSplitter.json";

export const ABI = new Interface(PaymentSplitterSol.abi);
