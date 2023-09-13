import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardActions, CardContent, Toolbar, Typography } from "@mui/material";

import { useUser } from "@gemunion/provider-user";
import type { IToken, IUser } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { useCheckAccessMetadata } from "../../../../utils/use-check-access-metadata";
import { GradeButton } from "../../../../components/buttons";
import { TokenDiscreteView } from "./discrete";

export interface IDiscreteTokenPanelProps {
  token: IToken;
}

export const DiscreteTokenPanel: FC<IDiscreteTokenPanelProps> = props => {
  const { token } = props;

  const user = useUser<IUser>();
  const { checkAccessMetadata } = useCheckAccessMetadata();

  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (token.template?.contract?.address && user?.profile?.wallet) {
      void checkAccessMetadata(void 0, {
        account: user.profile.wallet,
        address: token.template.contract.address,
      })
        .then((json: { hasRole: boolean }) => {
          setHasAccess(json?.hasRole);
        })
        .catch(console.error);
    }
  }, [user?.profile?.wallet, token]);

  if (!token.template?.contract?.contractFeatures.includes(ContractFeatures.DISCRETE)) {
    return null;
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Toolbar disableGutters={true} sx={{ minHeight: "1em !important" }}>
          <Typography gutterBottom variant="h5" component="p" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="pages.token.discrete" />
          </Typography>
        </Toolbar>
        <TokenDiscreteView metadata={token.metadata} />
      </CardContent>
      <CardActions>
        <GradeButton token={token} disabled={!hasAccess} />
      </CardActions>
    </Card>
  );
};
