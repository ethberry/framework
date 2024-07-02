import { FC, useEffect, useState } from "react";
import { PauseCircleOutline } from "@mui/icons-material";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractFeatures } from "@framework/types";

import pausePausableABI from "@framework/abis/pause/PausableFacet.json";

import { shouldDisableByContractType } from "../../../utils";
import { useCheckPermissions } from "../../../../../utils/use-check-permissions";

export interface IPauseButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const PauseButton: FC<IPauseButtonProps> = props => {
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

  const metaPause = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, pausePausableABI, web3Context.provider?.getSigner());
    return contract.pause() as Promise<void>;
  });

  const handlePause = () => {
    return metaPause();
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

  if (!contractFeatures.includes(ContractFeatures.PAUSABLE) || isPaused) {
    return null;
  }

  return (
    <ListAction
      onClick={handlePause}
      icon={PauseCircleOutline}
      message="form.buttons.pause"
      className={className}
      dataTestId="PauseButton"
      disabled={disabled || shouldDisableByContractType(contract) || !hasAccess}
      variant={variant}
    />
  );
};
