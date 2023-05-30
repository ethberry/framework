import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import { TokenType } from "@framework/types";

import { ClaimUploadDialog } from "./dialog";
import { IClaimUploadDto } from "./dialog/file-input";

export interface IClaimRow {
  id?: string;
  account: string;
  endTimestamp: string;
  tokenType: TokenType;
  contractId: number;
  templateId: number;
  amount: string;
}

export interface IClaimUploadButtonProps {
  className?: string;
}

export const ClaimUploadButton: FC<IClaimUploadButtonProps> = props => {
  const { className } = props;

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { fn, isLoading } = useApiCall((api, values: IClaimUploadDto) => {
    const { claims } = values;
    return api.fetchJson({
      url: "/claims/upload",
      data: {
        claims: claims.map(e => ({
          account: e.account,
          endTimestamp: e.endTimestamp,
          item: {
            components: [
              {
                tokenType: e.tokenType,
                contractId: e.contractId,
                templateId: e.templateId,
                amount: e.amount,
              },
            ],
          },
        })),
      },
      method: "POST",
    });
  });

  const handleUpload = () => {
    setIsUploadDialogOpen(true);
  };

  const handleUploadConfirm = async (values: IClaimUploadDto, form: any) => {
    return fn(form, values).then(() => {
      // TODO refresh page
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
        data-testid="ClaimUploadButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.upload" />
      </Button>
      <ClaimUploadDialog
        onConfirm={handleUploadConfirm}
        onCancel={handleUploadCancel}
        open={isUploadDialogOpen}
        isLoading={isLoading}
        initialValues={{
          claims: [],
        }}
      />
    </Fragment>
  );
};
