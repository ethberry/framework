import { FC, Fragment, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { HowToVote } from "@mui/icons-material";
import { Contract } from "ethers";
import { useWeb3React, Web3ContextType } from "@web3-react/core";

import { getEmptyToken } from "@ethberry/mui-inputs-asset";
import { useUser } from "@ethberry/provider-user";
import { useMetamask } from "@ethberry/react-hooks-eth";
import { useApiCall } from "@ethberry/react-hooks";
import { ListAction } from "@framework/styled";
import { ContractFeatures, SystemModuleType, TokenType } from "@framework/types";
import type { IContract, IUser } from "@framework/types";

import ERC20ApproveABI from "@framework/abis/json/ERC20Simple/approve.json";
import ERC721SetApprovalABI from "@framework/abis/json/ERC721Simple/approve.json";
import ERC1155SetApprovalForAllABI from "@framework/abis/json/ERC1155Simple/setApprovalForAll.json";

import { AllowanceDialog, IAllowanceDto } from "./dialog";

export interface IAllowanceButtonProps {
  token?: any;
  isSmall?: boolean;
  contract?: Partial<IContract>;
  isDisabled?: boolean;
  isExchange?: boolean;
}

export const AllowanceButton: FC<IAllowanceButtonProps> = props => {
  const { token = getEmptyToken(), isSmall = false, contract = undefined, isExchange = false } = props;

  const [exchange, setExchange] = useState<IContract | null>(null);

  const { chainId, isActive } = useWeb3React();
  const user = useUser<IUser>();
  const isUserAuthenticated = user.isAuthenticated();

  // TODO useSystemContract
  const { fn: getContractExchangeFn } = useApiCall(
    api =>
      api.fetchJson({
        url: "/contracts/system",
        method: "POST",
        data: {
          contractModule: SystemModuleType.EXCHANGE,
        },
      }),
    { success: false, error: false },
  );

  const getSystemExchange = async () => {
    const exchange = await getContractExchangeFn();
    setExchange(exchange);
  };

  useEffect(() => {
    if (!contract && !exchange && isExchange && chainId) {
      void getSystemExchange();
    }
  }, [chainId]);

  const [isAllowanceDialogOpen, setIsAllowanceDialogOpen] = useState(false);
  const handleAllowance = (): void => {
    setIsAllowanceDialogOpen(true);
  };

  const handleAllowanceCancel = (): void => {
    setIsAllowanceDialogOpen(false);
  };

  const metaFn = useMetamask((values: IAllowanceDto, web3Context: Web3ContextType) => {
    const asset = values.token.components[0];
    if (asset.tokenType === TokenType.ERC20) {
      const contractErc20 = new Contract(
        asset.template.contract.address,
        ERC20ApproveABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc20.approve(values.address, asset.amount) as Promise<any>;
    } else if (asset.tokenType === TokenType.ERC721 || asset.tokenType === TokenType.ERC998) {
      const contractErc721 = new Contract(
        asset.template.contract.address,
        ERC721SetApprovalABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc721.approve(values.address, asset.token.tokenId) as Promise<any>;
    } else if (asset.tokenType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(
        asset.template.contract.address,
        ERC1155SetApprovalForAllABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc1155.setApprovalForAll(values.address, true) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleAllowanceConfirm = async (values: IAllowanceDto): Promise<void> => {
    await metaFn(values);
  };

  const disabled = (contract || token?.template?.contract)?.contractFeatures.includes(ContractFeatures.SOULBOUND);

  if (!isActive || !isUserAuthenticated) {
    return null;
  }

  return (
    <Fragment>
      {isSmall ? (
        <ListAction
          onClick={handleAllowance}
          icon={HowToVote}
          message="form.tips.allowance"
          disabled={disabled}
          dataTestId="StakeDepositAllowanceButton"
        />
      ) : (
        <Button
          disabled={disabled}
          variant="outlined"
          startIcon={<HowToVote />}
          onClick={handleAllowance}
          data-testid="AllowanceButton"
        >
          <FormattedMessage id="form.buttons.allowance" />
        </Button>
      )}

      <AllowanceDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        initialValues={{
          token,
          address: contract?.address || exchange?.address || "",
          contractId: contract?.id || exchange?.id || undefined,
        }}
      />
    </Fragment>
  );
};
