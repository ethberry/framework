import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { useApiCall } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions } from "@framework/mui-lists";
import type { IAccessControl, IContract, IUser } from "@framework/types";
import { AccessControlRoleHash } from "@framework/types";

import RevokeRoleABI from "../../../../../abis/extensions/revoke-role/revokeRole.abi.json";

export interface IAccessControlRevokeRoleDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { address: string };
}

export interface IAccessControlWithRelations extends IAccessControl {
  address_contract: IContract;
  account_contract: IContract;
}

export const AccessControlRevokeRoleDialog: FC<IAccessControlRevokeRoleDialogProps> = props => {
  const { data, open, ...rest } = props;

  const [rows, setRows] = useState<Array<IAccessControlWithRelations>>([]);

  const { profile } = useUser<IUser>();

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/access-control/${data.address}`,
      });
    },
    { success: false },
  );

  const metaRevokeRole = useMetamask((values: IAccessControlWithRelations, web3Context: Web3ContextType) => {
    const contract = new Contract(data.address, RevokeRoleABI, web3Context.provider?.getSigner());
    return contract.revokeRole(
      Object.values(AccessControlRoleHash)[
        Object.keys(AccessControlRoleHash).indexOf(values.role as unknown as AccessControlRoleHash)
      ],
      values.account,
    ) as Promise<void>;
  });

  const handleRevoke = (values: IAccessControlWithRelations): (() => Promise<void>) => {
    return async () => {
      return metaRevokeRole(values);
    };
  };

  useEffect(() => {
    if (open) {
      void fn().then((rows: Array<IAccessControlWithRelations>) => {
        setRows(rows.filter(row => row.account !== profile.wallet));
      });
    }
  }, [open]);

  return (
    <ConfirmationDialog message="dialogs.revokeRole" data-testid="AccessControlRevokeRoleDialog" open={open} {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        {rows.length ? (
          <List>
            {rows.map(access => (
              <ListItem key={access.id}>
                <ListItemText>
                  {access.account_contract?.title || access.account}
                  {/* <br /> */}
                  {/* {access.account} */}
                  <br />
                  {access.role}
                </ListItemText>
                <ListActions>
                  <ListAction onClick={handleRevoke(access)} icon={Delete} message="dialogs.revokeRole" />
                </ListActions>
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
