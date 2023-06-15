import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { TokenType } from "@framework/types";

import DispenserABI from "../../../../../abis/mechanics/dispenser/dispenser.abi.json";
import { DispenserUploadDialog, IDispenserUploadDto } from "./dialog";

export interface IDispenserRow {
  account: string;
  tokenType: TokenType;
  address: string;
  tokenId: string;
  amount: string;
}

export interface IDispenserUploadButtonProps {
  className?: string;
}

export const DispenserUploadButton: FC<IDispenserUploadButtonProps> = props => {
  const { className } = props;

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const metaFn = useMetamask((values: IDispenserUploadDto, web3Context: Web3ContextType) => {
    const { rows } = values;

    const [items, receivers] = rows.reduce<[Array<Omit<IDispenserRow, "account">>, Array<string>]>(
      ([items, receivers], { account, ...rest }) => {
        receivers.push(account);
        items.push(rest);
        return [items, receivers];
      },
      [[], []],
    );

    const contract = new Contract(process.env.DISPENSER_ADDR, DispenserABI, web3Context.provider?.getSigner());
    return contract.disperse(items, receivers) as Promise<any>;
  });

  const handleUpload = () => {
    setIsUploadDialogOpen(true);
  };

  const handleUploadConfirm = async (values: IDispenserUploadDto) => {
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
        data-testid="DispenserUploadButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.upload" />
      </Button>

      <DispenserUploadDialog
        onConfirm={handleUploadConfirm}
        onCancel={handleUploadCancel}
        open={isUploadDialogOpen}
        isLoading={isLoading}
        initialValues={{
          files: [],
          rows: [],
        }}
      />
    </Fragment>
  );
};
