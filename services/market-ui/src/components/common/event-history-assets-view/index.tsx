import { FC } from "react";
import { Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { TokenType } from "@framework/types";
import type { ExchangeType, IAssetComponentHistory, IContract } from "@framework/types";

import { formatEther } from "../../../utils/money";
import { AssetsWrapper, DataViewAddressLinkWrapper, DataViewItemWrapper } from "./styled";

export interface ITokenLinkProps {
  assets: Array<IAssetComponentHistory>;
  contract: IContract;
  type: ExchangeType;
}

export const AssetsView: FC<ITokenLinkProps> = props => {
  const { assets, type } = props;

  const mapAsset = (asset: IAssetComponentHistory) => {
    const { amount, token, tokenId } = asset;

    const name = token?.template?.title;
    const contractType = token?.template?.contract?.contractType;
    const templateId = token?.templateId || 0;

    switch (contractType) {
      case TokenType.ERC721:
      case TokenType.ERC998: {
        return (
          <DataViewAddressLinkWrapper key={asset.id}>
            <Link component={RouterLink} to={`/${contractType.toLowerCase()}/templates/${templateId}`}>
              {name}
            </Link>
            {` - `}
            <Link component={RouterLink} to={`/${contractType.toLowerCase()}/tokens/${tokenId as number}`}>
              #{tokenId}
            </Link>
          </DataViewAddressLinkWrapper>
        );
      }
      case TokenType.ERC1155:
        return (
          <DataViewAddressLinkWrapper key={asset.id}>
            <Link component={RouterLink} to={`/${contractType.toLowerCase()}/templates/${templateId}`}>
              {name}
            </Link>
            {` - `}
            {amount}
          </DataViewAddressLinkWrapper>
        );
      case TokenType.NATIVE:
      case TokenType.ERC20:
      default: {
        return (
          <DataViewAddressLinkWrapper>
            {formatEther(amount, token?.template?.contract?.decimals, token?.template?.contract?.symbol)}
          </DataViewAddressLinkWrapper>
        );
      }
    }
  };

  return (
    <DataViewItemWrapper>
      <Typography fontWeight={500}>
        <FormattedMessage id={`enums.eventDataLabel.${type.toLowerCase()}`} />:
      </Typography>

      <AssetsWrapper>{assets.filter(({ exchangeType }) => exchangeType === type).map(mapAsset)}</AssetsWrapper>
    </DataViewItemWrapper>
  );
};
