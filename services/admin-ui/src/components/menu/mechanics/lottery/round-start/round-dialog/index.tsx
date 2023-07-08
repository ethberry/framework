import { ChangeEvent, FC } from "react";
import { Grid } from "@mui/material";

import { ContractFeatures, IAsset, ModuleType, TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput } from "@gemunion/mui-inputs-core";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";

import { CommonContractInput } from "../../../../../inputs/common-contract";

export interface ILotteryRound {
  contractId: number;
  address: string;
  maxTicket: number;
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

  const { ticket, price, address, maxTicket, contractId } = initialValues;
  const fixedValues = {
    contractId,
    ticket,
    price,
    address,
    maxTicket,
  };

  const handleContractChange =
    (form: any) =>
    (_event: ChangeEvent<unknown>, option: any | null): void => {
      form.setValue("contractId", option?.id ?? 0);
      form.setValue("address", option?.address ?? "0x");
    };

  return (
    <FormDialog
      initialValues={fixedValues}
      // validationSchema={validationSchema}
      message={"dialogs.startRound"}
      testId="LotteryRoundStartForm"
      {...rest}
    >
      <CommonContractInput
        name="contractId"
        data={{
          contractModule: [ModuleType.LOTTERY],
          contractFeatures: [ContractFeatures.RANDOM],
        }}
        onChange={handleContractChange}
        autoselect
      />
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
      <NumberInput name="maxTicket" />
    </FormDialog>
  );
};
