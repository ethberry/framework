import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { IClaim, TokenType } from "@framework/types";

import ClaimABI from "../../../../../abis/mechanics/claim/redeem/claim.abi.json";

import { sorter } from "../../../../../utils/sorter";

export interface IClaimRedeemButtonProps {
  claim: IClaim;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ClaimRedeemButton: FC<IClaimRedeemButtonProps> = props => {
  const { claim, className, disabled, variant } = props;

  const metaRedeem = useMetamask((claim: IClaim, web3Context: Web3ContextType) => {
    const contract = new Contract(process.env.EXCHANGE_ADDR, ClaimABI, web3Context.provider?.getSigner());

    return contract.claim(
      {
        externalId: claim.id,
        expiresAt: Math.ceil(new Date(claim.endTimestamp).getTime() / 1000),
        nonce: utils.arrayify(claim.nonce),
        extra: utils.hexZeroPad(utils.hexlify(Math.ceil(new Date(claim.endTimestamp).getTime() / 1000)), 32),
        receiver: claim.merchant!.wallet,
        referrer: constants.AddressZero,
      },
      claim.item?.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract?.address,
        tokenId: (component.templateId || 0).toString(), // suppression types check with 0
        amount: component.amount,
      })),
      claim.signature,
    ) as Promise<void>;
  });

  const handleClick = () => {
    return metaRedeem(claim);
  };

  return (
    <ListAction
      onClick={handleClick}
      icon={Redeem}
      message="form.tips.redeem"
      className={className}
      disabled={disabled}
      dataTestId="ClaimRedeemButton"
      variant={variant}
    />
  );
};
