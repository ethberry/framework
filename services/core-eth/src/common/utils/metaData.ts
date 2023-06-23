import { ethers, stripZerosLeft, toUtf8String } from "ethers";

import { blockAwait } from "./blockAwait";
import { recursivelyDecodeResult } from "./decodeResult";

export const getMetadata = async function (
  tokenId: string,
  address: string,
  abi: any,
  provider: ethers.JsonRpcProvider,
): Promise<Record<string, string>> {
  // todo error handling
  const contract = new ethers.Contract(address, abi, provider);
  await blockAwait(1, provider);
  const tokenMetaData = recursivelyDecodeResult(await contract.getTokenMetadata(tokenId));

  return tokenMetaData.reduce(
    (memo: Record<string, string>, current: { key: string; value: string }) =>
      Object.assign(memo, {
        [toUtf8String(stripZerosLeft(current.key))]: current.value,
      }),
    {} as Record<string, string>,
  ) as Record<string, string>;
};
