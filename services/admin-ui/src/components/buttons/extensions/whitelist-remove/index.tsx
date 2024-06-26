import { FC, Fragment, useEffect, useState } from "react";
import { Unpublished } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { shouldDisableByContractType } from "../../utils";
import { AccessListUnWhitelistDialog } from "./dialog";
import { useWeb3React } from "@web3-react/core";
import { useCheckAccess } from "../../../../utils/use-check-access";

export interface IUnWhitelistButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const UnWhitelistButton: FC<IUnWhitelistButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, contractFeatures },
    disabled,
    variant,
  } = props;

  const [isUnWhitelistDialogOpen, setIsUnWhitelistDialogOpen] = useState(false);

  const [hasAccess, setHasAccess] = useState(false);

  const { account = "" } = useWeb3React();

  const { checkAccess } = useCheckAccess();

  const handleUnWhitelist = (): void => {
    setIsUnWhitelistDialogOpen(true);
  };

  const handleUnWhitelistCancel = (): void => {
    setIsUnWhitelistDialogOpen(false);
  };

  const handleUnWhitelistConfirm = () => {
    setIsUnWhitelistDialogOpen(false);
  };

  useEffect(() => {
    if (account) {
      void checkAccess({
        account,
        address,
      })
        .then((json: { hasRole: boolean }) => {
          setHasAccess(json?.hasRole);
        })
        .catch(console.error);
    }
  }, [account]);

  if (!contractFeatures.includes(ContractFeatures.WHITELIST)) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleUnWhitelist}
        icon={Unpublished}
        message="form.buttons.unwhitelist"
        className={className}
        dataTestId="UnWhitelistButton"
        disabled={disabled || shouldDisableByContractType(contract) || !hasAccess}
        variant={variant}
      />
      <AccessListUnWhitelistDialog
        onCancel={handleUnWhitelistCancel}
        onConfirm={handleUnWhitelistConfirm}
        open={isUnWhitelistDialogOpen}
        data={{ address }}
      />
    </Fragment>
  );
};
