import { FC, Fragment, useState } from "react";
import { DoNotDisturbOn } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractFeatures } from "@framework/types";

import blacklistERC1155BlacklistABI from "@framework/abis/json/ERC1155Blacklist/blacklist.json";

import { AccountDialog, IAccountDto } from "../../../dialogs/account";
import { shouldDisableByContractType } from "../../utils";
import { useSetButtonPermission } from "../../../../shared";

export interface IBlacklistButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
  permissionRole?: AccessControlRoleType;
}

export const BlacklistButton: FC<IBlacklistButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractFeatures },
    disabled,
    variant,
    permissionRole = AccessControlRoleType.DEFAULT_ADMIN_ROLE,
  } = props;

  const [isBlacklistDialogOpen, setIsBlacklistDialogOpen] = useState(false);

  const { isButtonAvailable } = useSetButtonPermission(permissionRole, contract);

  const handleBlacklist = (): void => {
    setIsBlacklistDialogOpen(true);
  };

  const handleBlacklistCancel = (): void => {
    setIsBlacklistDialogOpen(false);
  };

  const metaFn = useMetamask((values: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, blacklistERC1155BlacklistABI, web3Context.provider?.getSigner());
    return contract.blacklist(values.account) as Promise<void>;
  });

  const handleBlacklistConfirmed = async (values: IAccountDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsBlacklistDialogOpen(false);
    });
  };

  if (!contractFeatures.includes(ContractFeatures.BLACKLIST)) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleBlacklist}
        icon={DoNotDisturbOn}
        message="form.buttons.blacklist"
        className={className}
        dataTestId="BlacklistButton"
        disabled={disabled || shouldDisableByContractType(contract) || !isButtonAvailable}
        variant={variant}
      />
      <AccountDialog
        onCancel={handleBlacklistCancel}
        onConfirm={handleBlacklistConfirmed}
        open={isBlacklistDialogOpen}
        message="dialogs.blacklist"
        testId="AccessListBlacklistForm"
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
