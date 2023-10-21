import { Interface } from "ethers";

import PaymentSplitterSol from "@framework/core-contracts/artifacts/@gemunion/contracts-utils/contracts/contracts/PaymentSplitter.sol/PaymentSplitter.json";

export const ABI = new Interface(PaymentSplitterSol.abi);
