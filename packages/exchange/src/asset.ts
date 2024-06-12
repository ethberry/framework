import { IAssetComponent, ITemplate, TokenType } from "@framework/types";
import { sorter } from "./sorter";
import { BigNumber, BigNumberish } from "ethers";

interface IOptions {
  sortBy?: string;
  multiplier?: BigNumberish;
}

export const convertDatabaseAssetToChainAsset = (components: IAssetComponent[], options: IOptions = {}) => {
  const { sortBy = "id", multiplier = 1n } = options;

  return components
    .slice()
    .sort(sorter(sortBy))
    .map(item => {
      let tokenId;
      if (item?.contract?.contractType === TokenType.ERC1155) {
        tokenId = item.template?.tokens?.[0]?.tokenId;
        if (!tokenId) {
          throw new Error("[DEV] tokenId for ERC1155 notFound. You rather forget to leftAndJoin tokens for ERC1155");
        }
      } else if ([TokenType.NATIVE, TokenType.ERC20].includes(item?.contract?.contractType as TokenType)) {
        tokenId = "0";
      } else {
        tokenId = (item.templateId || 0).toString();
      }

      const amount = BigNumber.from(item.amount).mul(multiplier).toString();

      return {
        tokenType: Object.values(TokenType).indexOf(item.tokenType),
        token: item.contract!.address,
        tokenId,
        amount,
      };
    });
};

// Same as convertDatabaseAssetToChainAsset
// But return tokenType: TokenType
export const convertDatabaseAssetToTokenTypeAsset = (components: IAssetComponent[], options: IOptions = {}) => {
  const assets = convertDatabaseAssetToChainAsset(components, options);

  return assets.map(asset => {
    return {
      ...asset,
      tokenType: Object.values(TokenType)[asset.tokenType],
    };
  });
};

export const convertTemplateToChainAsset = (template: ITemplate, amount?: BigNumberish) => {
  let tokenId;
  if (template?.contract?.contractType === TokenType.ERC1155) {
    tokenId = template?.tokens?.[0]?.tokenId;
    if (!tokenId) {
      throw new Error("[DEV] tokenId for ERC1155 notFound. You rather forget to leftAndJoin tokens for ERC1155");
    }
  } else if ([TokenType.NATIVE, TokenType.ERC20].includes(template?.contract?.contractType as TokenType)) {
    tokenId = "0";
  } else {
    tokenId = (template.id || 0).toString();
  }

  return {
    tokenType: Object.values(TokenType).indexOf(template.contract!.contractType!),
    token: template.contract!.address,
    tokenId,
    amount: amount || template.amount,
  };
};
