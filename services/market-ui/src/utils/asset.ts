import { IAssetComponent, TokenType } from "@framework/types";
import { sorter } from "./sorter";

interface IOptions {
  sortBy?: string;
}

export const convertAssetComponentsToAssets = (components: IAssetComponent[], options: IOptions = {}) => {
  const { sortBy = "id" } = options;

  return components.sort(sorter(sortBy)).map(item => {
    let tokenId;
    if (item?.contract?.contractType === TokenType.ERC1155) {
      tokenId = item.template?.tokens?.[0]?.tokenId;
    } else if ([TokenType.NATIVE, TokenType.NATIVE].includes(item?.contract?.contractType as TokenType)) {
      tokenId = "0";
    } else {
      tokenId = (item.templateId || 0).toString();
    }

    return {
      tokenType: Object.values(TokenType).indexOf(item.tokenType),
      token: item.contract!.address,
      tokenId,
      amount: item.amount,
    };
  });
};
