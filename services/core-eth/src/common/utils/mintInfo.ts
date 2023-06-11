import { Log } from "ethers";

import { EventSignatureHash, TokenMintType } from "@framework/types";

export const getTokenMintType = (logs: Array<Log>): TokenMintType => {
  const txTopicData = logs.map(log => ({ topics: log.topics, data: log.data }));
  return txTopicData.filter(log => log.topics.includes(EventSignatureHash.MintRandom)).length
    ? TokenMintType.MintRandom
    : TokenMintType.MintCommon;
};
