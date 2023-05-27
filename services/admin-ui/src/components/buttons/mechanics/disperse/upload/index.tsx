import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, constants } from "ethers";
import csv2json from "csvtojson";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { TokenType } from "@framework/types";

import DisperseABI from "../../../../../abis/components/buttons/mechanics/disperse/disperse.abi.json";
import { DisperseUploadDialog, IDisperseUploadDto } from "./dialog";

export interface IClaimUploadButtonProps {
  className?: string;
}

export const DisperseUploadButton: FC<IClaimUploadButtonProps> = props => {
  const { className } = props;

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const metaFn = useMetamask((values: IDisperseUploadDto, web3Context: Web3ContextType) => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = function fileReadCompleted() {
        // when the reader is done, the content is in reader.result.
        void csv2json({
          noheader: true,
          headers: ["account", "amount"],
        })
          .fromString(reader.result as string)
          .then((data: Array<{ account: string; amount: string }>) => {
            const accounts = data.map(e => e.account);
            const amounts = data.map(e => e.amount);

            const contract = new Contract(process.env.DISPERSE_ADDR, DisperseABI, web3Context.provider?.getSigner());
            if (values.tokenType === TokenType.NATIVE) {
              return contract.disperseEther(accounts, amounts) as Promise<any>;
            } else if (values.tokenType === TokenType.ERC20) {
              return contract.disperseToken(values.address, accounts, amounts) as Promise<any>;
            } else {
              throw new Error("unsupported token type");
            }
          })
          .then(resolve);
      };
      reader.readAsText(values.files[0], "UTF-8");
    });
  });

  const handleUpload = () => {
    setIsUploadDialogOpen(true);
  };

  const handleUploadConfirm = async (values: IDisperseUploadDto) => {
    await metaFn(values).finally(() => {
      setIsUploadDialogOpen(false);
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
        initialValues={{
          tokenType: TokenType.ERC20,
          contractId: 0,
          address: constants.AddressZero,
          files: [],
        }}
      />
    </Fragment>
  );
};
