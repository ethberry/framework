import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { useApiCall } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { IAccessControl, IUser } from "@framework/types";
import IAccessControlSol from "@framework/core-contracts/artifacts/@openzeppelin/contracts/access/IAccessControl.sol/IAccessControl.json";

export interface IAccessControlRenounceRoleDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { address: string };
}

export const AccessControlRenounceRoleDialog: FC<IAccessControlRenounceRoleDialogProps> = props => {
  const { data, ...rest } = props;

  const [rows, setRows] = useState<Array<IAccessControl>>([]);

  const user = useUser<IUser>();

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/access-control/${data.address}`,
      });
    },
    { success: false },
  );

  const metaRenounceRole = useMetamask((values: IAccessControl, web3Context: Web3ContextType) => {
    const contract = new Contract(data.address, IAccessControlSol.abi, web3Context.provider?.getSigner());
    return contract.renounceRole(values.role, values.address) as Promise<void>;
  });

  const handleRenounce = (values: IAccessControl): (() => Promise<void>) => {
    return async () => {
      return metaRenounceRole(values);
    };
  };

  useEffect(() => {
    void fn().then((rows: Array<IAccessControl>) => {
      setRows(rows.filter(row => row.account === user.profile.wallet));
    });
  }, []);

  return (
    <ConfirmationDialog message="dialogs.renounceRole" data-testid="AccessControlRenounceRoleDialog" {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        {rows.length ? (
          <List>
            {rows.map((access, i) => (
              <ListItem key={i}>
                <ListItemText>
                  {access.account} ({access.role})
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton onClick={handleRenounce(access)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>
            <FormattedMessage id="messages.empty-list" />
          </Typography>
        )}
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
