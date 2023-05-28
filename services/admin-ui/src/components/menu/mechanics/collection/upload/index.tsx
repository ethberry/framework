import { FC, Fragment, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PaidOutlined } from "@mui/icons-material";
import csv2json from "csvtojson";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import { IContract, TokenType } from "@framework/types";
import { CollectionUploadDialog, ICollectionUploadDto } from "./dialog";

export interface ICollectionRow {
  account: string;
  endTimestamp: string;
  tokenType: TokenType;
  contractId: number;
  templateId: number;
  amount: string;
}

export interface ICollectionUploadMenuItemProps {
  contract: IContract;
}

export const CollectionUploadMenuItem: FC<ICollectionUploadMenuItemProps> = props => {
  const {
    contract: { address },
  } = props;

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { fn } = useApiCall(
    (api, values: ICollectionUploadDto) => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function fileReadCompleted() {
          void csv2json({
            noheader: true,
            headers: ["tokenId", "imageUrl", "metadata"],
          })
            .fromString(reader.result as string)
            .then((data: Array<ICollectionRow>) => {
              return api.fetchJson({
                url: `/collection/contracts/${address}/upload`,
                data: {
                  tokens: data,
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

  const handleUploadConfirm = async (values: ICollectionUploadDto, form: any) => {
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
      <MenuItem onClick={handleUpload}>
        <ListItemIcon>
          <PaidOutlined fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.collectionUpload" />
        </Typography>
      </MenuItem>
      <CollectionUploadDialog
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
