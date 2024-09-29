import type { IAssetComponent, IContract } from "@framework/types";
import { TokenType } from "@framework/types";
import { comparator } from "@ethberry/utils";
import { BigNumber, BigNumberish } from "ethers";

interface IOptions {
  sortBy?: string;
  multiplier?: BigNumberish;
}

export const convertDatabaseAssetToChainAsset = (components?: IAssetComponent[], options: IOptions = {}) => {
  const { sortBy = "id" } = options;
  const { multiplier = 1 } = options;

  if (components === undefined) {
    throw new Error("blockchainError");
  }

  return components
    .slice()
    .sort(comparator(sortBy))
    .map(item => {
      let tokenId;
      if (item?.contract?.contractType === TokenType.NATIVE || item?.contract?.contractType === TokenType.ERC20) {
        tokenId = "0";
      } else if (
        item?.contract?.contractType === TokenType.ERC721 ||
        item?.contract?.contractType === TokenType.ERC998
      ) {
        tokenId = (item.templateId || 0).toString();
      } else if (item?.contract?.contractType === TokenType.ERC1155) {
        tokenId = item.template?.tokens?.[0]?.tokenId;
        if (!tokenId) {
          // tokenId for ERC1155 notFound. You most likely forget to leftAndJoin Tokens for ERC1155
          throw new Error("blockchainError");
        }
      } else {
        throw new Error("blockchainError");
      }

      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const [whole = "", decimals = ""] = multiplier.toString().split(".");

      const amount = BigNumber.from(item.amount)
        .mul(`${whole}${decimals}`) // multipler (multiplier * 10 ** decimals)
        .div(BigNumber.from(10).pow(decimals.length)) // div 10 ** decimals
        .toString();

      return {
        tokenType: Object.values(TokenType).indexOf(item.tokenType),
        token: item.contract.address,
        tokenId,
        amount,
      };
    });
};

// Same as convertDatabaseAssetToChainAsset
// But return tokenType: TokenType
export const convertDatabaseAssetToTokenTypeAsset = (components?: IAssetComponent[], options: IOptions = {}) => {
  const assets = convertDatabaseAssetToChainAsset(components, options);

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
  amount: BigNumberish;
}

export const convertTemplateToChainAsset = (
  template?: ITemplateToAssetProps,
  amount: BigNumberish = "1" as BigNumberish,
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
      throw new Error();
    }
  } else {
    throw new Error("blockchainError");
  }

  return {
    tokenType: Object.values(TokenType).indexOf(template.contract.contractType),
    token: template.contract.address,
    tokenId,
    amount,
  };
};

export const convertTemplateToTokenTypeAsset = (template?: ITemplateToAssetProps, amount?: BigNumberish) => {
  const asset = convertTemplateToChainAsset(template, amount);

  return {
    ...asset,
    tokenType: Object.values(TokenType)[asset.tokenType],
  };
};
