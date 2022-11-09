import { FC, Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { IconButton, ListItemIcon, MenuItem, Tooltip, Typography } from "@mui/material";
import { DoNotDisturbOff } from "@mui/icons-material";
import { useApiCall } from "@gemunion/react-hooks";

import { EthListenerRemoveDialog, IEthListenerRemoveDto, ListenerType } from "./edit";
import { getListenerType } from "../../../../utils/listener-type";
import { ModuleType, TokenType } from "@framework/types";

export interface IListenerTypeProps {
  address: string;
  contractType?: TokenType;
  contractModule?: ModuleType;
  isVesting?: boolean;
}

export interface IEthListenerRemoveMenuItemProps {
  // contract?: IContract;
  itemType: IListenerTypeProps;
}

export const EthListenerRemoveMenuItem: FC<IEthListenerRemoveMenuItemProps> = props => {
  const {
    // contract,
    // contract: { address },
    itemType: { address, contractType, contractModule, isVesting },
  } = props;

  const { formatMessage } = useIntl();

  const [isEthListenerDialogOpen, setIsEthListenerDialogOpen] = useState(false);

  const handleEthListenerRemove = (): void => {
    setIsEthListenerDialogOpen(true);
  };

  const handleEthListenerRemoveCancel = (): void => {
    setIsEthListenerDialogOpen(false);
  };

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchJson({
      url: "/eth-logger/Remove",
      method: "POST",
      data: values,
    });
  });

  const handleEthListenerRemoveConfirm = async (values: IEthListenerRemoveDto): Promise<void> => {
    await fn(void 0, values).finally(() => {
      setIsEthListenerDialogOpen(false);
    });
  };

  return (
    <Fragment>
      {isVesting ? (
        <Tooltip title={formatMessage({ id: "form.buttons.removeListener" })}>
          <IconButton onClick={handleEthListenerRemove} data-testid="VestingRemoveListenerButton">
            <DoNotDisturbOff />
          </IconButton>
        </Tooltip>
      ) : (
        <MenuItem onClick={handleEthListenerRemove}>
          <ListItemIcon>
            <DoNotDisturbOff fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">
            <FormattedMessage id="form.buttons.removeListener" />
          </Typography>
        </MenuItem>
      )}
      <EthListenerRemoveDialog
        onCancel={handleEthListenerRemoveCancel}
        onConfirm={handleEthListenerRemoveConfirm}
        open={isEthListenerDialogOpen}
        initialValues={{
          address,
          listenerType: getListenerType({ contractType, contractModule, isVesting }) || ListenerType.ERC20,
        }}
      />
    </Fragment>
  );
};
