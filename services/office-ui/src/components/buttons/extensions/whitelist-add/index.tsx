import { FC, Fragment, useState } from "react";
import { CheckCircle } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@ethberry/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractFeatures } from "@framework/types";

import WhitelistABI from "@framework/abis/json/ERC20Whitelist/whitelist.json";

import { AccountDialog, IAccountDto } from "../../../dialogs/account";
import { shouldDisableByContractType } from "../../utils";
import { useSetButtonPermission } from "../../../../shared";

export interface IWhitelistButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const WhitelistButton: FC<IWhitelistButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractFeatures },
    disabled,
    variant,
  } = props;

  const [isWhitelistDialogOpen, setIsWhitelistDialogOpen] = useState(false);

  const { hasPermission } = useSetButtonPermission(AccessControlRoleType.DEFAULT_ADMIN_ROLE, contract?.id);

  const handleWhitelist = (): void => {
    setIsWhitelistDialogOpen(true);
  };

  const handleWhitelistCancel = (): void => {
    setIsWhitelistDialogOpen(false);
  };

  const metaFn = useMetamask((values: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, WhitelistABI, web3Context.provider?.getSigner());
    return contract.whitelist(values.account) as Promise<void>;
  });

  const handleWhitelistConfirmed = async (values: IAccountDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsWhitelistDialogOpen(false);
    });
  };

  if (!contractFeatures.includes(ContractFeatures.WHITELIST)) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleWhitelist}
        icon={CheckCircle}
        message="form.buttons.whitelist"
        className={className}
        dataTestId="WhitelistButton"
        disabled={disabled || shouldDisableByContractType(contract) || !hasPermission}
        variant={variant}
      />
      <AccountDialog
        onCancel={handleWhitelistCancel}
        onConfirm={handleWhitelistConfirmed}
        open={isWhitelistDialogOpen}
        message="dialogs.whitelist"
        testId="AccessListWhitelistForm"
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
