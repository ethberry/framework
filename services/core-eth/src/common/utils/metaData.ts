import { BigNumber, ethers } from "ethers";
import { MetadataHash } from "@framework/types";
import { blockAwait } from "./blockAwait";

export const getMetadata = async function (
  tokenId: string,
  address: string,
  abi: any,
  provider: ethers.providers.JsonRpcProvider,
): Promise<Record<string, string>> {
  // todo error handling
  const contract = new ethers.Contract(address, abi, provider);
  await blockAwait(1, provider);
  const tokenMetaData = await contract.getTokenMetadata(tokenId);

  return tokenMetaData.reduce(
    (memo: Record<string, string>, current: { key: keyof typeof MetadataHash; value: string }) =>
      Object.assign(memo, {
        [MetadataHash[current.key]]: BigNumber.from(current.value).toString(),
      }),
    {} as Record<string, string>,
  ) as Record<string, string>;
};
