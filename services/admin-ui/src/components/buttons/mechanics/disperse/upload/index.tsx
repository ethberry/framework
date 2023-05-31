import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { constants, Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { TokenType } from "@framework/types";

import DisperseABI from "../../../../../abis/components/buttons/mechanics/disperse/disperse.abi.json";
import { DisperseUploadDialog, IDisperseUploadDto } from "./dialog";

export interface IDisperseRow {
  account: string;
  tokenId: string;
  amount: string;
}

export interface IDisperseUploadButtonProps {
  className?: string;
}

export const DisperseUploadButton: FC<IDisperseUploadButtonProps> = props => {
  const { className } = props;

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const metaFn = useMetamask((values: IDisperseUploadDto, web3Context: Web3ContextType) => {
    const { address, disperses, tokenType } = values;

    const accounts = disperses.map(e => e.account);
    const tokenIds = disperses.map(e => e.tokenId);
    const amounts = disperses.map(e => e.amount);

    const contract = new Contract(process.env.DISPERSE_ADDR, DisperseABI, web3Context.provider?.getSigner());

    if (tokenType === TokenType.NATIVE) {
      return contract.disperseEther(accounts, amounts) as Promise<any>;
    } else if (tokenType === TokenType.ERC20) {
      return contract.disperseERC20(address, accounts, amounts) as Promise<any>;
    } else if (tokenType === TokenType.ERC721 || tokenType === TokenType.ERC998) {
      return contract.disperseERC721(address, accounts, tokenIds) as Promise<any>;
    } else if (tokenType === TokenType.ERC1155) {
      return contract.disperseERC1155(address, accounts, tokenIds, amounts) as Promise<any>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  const handleUpload = () => {
    setIsUploadDialogOpen(true);
  };

  const handleUploadConfirm = async (values: IDisperseUploadDto) => {
    setIsLoading(true);
    await metaFn(values).finally(() => {
      setIsUploadDialogOpen(false);
      setIsLoading(false);
    });
  };

  const handleUploadCancel = () => {
    setIsUploadDialogOpen(false);
  };

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleUpload}
        data-testid="DisperseUploadButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.upload" />
      </Button>

      <DisperseUploadDialog
        onConfirm={handleUploadConfirm}
        onCancel={handleUploadCancel}
        open={isUploadDialogOpen}
        isLoading={isLoading}
        initialValues={{
          tokenType: TokenType.ERC20,
          contractId: 0,
          address: constants.AddressZero,
          files: [],
          disperses: [],
        }}
      />
    </Fragment>
  );
};
