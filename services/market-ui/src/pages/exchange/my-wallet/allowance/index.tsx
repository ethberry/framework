import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { getEmptyToken } from "@gemunion/mui-inputs-asset";
import { TokenType } from "@framework/types";

import ApproveERC20ABI from "./approve.erc20.abi.json";
import SetApprovalForAllERC721ABI from "./setApprovalForAll.erc721.abi.json";
import SetApprovalForAllERC1155ABI from "./setApprovalForAll.erc1155.abi.json";
// import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
// import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
// import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

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
      const contractErc20 = new Contract(asset.contract.address, ApproveERC20ABI, web3Context.provider?.getSigner());
      return contractErc20.approve(values.address, asset.amount) as Promise<any>;
    } else if (asset.tokenType === TokenType.ERC721) {
      const contractErc721 = new Contract(
        asset.contract.address,
        SetApprovalForAllERC721ABI,
        web3Context.provider?.getSigner(),
      );
      return contractErc721.setApprovalForAll(values.address, true) as Promise<any>;
    } else if (asset.tokenType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(
        asset.contract.address,
        SetApprovalForAllERC1155ABI,
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
