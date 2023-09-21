import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { useApiCall } from "@gemunion/react-hooks";
import type { IContract, ICraftCountResult } from "@framework/types";

export interface ICraftContactPanelProps {
  contract: IContract;
}

export const CraftContactPanel: FC<ICraftContactPanelProps> = props => {
  const { contract } = props;

  const [count, setCount] = useState<number>(0);

  const { fn, isLoading } = useApiCall(
    async api => {
      return contract.id
        ? api.fetchJson({
            url: "/recipes/craft/count",
            method: "POST",
            data: {
              contractId: contract.id,
            },
          })
        : new Error(); // just skip
    },
    { success: false, error: false },
  );

  useEffect(() => {
    void fn().then(({ count }: ICraftCountResult) => {
      setCount(count);
    });
  }, []);

  if (isLoading) {
    return null;
  }

  if (!count) {
    return null;
  }

  return (
    <Button type="button" variant="contained" component={RouterLink} to={`/craft?contractId=${contract.id}`}>
      <FormattedMessage id="form.buttons.craft" />
    </Button>
  );
};
