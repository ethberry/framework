import { FC, Fragment, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { DoNotDisturbOn } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useApiCall } from "@gemunion/react-hooks";

import type { IContract } from "@framework/types";

import { EthListenerAddDialog, IEthListenerAddDto } from "./edit";
import { getListenerType } from "../../../../../utils/listener-type";

export interface IEthListenerAddMenuItemProps {
  contract: IContract;
}

export const EthListenerAddMenuItem: FC<IEthListenerAddMenuItemProps> = props => {
  const {
    contract,
    contract: { address },
  } = props;

  const [isEthListenerDialogOpen, setIsEthListenerDialogOpen] = useState(false);

  const handleEthListenerAdd = (): void => {
    setIsEthListenerDialogOpen(true);
  };

  const handleEthListenerAddCancel = (): void => {
    setIsEthListenerDialogOpen(false);
  };

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchJson({
      url: "/eth-logger/add",
      method: "POST",
      data: values,
    });
  });

  const handleEthListenerAddConfirm = async (values: IEthListenerAddDto): Promise<void> => {
    await fn(void 0, values).finally(() => {
      setIsEthListenerDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <MenuItem onClick={handleEthListenerAdd}>
        <ListItemIcon>
          <DoNotDisturbOn fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.addListener" />
        </Typography>
      </MenuItem>
      <EthListenerAddDialog
        onCancel={handleEthListenerAddCancel}
        onConfirm={handleEthListenerAddConfirm}
        open={isEthListenerDialogOpen}
        initialValues={{
          address,
          listenerType: getListenerType(contract),
          fromBlock: contract.fromBlock,
        }}
      />
    </Fragment>
  );
};
