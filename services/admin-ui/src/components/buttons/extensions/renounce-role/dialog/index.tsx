import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { List, ListItemText, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { useApiCall } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions, StyledListItem } from "@framework/styled";
import type { IAccessControl, IUser } from "@framework/types";
import { AccessControlRoleHash } from "@framework/types";
import renounceRoleAccessControlFacetABI from "@framework/abis/renounceRole/AccessControlFacet.json";

export interface IAccessControlRenounceRoleDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { address: string };
}

export const AccessControlRenounceRoleDialog: FC<IAccessControlRenounceRoleDialogProps> = props => {
  const { data, open, ...rest } = props;

  const [rows, setRows] = useState<Array<IAccessControl>>([]);

  const { profile } = useUser<IUser>();

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/access-control/${data.address}`,
      });
    },
    { success: false },
  );

  const metaRenounceRole = useMetamask((values: IAccessControl, web3Context: Web3ContextType) => {
    const contract = new Contract(data.address, renounceRoleAccessControlFacetABI, web3Context.provider?.getSigner());
    return contract.renounceRole(
      Object.values(AccessControlRoleHash)[
        Object.keys(AccessControlRoleHash).indexOf(values.role as unknown as AccessControlRoleHash)
      ],
      values.account,
    ) as Promise<void>;
  });

  const handleRenounce = (values: IAccessControl): (() => Promise<void>) => {
    return async () => {
      return metaRenounceRole(values);
    };
  };

  useEffect(() => {
    if (open) {
      void fn().then((rows: Array<IAccessControl>) => {
        setRows(rows.filter(row => row.account === profile.wallet));
      });
    }
  }, [open]);

  return (
    <ConfirmationDialog
      message="dialogs.renounceRole"
      data-testid="AccessControlRenounceRoleDialog"
      open={open}
      {...rest}
    >
      <ProgressOverlay isLoading={isLoading}>
        {rows.length ? (
          <List>
            {rows.map(access => (
              <StyledListItem key={access.id}>
                <ListItemText>
                  {access.account}
                  <br />
                  {access.role}
                </ListItemText>
                <ListActions>
                  <ListAction onClick={handleRenounce(access)} message="form.buttons.delete" icon={Delete} />
                </ListActions>
              </StyledListItem>
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
