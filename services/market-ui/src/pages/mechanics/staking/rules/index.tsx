import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { formatItemHtmlList, formatPenalty } from "@framework/exchange";
import { ListAction, StyledPagination } from "@framework/styled";
import type { IStakingRule, IStakingRuleDepositSearchDto, IStakingRuleSearchDto } from "@framework/types";
import {
  DurationUnit,
  IStakingRuleRewardSearchDto,
  ModuleType,
  StakingDepositTokenType,
  StakingRewardTokenType,
} from "@framework/types";

import { StakingAllowanceButton, StakingDepositButton } from "../../../../components/buttons";
import { emptyContract } from "../../../../components/common/interfaces";
import { FormRefresher } from "../../../../components/forms/form-refresher";
import { normalizeDuration } from "../../../../utils/time";
import { StakingViewDialog } from "./view";
import {
  StyledCard,
  StyledCardActions,
  StyledCardContent,
  StyledExchangeTitle,
  StyledGrid,
  StyledImage,
  StyledList,
  StyledTableContainer,
  StyledTitle,
} from "./styled";

export const StakingRules: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isViewDialogOpen,
    handleView,
    handleViewCancel,
    handleViewConfirm,
    handleToggleFilters,
    handleSearch,
    handleChangePage,
    handleRefreshPage,
  } = useCollection<IStakingRule, IStakingRuleSearchDto>({
    baseUrl: "/staking/rules",
    empty: {
      title: "",
      imageUrl: "",
      contract: emptyContract,
      description: emptyStateString,
      deposit: emptyPrice,
      reward: emptyPrice,
      durationAmount: 2592000,
      durationUnit: DurationUnit.DAY,
      penalty: 100,
      recurrent: false,
    },
    search: {
      query: "",
      contractIds: [],
      deposit: {
        tokenType: [] as Array<StakingDepositTokenType>,
      } as IStakingRuleDepositSearchDto,
      reward: {
        tokenType: [] as Array<StakingRewardTokenType>,
      } as IStakingRuleRewardSearchDto,
    },
    filter: ({ id, title, imageUrl, contract, description, ...rest }) =>
      id
        ? { title, imageUrl, description, contract }
        : {
            title,
            imageUrl,
            description,
            contract,
            ...rest,
          },
  });

  const { formatMessage } = useIntl();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking", "staking.rules"]} />

      <PageHeader message="pages.staking.rules.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="StakingRuleSearchForm"
      >
        <FormRefresher onRefreshPage={handleRefreshPage} />
        <Grid container columnSpacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{ contractModule: [ModuleType.STAKING] }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              multiple
              name="deposit.tokenType"
              options={StakingDepositTokenType}
              label={formatMessage({ id: "form.labels.deposit" })}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              multiple
              name="reward.tokenType"
              options={StakingRewardTokenType}
              label={formatMessage({ id: "form.labels.reward" })}
            />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(rule => {
            const deposit = formatItemHtmlList(rule.deposit);
            const reward = formatItemHtmlList(rule.reward);

            return (
              <Grid item xs={12} sm={6} md={4} key={rule.id}>
                <StyledCard>
                  <StyledCardContent>
                    <StyledImage component="img" src={rule.imageUrl || ""} />
                    <StyledTitle variant="h6">{rule.title}</StyledTitle>
                    <Grid container spacing={2}>
                      <StyledGrid item xs={12} sm={rule.reward ? 6 : 12}>
                        <StyledExchangeTitle fontWeight={500}>
                          <FormattedMessage id="form.labels.deposit" />
                        </StyledExchangeTitle>
                        <StyledList component="ul">{deposit}</StyledList>
                      </StyledGrid>
                      {rule.reward ? (
                        <StyledGrid item xs={12} sm={6}>
                          <StyledExchangeTitle fontWeight={500}>
                            <FormattedMessage id="form.labels.reward" />
                          </StyledExchangeTitle>
                          <StyledList component="ul">{reward}</StyledList>
                        </StyledGrid>
                      ) : null}
                    </Grid>
                    <StyledTableContainer>
                      <Table aria-label="staking rules table">
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row">
                              <FormattedMessage id="form.labels.durationAmount" />
                            </TableCell>
                            <TableCell align="right">
                              {formatMessage(
                                { id: `enums.durationUnit.${rule.durationUnit}` },
                                {
                                  count: normalizeDuration({
                                    durationAmount: rule.durationAmount,
                                    durationUnit: rule.durationUnit,
                                  }),
                                },
                              )}
                            </TableCell>
                          </TableRow>
                          {rule.penalty ? (
                            <TableRow>
                              <TableCell component="th" scope="row">
                                <FormattedMessage id="form.labels.penalty" />
                              </TableCell>
                              <TableCell align="right">{formatPenalty(rule.penalty)}%</TableCell>
                            </TableRow>
                          ) : null}
                        </TableBody>
                      </Table>
                    </StyledTableContainer>
                  </StyledCardContent>
                  <StyledCardActions>
                    <StakingAllowanceButton rule={rule} />
                    <StakingDepositButton rule={rule} />
                    <ListAction onClick={handleView(rule)} message="form.tips.view" icon={Visibility} />
                  </StyledCardActions>
                </StyledCard>
              </Grid>
            );
          })}
        </Grid>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <StakingViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
