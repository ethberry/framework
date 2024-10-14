import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";

import { useMetamask, useSystemContract } from "@ethberry/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IClaim, IContract } from "@framework/types";
import { ClaimStatus, ClaimType, SystemModuleType, TokenType } from "@framework/types";

import ExchangeClaimFacetSpendABI from "@framework/abis/json/ExchangeClaimFacet/spend.json";

export interface IClaimRedeemTokenButtonProps {
  claim: IClaim;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ClaimRedeemTokenButton: FC<IClaimRedeemTokenButtonProps> = props => {
  const { claim, className, disabled, variant } = props;

  const metaFnWithContract = useSystemContract<IContract, SystemModuleType>(
    (values: IClaim, web3Context: Web3ContextType, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        ExchangeClaimFacetSpendABI,
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

      const items = values.item.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.template!.contract!.address,
        tokenId: component.token!.tokenId.toString(),
        amount: component.amount,
      }));

      return contract.spend(params, items, values.signature);
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
      dataTestId="ClaimRedeemTokenButton"
      variant={variant}
    />
  );
};
