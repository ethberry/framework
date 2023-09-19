import { FC } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { constants, Contract, utils } from "ethers";

import { useMetamask, useSystemContract } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { IClaim, IContract, SystemModuleType, TokenType } from "@framework/types";

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

  const metaFnWithContract = useSystemContract<IContract, SystemModuleType>(
    (values: IClaim, web3Context: Web3ContextType, systemContract: IContract) => {
      const contract = new Contract(systemContract.address, ClaimABI, web3Context.provider?.getSigner());

      return contract.claim(
        {
          externalId: values.id,
          expiresAt: Math.ceil(new Date(values.endTimestamp).getTime() / 1000),
          nonce: utils.arrayify(values.nonce),
          extra: utils.hexZeroPad(utils.hexlify(Math.ceil(new Date(values.endTimestamp).getTime() / 1000)), 32),
          receiver: values.merchant!.wallet,
          referrer: constants.AddressZero,
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
