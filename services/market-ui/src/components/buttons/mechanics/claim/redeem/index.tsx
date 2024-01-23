import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import { useMetamask, useSystemContract } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IClaim, IContract } from "@framework/types";
import { ClaimStatus, SystemModuleType, TokenType, ClaimType } from "@framework/types";

import ClaimABI from "@framework/abis/claim/ExchangeClaimFacet.json";
import SpendABI from "@framework/abis/spend/ExchangeClaimFacet.json";

import { sorter } from "../../../../../utils/sorter";

export interface IClaimRedeemButtonProps {
  claim: IClaim;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ClaimRedeemButton: FC<IClaimRedeemButtonProps> = props => {
  const { claim, className, disabled, variant } = props;

  const metaFnWithContract = useSystemContract<IContract, SystemModuleType>(
    (values: IClaim, web3Context: Web3ContextType, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        claim.claimType === ClaimType.TOKEN ? ClaimABI : SpendABI,
        web3Context.provider?.getSigner(),
      );

      console.log("values", values);

      return contract.claim(
        {
          externalId: values.id,
          expiresAt: Math.ceil(new Date(values.endTimestamp).getTime() / 1000),
          nonce: utils.arrayify(values.nonce),
          extra: utils.hexZeroPad(utils.hexlify(Math.ceil(new Date(values.endTimestamp).getTime() / 1000)), 32),
          receiver: values.merchant!.wallet,
          referrer: utils.hexZeroPad(utils.hexlify(Object.values(ClaimType).indexOf(values.claimType)), 20),
        },
        values.item?.components.sort(sorter("id")).map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract?.address,
          tokenId: (component.templateId || 0).toString(), // suppression types check with 0
          amount: component.amount,
        })),
        values.signature,
      ) as Promise<void>;
    },
  );

  const metaFn = useMetamask((values: IClaim, web3Context: Web3ContextType) => {
    return metaFnWithContract(SystemModuleType.EXCHANGE, values, web3Context);
  });

  const handleClick = () => {
    return metaFn(claim);
  };

  const date = new Date();

  return (
    <ListAction
      onClick={handleClick}
      icon={Redeem}
      message="form.tips.redeem"
      className={className}
      disabled={disabled || claim.claimStatus !== ClaimStatus.NEW || new Date(claim.endTimestamp) > date}
      dataTestId="ClaimRedeemButton"
      variant={variant}
    />
  );
};
