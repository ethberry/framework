import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { ListItemText } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { ProgressOverlay } from "@ethberry/mui-page-layout";
import { ConfirmationDialog } from "@ethberry/mui-dialog-confirmation";
import { useMetamask } from "@ethberry/react-hooks-eth";
import { useApiCall } from "@ethberry/react-hooks";
import { ListAction, ListActions, StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IAccessControl } from "@framework/types";
import { AccessControlRoleHash } from "@framework/types";

import RenounceRoleABI from "@framework/abis/json/AccessControlFacet/renounceRole.json";

export interface IAccessControlRenounceRoleDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { address: string };
}

export const AccessControlRenounceRoleDialog: FC<IAccessControlRenounceRoleDialogProps> = props => {
  const { data, open, ...rest } = props;

  const [rows, setRows] = useState<Array<IAccessControl>>([]);

  const { account } = useWeb3React();

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/access-control/${data.address}`,
      });
    },
    { success: false },
  );

  const metaRenounceRole = useMetamask((values: IAccessControl, web3Context: Web3ContextType) => {
    const contract = new Contract(data.address, RenounceRoleABI, web3Context.provider?.getSigner());
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
    if (account && open) {
      void fn().then((rows: Array<IAccessControl>) => {
        setRows(rows.filter(row => row.account === account.toLocaleLowerCase()));
      });
    }
  }, [account, open]);

  return (
    <ConfirmationDialog
      message="dialogs.renounceRole"
      data-testid="AccessControlRenounceRoleDialog"
      open={open}
      {...rest}
    >
      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(access => (
            <StyledListItem key={access.id}>
              <ListItemText>
                {access.account}
                <br />
                {access.role}
              </ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleRenounce(access)}
                  message="form.buttons.delete"
                  dataTestId="AccessDeleteButton"
                  icon={Delete}
                />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
