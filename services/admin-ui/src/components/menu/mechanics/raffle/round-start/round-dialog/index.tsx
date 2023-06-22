import { FC } from "react";
import { Grid } from "@mui/material";

import { ContractFeatures, IAsset, ModuleType, TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput } from "@gemunion/mui-inputs-core";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";

import { CommonContractInput } from "../../../../../inputs/common-contract";

export interface IRaffleRound {
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

  const { ticket, price, address, maxTicket } = initialValues;
  const fixedValues = {
    ticket,
    price,
    address,
    maxTicket,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      // validationSchema={validationSchema}
      message={"dialogs.startRound"}
      testId="RaffleRoundStartForm"
      {...rest}
    >
      <CommonContractInput
        name="contractId"
        controller="contracts"
        data={{
          contractModule: [ModuleType.RAFFLE],
          contractFeatures: [ContractFeatures.RANDOM],
        }}
        onChangeOptions={[
          { name: "contractId", optionName: "id", defaultValue: 0 },
          { name: "address", optionName: "address", defaultValue: "0x" },
        ]}
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
