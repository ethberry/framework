import { FC } from "react";
import { FormattedMessage } from "react-intl";
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
} from "@mui/material";

import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { IPyramidRule, IPyramidRuleSearchDto } from "@framework/types";
import { DurationUnit, IPyramidRuleItemSearchDto, PyramidRuleStatus, TokenType } from "@framework/types";

import { PyramidUploadButton } from "../../../../components/buttons";
import { emptyPrice } from "../../../../components/inputs/price/empty-price";
import { cleanUpAsset } from "../../../../utils/money";
import { PyramidEditDialog } from "./edit";
import { PyramidRuleSearchForm } from "./form";
import { PyramidFinalizeTokenButton } from "../../../../components/buttons/mechanics/pyramid/finalize/finalize-token";
import { PyramidFinalizeRuleButton } from "../../../../components/buttons/mechanics/pyramid/finalize/finalize-rule";

export const PyramidRules: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleCreate,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IPyramidRule, IPyramidRuleSearchDto>({
    baseUrl: "/pyramid/rules",
    empty: {
      title: "",
      description: emptyStateString,
      deposit: emptyPrice,
      reward: emptyPrice,
      durationAmount: 2592000,
      durationUnit: DurationUnit.DAY,
      penalty: 100,
      contractId: 1,
    },
    filter: ({ deposit, reward, contractId, ...rest }) => ({
      ...rest,
      contractId,
      deposit: cleanUpAsset(deposit),
      reward: cleanUpAsset(reward),
    }),
    search: {
      query: "",
      pyramidRuleStatus: [PyramidRuleStatus.ACTIVE, PyramidRuleStatus.NEW],
      deposit: {
        tokenType: [] as Array<TokenType>,
      } as IPyramidRuleItemSearchDto,
      reward: {
        tokenType: [] as Array<TokenType>,
      } as IPyramidRuleItemSearchDto,
    },
  });

  // TODO - disable editing for ACTIVE rules, only View!!!
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "pyramid", "pyramid.rules"]} />

      <PageHeader message="pages.pyramid.rules.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="PyramidCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <PyramidRuleSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((rule, i) => (
            <ListItem key={i} disableGutters>
              <ListItemText>{rule.title}</ListItemText>
              <ListItemText>{rule.contract ? (rule.contract.title ? rule.contract.title : "") : ""}</ListItemText>
              <ListItemSecondaryAction>
                <PyramidUploadButton rule={rule} />
                <IconButton onClick={handleEdit(rule)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(rule)} disabled={rule.pyramidRuleStatus !== PyramidRuleStatus.NEW}>
                  <Delete />
                </IconButton>
                <PyramidFinalizeRuleButton rule={rule} />
                <PyramidFinalizeTokenButton rule={rule} />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={{ ...selected, title: `${selected.title}` }}
      />

      <PyramidEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
        readOnly={selected.pyramidRuleStatus === PyramidRuleStatus.ACTIVE}
      />
    </Grid>
  );
};
