import { LoggerService } from "@nestjs/common";
import { Contract, JsonRpcProvider, stripZerosLeft, toUtf8String } from "ethers";

import { blockAwait } from "./blockAwait";
import { recursivelyDecodeResult } from "./decodeResult";

export const getMetadata = async function (
  tokenId: string,
  address: string,
  abi: any,
  provider: JsonRpcProvider,
  logger: LoggerService,
): Promise<Record<string, string>> {
  const contract = new Contract(address, abi, provider);

  try {
    await blockAwait(1, provider);
    const tokenMetaData = recursivelyDecodeResult(await contract.getTokenMetadata(tokenId));

    return tokenMetaData.reduce(
      (memo: Record<string, string>, current: { key: string; value: string }) =>
        Object.assign(memo, {
          [toUtf8String(stripZerosLeft(current.key))]: current.value,
        }),
      {} as Record<string, string>,
    ) as Record<string, string>;
  } catch (e) {
    logger.error("metadataNotFound", tokenId, address);
    return { "": "" };
  }
};
