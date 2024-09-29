import { FC } from "react";
import { Grid } from "@mui/material";

import { EntityInput } from "@ethberry/mui-inputs-entity";
import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";
import { useApiCall } from "@ethberry/react-hooks";
import { FormWrapper } from "@ethberry/mui-form";
import { TokenType } from "@framework/types";

import { TokenInput } from "../../../../components/inputs/token";
import { validationSchema } from "./validation";

export const Infura: FC = () => {
  const { fn } = useApiCall((api, { tokenId }: { tokenId: number }) => {
    return api
      .fetchJson({
        url: `/infura/pin/${tokenId}`,
      })
      .then(console.info);
  });

  const handleSubmit = async (values: any, form: any): Promise<void> => {
    await fn(form, values);
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ipfs", "ipfs.infura"]} />

      <PageHeader message="pages.ipfs.infura.title" />

      <FormWrapper
        initialValues={{ contractId: 0, tokenId: 0 }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        showPrompt={false}
        testId="InfuraForm"
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
