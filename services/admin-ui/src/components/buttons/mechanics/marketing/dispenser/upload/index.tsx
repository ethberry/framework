import { FC, Fragment, useState } from "react";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { BigNumber, Contract } from "ethers";
import { FormattedMessage } from "react-intl";

import { useMetamask, useSystemContract } from "@ethberry/react-hooks-eth";
import type { IContract } from "@framework/types";
import { SystemModuleType, TokenType } from "@framework/types";

import DispenserDisperseABI from "@framework/abis/json/Dispenser/disperse.json";

import { DispenserUploadDialog } from "./dialog";
import type { IDispenserRow, IDispenserUploadDto } from "./dialog/file-input";
import { getEthPrice } from "./utils";

export interface IDispenserUploadButtonProps {
  className?: string;
  disabled?: boolean;
}

export const DispenserUploadButton: FC<IDispenserUploadButtonProps> = props => {
  const { className, disabled } = props;

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const metaFnWithContract = useSystemContract<IContract, SystemModuleType>(
    (values: IDispenserUploadDto, web3Context: Web3ContextType, systemContract: IContract) => {
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

      const contract = new Contract(systemContract.address, DispenserDisperseABI, web3Context.provider?.getSigner());
      return contract.disperse(assets, receivers, {
        value: getEthPrice(assets),
      }) as Promise<void>;
    },
  );

  const metaFn = useMetamask((values: IDispenserUploadDto, web3Context: Web3ContextType) => {
    return metaFnWithContract(SystemModuleType.DISPENSER, values, web3Context);
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
        onClick={handleUpload}
        startIcon={<Add />}
        className={className}
        data-testid="DispenserUploadButton"
        disabled={disabled}
        variant="outlined"
      >
        <FormattedMessage id="form.buttons.upload" />
      </Button>
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