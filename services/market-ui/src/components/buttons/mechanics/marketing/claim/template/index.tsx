import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils, constants } from "ethers";

import { useMetamask, useSystemContract } from "@ethberry/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IClaim, IContract } from "@framework/types";
import { ClaimStatus, SystemModuleType } from "@framework/types";
import { convertDatabaseAssetToChainAsset } from "@framework/exchange";

import ExchangeClaimFacetClaimABI from "@framework/abis/json/ExchangeClaimFacet/claim.json";

export interface IClaimRedeemTemplateButtonProps {
  claim: IClaim;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ClaimRedeemTemplateButton: FC<IClaimRedeemTemplateButtonProps> = props => {
  const { claim, className, disabled, variant } = props;

  const metaFnWithContract = useSystemContract<IContract, SystemModuleType>(
    (values: IClaim, web3Context: Web3ContextType, systemContract: IContract) => {
      const contract = new Contract(
        systemContract.address,
        ExchangeClaimFacetClaimABI,
        web3Context.provider?.getSigner(),
      );

      const params = {
        externalId: values.id,
        expiresAt: Math.ceil(new Date(values.endTimestamp).getTime() / 1000),
        nonce: utils.arrayify(values.nonce),
        extra: utils.hexZeroPad(utils.hexlify(Math.ceil(new Date(values.endTimestamp).getTime() / 1000)), 32),
        receiver: values.merchant!.wallet,
        referrer: constants.AddressZero,
      };

      const items = convertDatabaseAssetToChainAsset(values.item?.components);

      return contract.claim(params, items, values.signature);
    },
  );

  const metaFn = useMetamask((values: IClaim, web3Context: Web3ContextType) => {
    return metaFnWithContract(SystemModuleType.EXCHANGE, values, web3Context);
  });

  const handleClick = () => {
    return metaFn(claim);
  };

  const endDate = new Date(claim.endTimestamp);
  const isExpired = endDate.getTime() !== new Date(0).getTime() && endDate.getTime() < new Date().getTime();

  return (
    <ListAction
      onClick={handleClick}
      icon={Redeem}
      message="form.tips.redeem"
      className={className}
      disabled={disabled || isExpired || claim.claimStatus !== ClaimStatus.NEW}
      dataTestId="ClaimRedeemTemplateButton"
      variant={variant}
    />
  );
};
