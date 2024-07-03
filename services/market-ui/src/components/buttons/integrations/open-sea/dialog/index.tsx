import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { DateInput } from "@gemunion/mui-inputs-picker";

import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { ContractStatus, IAsset, ModuleType, TokenType } from "@framework/types";
import { StyledAlert } from "@framework/styled";

export interface ISellDto {
  price: IAsset;
  endTimestamp: string;
}

export interface ISellDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: ISellDto, form?: any) => Promise<void>;
  initialValues: ISellDto;
}

export const SellDialog: FC<ISellDialogProps> = props => {
  const { initialValues, ...rest } = props;
  return (
    <FormDialog
      initialValues={initialValues}
      // validationSchema={validationSchema}
      message="dialogs.sellOpensea"
      testId="SellDialogForm"
      {...rest}
    >
      <TemplateAssetInput
        autoSelect
        prefix="price"
        tokenType={{
          disabledOptions: [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
        }}
        contract={{
          data: {
            includeExternalContracts: true,
            contractModule: [ModuleType.HIERARCHY],
            contractStatus: [ContractStatus.ACTIVE],
          },
        }}
      />
      <StyledAlert severity="info">
        <FormattedMessage id="alert.openseaFee" />
      </StyledAlert>
      <DateInput name="endTimestamp" />
    </FormDialog>
  );
};
