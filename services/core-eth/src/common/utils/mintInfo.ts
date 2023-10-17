import { Log } from "ethers";

import { ContractEventSignature, TokenMintType } from "@framework/types";
import { keccak256It } from "./ethLogs";

export const getTokenMintType = (logs: Array<Log>): TokenMintType => {
  const txTopicData = logs.map(log => ({ topics: log.topics, data: log.data }));
  return txTopicData.filter(log => log.topics.includes(keccak256It(ContractEventSignature.MintRandom))).length
    ? TokenMintType.MintRandom
    : TokenMintType.MintCommon;
};
