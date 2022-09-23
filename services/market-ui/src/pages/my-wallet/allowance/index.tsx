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

import { AllowanceDialog, IAllowanceDto } from "./edit";
import { emptyPrice } from "../../../components/inputs/price/empty-price";

export const AllowanceButton: FC = () => {
  const [isAllowanceDialogOpen, setIsAllowanceDialogOpen] = useState(false);

  const handleAllowance = (): void => {
    setIsAllowanceDialogOpen(true);
  };

  const handleAllowanceCancel = (): void => {
    setIsAllowanceDialogOpen(false);
  };

  const metaFn = useMetamask((values: IAllowanceDto, web3Context: Web3ContextType) => {
    if (values.tokenType === TokenType.ERC20) {
      const contractErc20 = new Contract(values.contract.main, ERC20SimpleSol.abi, web3Context.provider?.getSigner());
      return contractErc20.approve(values.contract.custom, values.amount) as Promise<any>;
    } else if (values.tokenType === TokenType.ERC721 || values.tokenType === TokenType.ERC998) {
      const contractErc721 = new Contract(values.contract.main, ERC721SimpleSol.abi, web3Context.provider?.getSigner());
      return contractErc721.setApprovalForAll(values.contract.custom, true) as Promise<any>;
    } else if (values.tokenType === TokenType.ERC1155) {
      const contractErc1155 = new Contract(
        values.contract.main,
        ERC1155SimpleSol.abi,
        web3Context.provider?.getSigner(),
      );
      return contractErc1155.setApprovalForAll(values.contract.custom, true) as Promise<any>;
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
        <FormattedMessage id="pages.my-wallet.allowance" />
      </Button>
      <AllowanceDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        initialValues={{
          allowance: emptyPrice,
          tokenType: TokenType.ERC20,
          decimals: 18,
          amount: "0",
          contractId: 0,
          contract: { main: "", custom: "" },
        }}
      />
    </Fragment>
  );
};
