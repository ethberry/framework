import type { IAssetComponent, IContract } from "@framework/types";
import { TokenType } from "@framework/types";
import { comparator } from "@ethberry/utils";

export const convertDatabaseAssetToChainAsset = (
  components: IAssetComponent[],
  multiplier?: string | number | bigint,
) => {
  return components
    .slice()
    .sort(comparator("id"))
    .map(item => convertTemplateToChainAsset(item.template, item.amount, multiplier));
};

// Same as convertDatabaseAssetToChainAsset
// But return tokenType: TokenType
export const convertDatabaseAssetToTokenTypeAsset = (
  components: IAssetComponent[],
  multiplier?: string | number | bigint,
) => {
  const assets = convertDatabaseAssetToChainAsset(components, multiplier);

  return assets.map(asset => {
    return {
      ...asset,
      tokenType: Object.values(TokenType)[asset.tokenType],
    };
  });
};

export interface ITemplateToAssetProps {
  contract?: IContract;
  id: number;
  tokens?: Array<{ tokenId: bigint }>;
  amount: bigint;
}

export const convertTemplateToChainAsset = (
  template?: ITemplateToAssetProps,
  amount = 1n,
  multiplier: string | number | bigint = 1,
) => {
  let tokenId;

  if (template === undefined) {
    throw new Error("blockchainError");
  }

  if (template?.contract?.contractType === TokenType.NATIVE || template?.contract?.contractType === TokenType.ERC20) {
    tokenId = 0n;
  } else if (
    template?.contract?.contractType === TokenType.ERC721 ||
    template?.contract?.contractType === TokenType.ERC998
  ) {
    tokenId = BigInt(template.id || 0);
  } else if (template?.contract?.contractType === TokenType.ERC1155) {
    tokenId = BigInt(template?.tokens?.[0]?.tokenId || 0);
    if (!tokenId) {
      // tokenId for ERC1155 notFound. You most likely forget to leftAndJoin Tokens for ERC1155
      throw new Error("blockchainError");
    }
  } else {
    throw new Error("blockchainError");
  }

  const [whole = "", decimals = ""] = multiplier.toString().split(".");

  return {
    tokenType: Object.values(TokenType).indexOf(template.contract.contractType),
    token: template.contract.address,
    tokenId,
    amount: (amount * BigInt(`${whole}${decimals}`)) / BigInt(10 ** decimals.length),
  };
};

export const convertTemplateToTokenTypeAsset = (template?: ITemplateToAssetProps, amount?: bigint) => {
  const asset = convertTemplateToChainAsset(template, amount);

  return {
    ...asset,
    tokenType: Object.values(TokenType)[asset.tokenType],
  };
};
