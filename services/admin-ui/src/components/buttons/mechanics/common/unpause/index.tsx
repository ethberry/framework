import { FC, useEffect, useState } from "react";
import { PlayCircleOutline } from "@mui/icons-material";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractFeatures } from "@framework/types";

import unpausePausableABI from "@framework/abis/unpause/Pausable.json";

import { shouldDisableByContractType } from "../../../utils";
import { useCheckPermissions } from "../../../../../utils/use-check-permissions";

export interface IUnPauseButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const UnPauseButton: FC<IUnPauseButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, isPaused, contractFeatures },
    disabled,
    variant,
  } = props;

  const [hasAccess, setHasAccess] = useState(false);

  const { account = "" } = useWeb3React();

  const { checkPermissions } = useCheckPermissions();

  const metaUnPause = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, unpausePausableABI, web3Context.provider?.getSigner());
    return contract.unpause() as Promise<void>;
  });

  const handleUnPause = () => {
    return metaUnPause();
  };

  useEffect(() => {
    if (account) {
      void checkPermissions({
        account,
        address,
        role: AccessControlRoleType.PAUSER_ROLE,
      }).then((json: { hasRole: boolean }) => {
        setHasAccess(json?.hasRole);
      });
    }
  }, [account]);

  if (!contractFeatures.includes(ContractFeatures.PAUSABLE) || !isPaused) {
    return null;
  }

  return (
    <ListAction
      onClick={handleUnPause}
      icon={PlayCircleOutline}
      message="form.buttons.unpause"
      className={className}
      dataTestId="UnPauseButton"
      disabled={disabled || shouldDisableByContractType(contract) || !hasAccess}
      variant={variant}
    />
  );
};
