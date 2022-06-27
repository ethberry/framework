import { ChangeEvent, FC, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Grid } from "@mui/material";

import { EntityInput, IAutocompleteOption } from "@gemunion/mui-inputs-entity";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { Erc20TokenStatus } from "@framework/types";

export const Erc20PriceInput: FC = () => {
  const [decimals, setDecimals] = useState(18);

  const form = useFormContext<any>();

  return (
    <Grid container>
      <Grid item xs={10}>
        <EthInput name="price" symbol="" units={decimals} />
      </Grid>
      <Grid item xs={2}>
        <EntityInput
          name="erc20TokenId"
          controller="erc20-tokens"
          data={{
            tokenStatus: [Erc20TokenStatus.ACTIVE],
          }}
          onChange={(
            _event: ChangeEvent<unknown>,
            options: Array<IAutocompleteOption> | IAutocompleteOption | null,
          ): void => {
            const option = options as IAutocompleteOption | null;
            if (option) {
              const { id, decimals } = option;
              form.setValue("erc20TokenId", id, { shouldTouch: true });
              setDecimals(decimals as number);
            }
          }}
        />
      </Grid>
    </Grid>
  );
};
