import { FC } from "react";
import { Grid } from "@mui/material";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { FormWrapper } from "@gemunion/mui-form";
import { TokenType } from "@framework/types";
import { TokenInput } from "../../../../components/buttons/mechanics/staking/deposit-complex/dialog/token-input";

export const Pinata: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ipfs", "ipfs.pinata"]} />

      <PageHeader message="pages.ipfs.pinata.title" />

      <FormWrapper
        initialValues={{ contractId: 0, tokenId: 0 }}
        // validationSchema={validationSchema}
        onSubmit={() => Promise.resolve()}
        testId="PinataForm"
      >
        <EntityInput
          name="contractId"
          controller="contracts"
          data={{
            contractType: [TokenType.ERC721, TokenType.ERC998],
          }}
        />
        <TokenInput />
      </FormWrapper>
    </Grid>
  );
};
