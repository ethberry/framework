import { ChangeEvent, FC } from "react";
import { Grid } from "@mui/material";

import { ContractFeatures, IAsset, ModuleType, TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput } from "@gemunion/mui-inputs-core";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";

import { CommonContractInput } from "../../../../../inputs/common-contract";
import { validationSchema } from "./validation";

export interface IRaffleRound {
  contractId: number;
  address: string;
  maxTicket: number;
  ticket: IAsset;
  price: IAsset;
}

export interface IRaffleStartRoundDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IRaffleRound, form?: any) => Promise<void>;
  initialValues: Partial<IRaffleRound>;
}

export const RaffleStartRoundDialog: FC<IRaffleStartRoundDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { ticket, price, address, maxTicket, contractId } = initialValues;
  const fixedValues = {
    ticket,
    price,
    address,
    maxTicket,
    contractId,
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
      validationSchema={validationSchema}
      message={"dialogs.startRound"}
      testId="RaffleRoundStartForm"
      {...rest}
    >
      <CommonContractInput
        name="contractId"
        data={{
          contractModule: [ModuleType.RAFFLE],
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
            contract={{ data: { contractModule: [ModuleType.RAFFLE] } }}
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
