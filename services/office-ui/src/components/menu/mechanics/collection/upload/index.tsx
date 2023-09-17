import { FC, Fragment, useState } from "react";
import { PaidOutlined } from "@mui/icons-material";

import { useApiCall } from "@gemunion/react-hooks";
import type { IContract } from "@framework/types";

import { ListAction, ListActionVariant } from "../../../../common/lists";
import { CollectionUploadDialog, ICollectionUploadDto } from "./dialog";

export interface ICollectionRow {
  id?: string;
  tokenId: number;
  imageUrl: string;
  metadata: string;
}

export interface ICollectionUploadMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const CollectionUploadMenuItem: FC<ICollectionUploadMenuItemProps> = props => {
  const {
    contract: { address },
    disabled,
    variant,
  } = props;

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { fn, isLoading } = useApiCall((api, values: ICollectionUploadDto) => {
    const { tokens } = values;
    return api.fetchJson({
      url: `/collection/contracts/${address}/upload`,
      data: {
        tokens: tokens.map(({ id: _, ...rest }) => rest),
      },
      method: "POST",
    });
  });

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
      <ListAction
        onClick={handleUpload}
        icon={PaidOutlined}
        message="form.buttons.collectionUpload"
        disabled={disabled}
        variant={variant}
      />
      <CollectionUploadDialog
        onConfirm={handleUploadConfirm}
        onCancel={handleUploadCancel}
        open={isUploadDialogOpen}
        isLoading={isLoading}
        initialValues={{
          files: [],
          tokens: [],
        }}
      />
    </Fragment>
  );
};
