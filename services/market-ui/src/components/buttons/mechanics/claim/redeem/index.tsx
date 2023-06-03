import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Redeem } from "@mui/icons-material";
import { constants, Contract, utils } from "ethers";
import { useIntl } from "react-intl";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ClaimStatus, IClaim, TokenType } from "@framework/types";

import ClaimABI from "../../../../../abis/mechanics/claim/redeem/claim.abi.json";
import { sorter } from "../../../../../utils/sorter";

export interface IClaimRedeemButtonProps {
  claim: IClaim;
}

export const ClaimRedeemButton: FC<IClaimRedeemButtonProps> = props => {
  const { claim } = props;

  const { formatMessage } = useIntl();

  const metaRedeem = useMetamask((claim: IClaim, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.EXCHANGE_ADDR, ClaimABI, web3Context.provider?.getSigner());
    return contract.claim(
      {
        nonce: utils.arrayify(claim.nonce),
        externalId: claim.id,
        expiresAt: Math.ceil(new Date(claim.endTimestamp).getTime() / 1000),
        referrer: constants.AddressZero,
        extra: utils.formatBytes32String("0x"),
      },
      claim.item?.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId:
          component.contract!.contractType === TokenType.ERC1155
            ? component.template!.tokens![0].tokenId
            : (component.templateId || 0).toString(), // suppression types check with 0
        amount: component.amount,
      })),
      claim.signature,
    ) as Promise<void>;
  });

  const handleClick = () => {
    return metaRedeem(claim);
  };

  return (
    <Tooltip title={formatMessage({ id: "form.tips.redeem" })}>
      <IconButton
        onClick={handleClick}
        disabled={claim.claimStatus !== ClaimStatus.NEW}
        data-testid="ClaimRedeemButton"
      >
        <Redeem />
      </IconButton>
    </Tooltip>
  );
};
