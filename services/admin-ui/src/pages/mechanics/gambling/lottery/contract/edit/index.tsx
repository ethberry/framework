import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Alert, Typography } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { ContractStatus, IContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../../../components/popover/contract";

export interface ILotteryEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: Partial<IContract>;
}

export const LotteryEditDialog: FC<ILotteryEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, imageUrl, contractStatus, address, name, chainId, contractFeatures, parameters } =
    initialValues;

  const fixedValues = {
    id,
    title,
    description,
    address,
    contractStatus,
    imageUrl,
    parameters,
  };
  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="LotteryContractEditForm"
      action={
        id ? (
          <BlockchainInfoPopover name={name} address={address} chainId={chainId} contractFeatures={contractFeatures} />
        ) : null
      }
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
      <AvatarInput name="imageUrl" />
      <Fragment>
        <Alert severity="warning">
          <Typography>
            <a id="anchor" href={"/chain-link"}>
              <FormattedMessage id="alert.randomChainlink" />
            </a>
          </Typography>
        </Alert>
      </Fragment>
    </FormDialog>
  );
};
