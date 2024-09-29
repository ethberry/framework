import React, { PropsWithChildren } from "react";

import { ProgressOverlay } from "@ethberry/mui-page-layout";
import { IAccessControl } from "@framework/types";
import { ListItemProvider, StyledListWrapper } from "@framework/styled";

import { useCheckPermissions } from "../../../shared";

interface IWithCheckPermissionsListWrapper {
  isLoading: boolean;
  count: number;
}

export const WithCheckPermissionsListWrapper = (props: PropsWithChildren<IWithCheckPermissionsListWrapper>) => {
  const { checkPermissions } = useCheckPermissions();

  return (
    <ProgressOverlay isLoading={props.isLoading}>
      <ListItemProvider<IAccessControl> callback={checkPermissions}>
        <StyledListWrapper count={props.count} isLoading={props.isLoading}>
          {props.children}
        </StyledListWrapper>
      </ListItemProvider>
    </ProgressOverlay>
  );
};
