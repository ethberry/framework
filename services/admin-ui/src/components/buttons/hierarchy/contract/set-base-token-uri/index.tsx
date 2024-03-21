import { FC, Fragment, useEffect, useState } from "react";
import { Link } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType, useWeb3React } from "@web3-react/core";

import { useUser } from "@gemunion/provider-user";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IUser } from "@framework/types";
import { ContractFeatures, TokenType } from "@framework/types";

import setBaseURIABI from "@framework/abis/setBaseURI/SetBaseURI.json";

import { useCheckAccessDefaultAdmin } from "../../../../../utils/use-check-access";
import { shouldDisableByContractType } from "../../../utils";
import { BaseTokenURIEditDialog, IBaseTokenURIDto } from "./dialog";

export interface ISetBaseTokenURIButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const SetBaseTokenURIButton: FC<ISetBaseTokenURIButtonProps> = props => {
  const {
    className,
    contract: { address, contractFeatures, baseTokenURI, contractType },
    disabled,
    variant,
  } = props;

  const { account } = useWeb3React();
  const { profile } = useUser<IUser>();

  const [isBaseTokenURIDialogOpen, setIsBaseTokenURIDialogOpen] = useState(false);

  const [hasAccess, setHasAccess] = useState(false);
  const { checkAccessDefaultAdmin } = useCheckAccessDefaultAdmin();

  const handleBaseTokenURI = (): void => {
    setIsBaseTokenURIDialogOpen(true);
  };

  const handleBaseTokenURICancel = (): void => {
    setIsBaseTokenURIDialogOpen(false);
  };

  const metaFn = useMetamask((values: IBaseTokenURIDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, setBaseURIABI, web3Context.provider?.getSigner());
    return contract.setBaseURI(values.baseTokenURI) as Promise<void>;
  });

  const handleBaseTokenURIConfirmed = async (values: IBaseTokenURIDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsBaseTokenURIDialogOpen(false);
    });
  };

  useEffect(() => {
    if (account || profile?.wallet) {
      void checkAccessDefaultAdmin(void 0, {
        account: account || profile?.wallet,
        address,
      })
        .then((json: { hasRole: boolean }) => {
          setHasAccess(json?.hasRole);
        })
        .catch(console.error);
    }
  }, [account]);

  if (contractType === TokenType.NATIVE || contractType === TokenType.ERC20) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleBaseTokenURI}
        icon={Link}
        message="form.buttons.baseTokenURI"
        className={className}
        dataTestId="SetTokenURIButton"
        disabled={
          disabled ||
          shouldDisableByContractType(props.contract) ||
          contractFeatures.includes(ContractFeatures.SOULBOUND) ||
          !hasAccess
        }
        variant={variant}
      />
      <BaseTokenURIEditDialog
        onCancel={handleBaseTokenURICancel}
        onConfirm={handleBaseTokenURIConfirmed}
        open={isBaseTokenURIDialogOpen}
        initialValues={{ baseTokenURI }}
      />
    </Fragment>
  );
};
