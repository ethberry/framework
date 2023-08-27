import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { DoNotDisturbOff } from "@mui/icons-material";

import { useApiCall } from "@gemunion/react-hooks";
import { IContract, NodeEnv } from "@framework/types";

import { EthListenerRemoveDialog, IEthListenerRemoveDto } from "./dialog";
import { getListenerType } from "../../../../utils/listener-type";

export interface IEthListenerRemoveMenuItemProps {
  contract: IContract;
}

export const EthListenerRemoveMenuItem: FC<IEthListenerRemoveMenuItemProps> = props => {
  const { contract } = props;

  const [isEthListenerDialogOpen, setIsEthListenerDialogOpen] = useState(false);

  const handleEthListenerRemove = (): void => {
    setIsEthListenerDialogOpen(true);
  };

  const handleEthListenerRemoveCancel = (): void => {
    setIsEthListenerDialogOpen(false);
  };

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchJson({
      url: "/eth-logger/remove",
      method: "POST",
      data: values,
    });
  });

  const handleEthListenerRemoveConfirm = async (values: IEthListenerRemoveDto): Promise<void> => {
    await fn(void 0, values).finally(() => {
      setIsEthListenerDialogOpen(false);
    });
  };

  if (process.env.NODE_ENV === NodeEnv.production) {
    return null;
  }

  return (
    <Fragment>
      <MenuItem onClick={handleEthListenerRemove}>
        <ListItemIcon>
          <DoNotDisturbOff fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.removeListener" />
        </Typography>
      </MenuItem>
      <EthListenerRemoveDialog
        onCancel={handleEthListenerRemoveCancel}
        onConfirm={handleEthListenerRemoveConfirm}
        open={isEthListenerDialogOpen}
        initialValues={{
          address: contract.address,
          listenerType: getListenerType(contract),
        }}
      />
    </Fragment>
  );
};
