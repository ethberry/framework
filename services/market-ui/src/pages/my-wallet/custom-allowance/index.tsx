import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { TokenType } from "@framework/types";
import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

import { AllowanceCustomDialog, IAllowanceCustomDto } from "./edit";

export const AllowanceCustomButton: FC = () => {
  const [isAllowanceCustomDialogOpen, setIsAllowanceCustomDialogOpen] = useState(false);

  const handleAllowanceCustom = (): void => {
    setIsAllowanceCustomDialogOpen(true);
  };

  const handleAllowanceCustomCancel = (): void => {
    setIsAllowanceCustomDialogOpen(false);
  };

  const metaFn = useMetamask(async (values: IAllowanceCustomDto, web3Context: Web3ContextType) => {
    console.log("values", values);
    if (values.tokenType === TokenType.ERC20) {
      const contractErc20 = new Contract(values.address, ERC20SimpleSol.abi, web3Context.provider?.getSigner());
      await contractErc20.approve(values.addressCustom, values.amount);
    } else if (values.tokenType === TokenType.ERC721 || values.tokenType === TokenType.ERC998) {
      const contractErc721 = new Contract(values.address, ERC721SimpleSol.abi, web3Context.provider?.getSigner());
      await contractErc721.setApprovalForAll(values.addressCustom, true);
    } else if (values.tokenType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(values.address, ERC1155SimpleSol.abi, web3Context.provider?.getSigner());
      await contractErc1155.setApprovalForAll(values.addressCustom, true);
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleAllowanceCustomConfirm = async (values: IAllowanceCustomDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsAllowanceCustomDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <Button onClick={handleAllowanceCustom}>
        <FormattedMessage id="pages.my-wallet.allowanceCustom" />
      </Button>
      <AllowanceCustomDialog
        onCancel={handleAllowanceCustomCancel}
        onConfirm={handleAllowanceCustomConfirm}
        open={isAllowanceCustomDialogOpen}
      />
    </Fragment>
  );
};
