import { FC } from "react";

import { Grid } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";

import { IAsset, ModuleType, TokenType } from "@framework/types";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { ContractInput } from "../../contract-input";

export interface ILotteryRound {
  address: string;
  ticket: IAsset;
  price: IAsset;
}

export interface ILotteryStartRoundDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: ILotteryRound, form?: any) => Promise<void>;
  initialValues: Partial<ILotteryRound>;
}

export const LotteryStartRoundDialog: FC<ILotteryStartRoundDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { ticket, price } = initialValues;
  const fixedValues = {
    ticket,
    price,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      // validationSchema={validationSchema}
      message={"dialogs.startRound"}
      testId="LotteryRoundStartForm"
      {...rest}
    >
      <ContractInput />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput
            autoSelect
            prefix="ticket"
            tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC998, TokenType.ERC1155] }}
            contract={{ data: { contractModule: [ModuleType.LOTTERY] } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput
            allowEmpty
            autoSelect
            prefix="price"
            tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155] }}
            contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
          />
        </Grid>
      </Grid>
    </FormDialog>
  );
};
