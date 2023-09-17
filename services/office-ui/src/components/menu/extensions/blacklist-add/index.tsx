import { FC, Fragment, useState } from "react";
import { DoNotDisturbOn } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import BlacklistABI from "../../../../abis/extensions/blacklist-add/blacklist.abi.json";

import { AccountDialog, IAccountDto } from "../../../dialogs/account";

export interface IBlacklistMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const BlacklistMenuItem: FC<IBlacklistMenuItemProps> = props => {
  const {
    contract: { address, contractFeatures },
    disabled,
    variant,
  } = props;

  const [isBlacklistDialogOpen, setIsBlacklistDialogOpen] = useState(false);

  const handleBlacklist = (): void => {
    setIsBlacklistDialogOpen(true);
  };

  const handleBlacklistCancel = (): void => {
    setIsBlacklistDialogOpen(false);
  };

  const metaFn = useMetamask((values: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, BlacklistABI, web3Context.provider?.getSigner());
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
        disabled={disabled}
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
