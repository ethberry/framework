import { ChangeEvent, FC, useCallback } from "react";
import { Grid } from "@mui/material";

import { ContractFeatures, ContractStatus, IAsset, ModuleType, TokenType } from "@framework/types";
import { FormDialog } from "@ethberry/mui-dialog-form";
import { NumberInput } from "@ethberry/mui-inputs-core";
import { TemplateAssetInput } from "@ethberry/mui-inputs-asset";

import { CommonContractInput } from "../../../../../../inputs/common-contract";
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
    (_event: ChangeEvent<unknown>, option: any): void => {
      form.setValue("contractId", option?.id ?? 0, { shouldDirty: true });
      form.setValue("address", option?.address ?? "0x");
    };

  const formatValue = useCallback(
    (maxTicket: number | null): number => {
      return maxTicket || 0;
    },
    [maxTicket],
  );

  return (
    <FormDialog
      disabled={false}
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.raffleRoundStart"}
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
            tokenType={{
              disabledOptions: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC998, TokenType.ERC1155],
            }}
            contract={{
              data: {
                contractModule: [ModuleType.RAFFLE],
                contractStatus: [ContractStatus.ACTIVE],
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput
            autoSelect
            prefix="price"
            tokenType={{
              disabledOptions: [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
            }}
            contract={{
              data: {
                contractModule: [ModuleType.HIERARCHY],
                contractStatus: [ContractStatus.ACTIVE],
              },
            }}
          />
        </Grid>
      </Grid>
      <NumberInput name="maxTicket" inputProps={{ min: 0 }} formatValue={formatValue} />
    </FormDialog>
  );
};
