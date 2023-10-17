import { FC } from "react";
import { Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { TokenType } from "@framework/types";
import type { ExchangeType, IAssetComponentHistory, IContract } from "@framework/types";

import { formatEther } from "../../../utils/money";
import {
  StyledAssetsWrapper,
  StyledDataViewAddressLinkWrapper,
  StyledDataViewItemWrapper,
  StyledTitle,
} from "./styled";

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
        return (
          <StyledDataViewAddressLinkWrapper key={`${asset.id}${asset.exchangeType}`}>
            <Link component={RouterLink} to={`/${contractType.toLowerCase()}/templates/${templateId}`}>
              {name}
            </Link>
            {` - `}
            <Link component={RouterLink} to={`/${contractType.toLowerCase()}/tokens/${tokenId as number}`}>
              #{tokenId}
            </Link>
          </StyledDataViewAddressLinkWrapper>
        );
      case TokenType.ERC998: {
        return (
          <StyledDataViewAddressLinkWrapper key={`${asset.id}${asset.exchangeType}`}>
            <Link component={RouterLink} to={`/${contractType.toLowerCase()}/templates/${templateId}`}>
              {name}
            </Link>
            {` - `}
            <Link component={RouterLink} to={`/${contractType.toLowerCase()}/tokens/${tokenId as number}`}>
              #{tokenId}
            </Link>
          </StyledDataViewAddressLinkWrapper>
        );
      }
      case TokenType.ERC1155:
        return (
          <StyledDataViewAddressLinkWrapper key={`${asset.id}${asset.exchangeType}`}>
            <Link component={RouterLink} to={`/${contractType.toLowerCase()}/templates/${templateId}`}>
              {name}
            </Link>
            {` - `}
            {amount}
          </StyledDataViewAddressLinkWrapper>
        );
      case TokenType.NATIVE:
      case TokenType.ERC20:
      default: {
        return (
          <StyledDataViewAddressLinkWrapper key={`${asset.id}${asset.exchangeType}`}>
            {formatEther(amount, token?.template?.contract?.decimals, token?.template?.contract?.symbol)}
          </StyledDataViewAddressLinkWrapper>
        );
      }
    }
  };

  return (
    <StyledDataViewItemWrapper>
      <StyledTitle>
        <FormattedMessage id={`enums.eventDataLabel.${type.toLowerCase()}`} />:
      </StyledTitle>

      <StyledAssetsWrapper>
        {assets.filter(({ exchangeType }) => exchangeType === type).map(mapAsset)}
      </StyledAssetsWrapper>
    </StyledDataViewItemWrapper>
  );
};
