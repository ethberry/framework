import { FC } from "react";
import { Collapse, Grid } from "@mui/material";
import { useIntl } from "react-intl";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { ContractStatus, ICompositionSearchDto, ModuleType, TokenType } from "@framework/types";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

interface IErc998CompositionSearchFormProps {
  onSubmit: (values: ICompositionSearchDto) => Promise<void>;
  initialValues: ICompositionSearchDto;
  open: boolean;
}

export const Erc998CompositionSearchForm: FC<IErc998CompositionSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { formatMessage } = useIntl();

  const { parentIds, childIds } = initialValues;
  const fixedValues = { parentIds, childIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="Erc998TokenSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput
              name="parentIds"
              controller="contracts"
              multiple
              data={{
                contractType: [TokenType.ERC998],
                contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
                contractModule: [ModuleType.HIERARCHY],
              }}
              label={formatMessage({ id: "form.labels.parent" })}
            />
          </Grid>
          <Grid item xs={6}>
            <EntityInput
              name="childIds"
              controller="contracts"
              multiple
              data={{
                contractType: [TokenType.ERC20, TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
                contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
                contractModule: [ModuleType.HIERARCHY],
              }}
              label={formatMessage({ id: "form.labels.child" })}
            />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
