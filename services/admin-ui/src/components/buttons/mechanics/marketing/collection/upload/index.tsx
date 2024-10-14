import { FC, Fragment, useState } from "react";
import { PaidOutlined } from "@mui/icons-material";

import { useApiCall } from "@ethberry/react-hooks";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { ICollectionUploadDto, IContract } from "@framework/types";

import { shouldDisableByContractType } from "../../../../utils";
import { CollectionUploadDialog } from "./dialog";

export interface ICollectionUploadButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
  onRefreshPage: () => Promise<void>;
}

export const CollectionUploadButton: FC<ICollectionUploadButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address },
    disabled,
    variant,
    onRefreshPage,
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
    return fn(form, values).then(async () => {
      await onRefreshPage();
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
        className={className}
        dataTestId="CollectionUploadButton"
        disabled={disabled || shouldDisableByContractType(contract)}
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
