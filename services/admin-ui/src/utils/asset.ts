import { IAssetComponent, TokenType } from "@framework/types";

export const convertAssetComponentsToAssets = (components: IAssetComponent[]) => {
  return components.map(item => {
    let tokenId;
    if (item?.contract?.contractType === TokenType.ERC1155) {
      tokenId = item.template?.tokens?.[0]?.tokenId;
    } else {
      tokenId = item.templateId;
    }

    return {
      tokenType: Object.values(TokenType).indexOf(item.tokenType),
      token: item.contract!.address,
      tokenId,
      amount: item.amount,
    };
  });
};
