import { FC, Fragment, useState } from "react";
import { Add } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, BigNumber } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { TokenType } from "@framework/types";

import DispenserABI from "../../../../../abis/mechanics/dispenser/dispenser.abi.json";
import { DispenserUploadDialog } from "./dialog";
import type { IDispenserRow, IDispenserUploadDto } from "./dialog/file-input";
import { getEthPrice } from "./utils";

export interface IDispenserUploadButtonProps {
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const DispenserUploadButton: FC<IDispenserUploadButtonProps> = props => {
  const { disabled, variant = ListActionVariant.button } = props;

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

    const assets = items.map(item => {
      return {
        tokenType: Object.values(TokenType).indexOf(item.tokenType).toString(),
        token: item.address,
        tokenId: item.tokenId,
        amount: BigNumber.from(item.amount),
      };
    });

    const contract = new Contract(process.env.DISPENSER_ADDR, DispenserABI, web3Context.provider?.getSigner());
    return contract.disperse(assets, receivers, {
      value: getEthPrice(assets),
    }) as Promise<any>;
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
      <ListAction
        onClick={handleUpload}
        icon={Add}
        message="form.buttons.upload"
        dataTestId="DispenserUploadButton"
        disabled={disabled}
        variant={variant}
      />
      <DispenserUploadDialog
        onConfirm={handleUploadConfirm}
        onCancel={handleUploadCancel}
        open={isUploadDialogOpen}
        isLoading={isLoading}
        initialValues={{
          rows: [],
        }}
      />
    </Fragment>
  );
};
