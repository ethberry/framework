import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { getEmptyToken } from "@gemunion/mui-inputs-asset";
import { TokenType } from "@framework/types";

import ERC20ApproveABI from "../../../../abis/common/allowance/erc20.approve.abi.json";
import ERC721SetApprovalForAllABI from "../../../../abis/common/allowance/erc721.setApprovalForAll.abi.json";
import ERC1155SetApprovalForAllABI from "../../../../abis/common/allowance/erc1155.setApprovalForAll.abi.json";

import { AllowanceDialog, IAllowanceDto } from "./edit";

export const AllowanceButton: FC = () => {
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
    } else if (asset.tokenType === TokenType.ERC721) {
      const contractErc721 = new Contract(
        asset.contract.address,
        ERC721SetApprovalForAllABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc721.setApprovalForAll(values.address, true) as Promise<any>;
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
      <Button onClick={handleAllowance}>
        <FormattedMessage id="form.buttons.allowance" />
      </Button>
      <AllowanceDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        initialValues={{
          token: getEmptyToken(),
          address: "",
        }}
      />
    </Fragment>
  );
};
