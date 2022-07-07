import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";
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

export interface IAccessControlRevokeRoleDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { address: string };
}

export const AccessControlRevokeRoleDialog: FC<IAccessControlRevokeRoleDialogProps> = props => {
  const { data, ...rest } = props;

  const [rows, setRows] = useState<Array<IAccessControl>>([]);

  const { provider } = useWeb3React();
  const user = useUser<IUser>();

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/access-control/${data.address}`,
      });
    },
    { success: false },
  );

  const metaRevokeRole = useMetamask((values: IAccessControl) => {
    const contract = new Contract(data.address, IAccessControlSol.abi, provider?.getSigner());
    return contract.revokeRole(values.role, values.address) as Promise<void>;
  });

  const handleRevoke = (values: IAccessControl): (() => Promise<void>) => {
    return async () => {
      return metaRevokeRole(values);
    };
  };

  useEffect(() => {
    void fn().then((rows: Array<IAccessControl>) => {
      setRows(rows.filter(row => row.account !== user.profile.wallet));
    });
  }, []);

  return (
    <ConfirmationDialog message="dialogs.revokeRole" data-testid="AccessControlRevokeRoleDialog" {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        {rows.length ? (
          <List>
            {rows.map((access, i) => (
              <ListItem key={i}>
                <ListItemText>
                  {access.account} ({access.role})
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton onClick={handleRevoke(access)}>
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
