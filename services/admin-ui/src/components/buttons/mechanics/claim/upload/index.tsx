import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import csv2json from "csvtojson";

import { useApiCall } from "@gemunion/react-hooks";

import { ClaimUploadDialog, IClaimUploadDto } from "./dialog";
import { TokenType } from "@framework/types";

export interface IClaimRow {
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

  const { fn } = useApiCall(
    (api, values: IClaimUploadDto) => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function fileReadCompleted() {
          void csv2json({
            noheader: true,
            headers: ["account", "endTimestamp", "tokenType", "contractId", "templateId", "amount"],
          })
            .fromString(reader.result as string)
            .then((data: Array<IClaimRow>) => {
              return api.fetchJson({
                url: "/claims/upload",
                data: {
                  claims: data.map(e => ({
                    account: e.account,
                    endTimestamp: e.endTimestamp,
                    item: {
                      components: [
                        {
                          tokenType: e.tokenType,
                          contractId: ~~e.contractId,
                          templateId: ~~e.templateId,
                          amount: e.amount,
                        },
                      ],
                    },
                  })),
                },
                method: "POST",
              });
            })
            .then(resolve);
        };
        reader.readAsText(values.files[0], "UTF-8");
      });
    },
    { error: false },
  );

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
        initialValues={{
          files: [],
        }}
      />
    </Fragment>
  );
};
