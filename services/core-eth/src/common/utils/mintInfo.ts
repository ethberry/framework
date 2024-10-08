import { Log, keccak256, toUtf8Bytes } from "ethers";

import { Erc721EventSignature, TokenMintType } from "@framework/types";

export const getTokenMintType = (logs: Array<Log>): TokenMintType => {
  const txTopicData = logs.map(log => ({ topics: log.topics, data: log.data }));
  return txTopicData.filter(log => log.topics.includes(keccak256(toUtf8Bytes(Erc721EventSignature.MintRandom)))).length
    ? TokenMintType.MintRandom
    : TokenMintType.MintCommon;
};
