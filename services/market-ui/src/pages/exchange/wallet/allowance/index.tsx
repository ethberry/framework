import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { HowToVote } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { getEmptyToken } from "@gemunion/mui-inputs-asset";
import { ListAction } from "@framework/styled";
import { TokenType } from "@framework/types";

import ERC20ApproveABI from "../../../../abis/extensions/allowance/erc20.approve.abi.json";
import ERC721SetApprovalABI from "../../../../abis/extensions/allowance/erc721.approve.abi.json";
import ERC1155SetApprovalForAllABI from "../../../../abis/extensions/allowance/erc1155.setApprovalForAll.abi.json";

import { AllowanceDialog, IAllowanceDto } from "./dialog";

export interface IAllowanceButtonProps {
  token?: any;
  isSmall?: boolean;
  contractId?: number;
}

export const AllowanceButton: FC<IAllowanceButtonProps> = props => {
  const { token = getEmptyToken(), isSmall = false, contractId } = props;
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
      const contractErc20 = new Contract(asset.contract.address, ERC20ApproveABI, web3Context.provider?.getSigner());
      return contractErc20.approve(values.address, asset.amount) as Promise<any>;
    } else if (asset.tokenType === TokenType.ERC721 || asset.tokenType === TokenType.ERC998) {
      const contractErc721 = new Contract(
        asset.contract.address,
        ERC721SetApprovalABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc721.approve(values.address, asset.token.tokenId) as Promise<any>;
    } else if (asset.tokenType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(
        asset.contract.address,
        ERC1155SetApprovalForAllABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc1155.setApprovalForAll(values.address, true) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleAllowanceConfirm = async (values: IAllowanceDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsAllowanceDialogOpen(false);
    });
  };

  return (
    <Fragment>
      {isSmall ? (
        <ListAction
          onClick={handleAllowance}
          icon={HowToVote}
          message="form.tips.allowance"
          dataTestId="StakeDepositAllowanceButton"
        />
      ) : (
        <Button variant="outlined" startIcon={<HowToVote />} onClick={handleAllowance} data-testid="AllowanceButton">
          <FormattedMessage id="form.buttons.allowance" />
        </Button>
      )}

      <AllowanceDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        initialValues={{
          token,
          address: "",
          contractId,
        }}
      />
    </Fragment>
  );
};
