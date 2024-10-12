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
  tokens?: Array<{ tokenId: string }>;
  amount: string | number | bigint;
}

export const convertTemplateToChainAsset = (
  template?: ITemplateToAssetProps,
  amount: string | number | bigint = 1,
  multiplier: string | number | bigint = 1,
) => {
  let tokenId;

  if (template === undefined) {
    throw new Error("blockchainError");
  }

  if (template?.contract?.contractType === TokenType.NATIVE || template?.contract?.contractType === TokenType.ERC20) {
    tokenId = "0";
  } else if (
    template?.contract?.contractType === TokenType.ERC721 ||
    template?.contract?.contractType === TokenType.ERC998
  ) {
    tokenId = (template.id || 0).toString();
  } else if (template?.contract?.contractType === TokenType.ERC1155) {
    tokenId = template?.tokens?.[0]?.tokenId;
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
    amount: ((BigInt(amount) * BigInt(`${whole}${decimals}`)) / BigInt(10 ** decimals.length)).toString(),
  };
};

export const convertTemplateToTokenTypeAsset = (
  template?: ITemplateToAssetProps,
  amount?: string | number | bigint,
) => {
  const asset = convertTemplateToChainAsset(template, amount);

  return {
    ...asset,
    tokenType: Object.values(TokenType)[asset.tokenType],
  };
};
