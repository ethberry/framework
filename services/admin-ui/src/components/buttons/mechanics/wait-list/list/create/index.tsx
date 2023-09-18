import { FC, Fragment, useState } from "react";
import { Add } from "@mui/icons-material";

import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IWaitListItem, IWaitListItemCreateDto, IWaitListList } from "@framework/types";

import { WaitListItemEditDialog } from "../../../../../../pages/mechanics/wait-list/item/edit";

export interface IWaitListListCreateButtonProps {
  waitListList: IWaitListList;
  disabled?: boolean;
  variant?: ListActionVariant;
  onRefreshPage: () => Promise<void>;
}

export const WaitListListCreateButton: FC<IWaitListListCreateButtonProps> = props => {
  const {
    waitListList: { id },
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
      <ListAction onClick={handleUpload} icon={Add} message="form.buttons.add" disabled={disabled} variant={variant} />
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
