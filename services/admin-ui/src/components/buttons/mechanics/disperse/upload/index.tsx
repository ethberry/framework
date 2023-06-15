import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { TokenType } from "@framework/types";

import DisperseABI from "../../../../../abis/mechanics/disperse/disperse.abi.json";
import { DisperseUploadDialog, IDisperseUploadDto } from "./dialog";

export interface IDisperseRow {
  account: string;
  tokenType: TokenType;
  address: string;
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
    const { disperses } = values;

    const rows = disperses.reduce<[Array<Omit<IDisperseRow, "account">>, Array<string>]>(
      ([items, receivers], { account, ...rest }) => {
        receivers.push(account);
        items.push(rest);
        return [items, receivers];
      },
      [[], []],
    );

    const contract = new Contract(process.env.DISPERSION_ADDR, DisperseABI, web3Context.provider?.getSigner());
    return contract.disperse(rows) as Promise<any>;
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
          files: [],
          disperses: [],
        }}
      />
    </Fragment>
  );
};
