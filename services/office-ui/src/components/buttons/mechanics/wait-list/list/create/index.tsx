import { FC, Fragment, useState } from "react";
import { Add } from "@mui/icons-material";

import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActionVariant } from "@framework/styled";
import { ContractStatus } from "@framework/types";
import type { IWaitListItem, IWaitListItemCreateDto, IWaitListList } from "@framework/types";

import { WaitListItemEditDialog } from "../../../../../../pages/mechanics/marketing/wait-list/item/edit";

export interface IWaitListListCreateButtonProps {
  className?: string;
  disabled?: boolean;
  onRefreshPage: () => Promise<void>;
  variant?: ListActionVariant;
  waitListList: IWaitListList;
}

export const WaitListListCreateButton: FC<IWaitListListCreateButtonProps> = props => {
  const {
    className,
    waitListList: { id, contract, root },
    disabled,
    variant,
    onRefreshPage,
  } = props;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { fn } = useApiCall((api, values: IWaitListItemCreateDto) => {
    const { account, listId } = values;
    return api.fetchJson({
      url: "/wait-list/item",
      data: { account, listId },
      method: "POST",
    });
  });

  const handleUpload = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateConfirm = async (values: Partial<IWaitListItem>, form: any) => {
    return fn(form, values).then(async () => {
      await onRefreshPage();
      setIsCreateDialogOpen(false);
    });
  };

  const handleCreateCancel = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleUpload}
        icon={Add}
        message="form.buttons.add"
        className={className}
        dataTestId="WaitListListCreateButton"
        disabled={disabled || !!root || contract.contractStatus !== ContractStatus.ACTIVE}
        variant={variant}
      />
      <WaitListItemEditDialog
        onCancel={handleCreateCancel}
        onConfirm={handleCreateConfirm}
        open={isCreateDialogOpen}
        testId="WaitListEditDialog"
        initialValues={{
          account: "",
          listId: id,
        }}
      />
    </Fragment>
  );
};
