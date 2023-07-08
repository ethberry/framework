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

import { Create, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import type { IPyramidRule, IPyramidRuleSearchDto, IPyramidRuleItemSearchDto } from "@framework/types";
import { PyramidRuleStatus, TokenType } from "@framework/types";

import { PyramidRuleCreateButton, PyramidToggleRuleButton } from "../../../../components/buttons";
import { PyramidEditDialog } from "./edit";
import { PyramidRuleSearchForm } from "./form";

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
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IPyramidRule, IPyramidRuleSearchDto>({
    baseUrl: "/pyramid/rules",
    filter: ({ title, description }) => ({
      title,
      description,
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
        <PyramidRuleCreateButton />
      </PageHeader>

      <PyramidRuleSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((rule, i) => (
            <ListItem key={i} disableGutters>
              <ListItemText>{rule.title}</ListItemText>
              <ListItemSecondaryAction>
                <PyramidToggleRuleButton rule={rule} />
                <IconButton onClick={handleEdit(rule)}>
                  <Create />
                </IconButton>
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
        readOnly={true}
      />
    </Grid>
  );
};
