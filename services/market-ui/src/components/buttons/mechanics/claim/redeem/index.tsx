import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";

import { useMetamask, useSystemContract } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IClaim, IContract } from "@framework/types";
import { ClaimStatus, SystemModuleType, TokenType, ClaimType } from "@framework/types";

import ExchangeClaimFacetClaimABI from "@framework/abis/json/ExchangeClaimFacet/claim.json";
import ExchangeClaimFacetSpendABI from "@framework/abis/json/ExchangeClaimFacet/spend.json";

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
        claim.claimType === ClaimType.TOKEN ? ExchangeClaimFacetSpendABI : ExchangeClaimFacetClaimABI,
        web3Context.provider?.getSigner(),
      );

      const params = {
        externalId: values.id,
        expiresAt: Math.ceil(new Date(values.endTimestamp).getTime() / 1000),
        nonce: utils.arrayify(values.nonce),
        extra: utils.hexZeroPad(utils.hexlify(Math.ceil(new Date(values.endTimestamp).getTime() / 1000)), 32),
        receiver: values.merchant!.wallet,
        referrer: utils.hexZeroPad(utils.hexlify(Object.values(ClaimType).indexOf(values.claimType)), 20),
      };
      const item = values.item?.components
        .slice()
        .sort(sorter("id"))
        .map(component => ({
          tokenType: Object.values(TokenType).indexOf(component.tokenType),
          token: component.contract?.address,
          tokenId:
            values.claimType === ClaimType.TEMPLATE
              ? (component.templateId || 0).toString()
              : component.token!.tokenId.toString(), // suppression types check with 0
          amount: component.amount,
        }));

      return values.claimType === ClaimType.TEMPLATE
        ? (contract.claim(params, item, values.signature) as Promise<void>)
        : (contract.spend(params, item, values.signature) as Promise<void>);
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
