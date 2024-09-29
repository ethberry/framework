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
import type { IAccessControl, IContract } from "@framework/types";
import { AccessControlRoleHash } from "@framework/types";
import AccessControlFacetRevokeRoleABI from "@framework/abis/json/AccessControlFacet/revokeRole.json";

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

  const { account } = useWeb3React();

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/access-control/${data.address}`,
      });
    },
    { success: false },
  );

  const metaRevokeRole = useMetamask((values: IAccessControlWithRelations, web3Context: Web3ContextType) => {
    const contract = new Contract(data.address, AccessControlFacetRevokeRoleABI, web3Context.provider?.getSigner());
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
    if (account && open) {
      void fn().then((rows: Array<IAccessControlWithRelations>) => {
        setRows(rows.filter(row => row.account !== account));
      });
    }
  }, [account, open]);

  return (
    <ConfirmationDialog message="dialogs.revokeRole" data-testid="AccessControlRevokeRoleDialog" open={open} {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(access => (
            <StyledListItem key={access.id}>
              <ListItemText>
                {access.account_contract?.title || access.account}
                <br />
                {access.role}
              </ListItemText>
              <ListActions>
                <ListAction onClick={handleRevoke(access)} message="dialogs.revokeRole" icon={Delete} />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
