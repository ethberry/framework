import { FC, useEffect, useState } from "react";

import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IAchievementItemReport, IAchievementRule } from "@framework/types";

import { AchievementRedeemButton } from "../../../components/buttons/achievements/redeem";
import { AchievementInfoPopover } from "./popover";
import { ReportChart } from "./chart";
import { StyledGrid, StyledTitle } from "./styled";

export const AchievementReport: FC = () => {
  const [rules, setRules] = useState<Array<IAchievementRule>>([]);
  const [count, setCount] = useState<Array<IAchievementItemReport>>([]);

  const { fn: getAchievementsRules } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/achievements/rules",
      });
    },
    { success: false },
  );

  const { fn: getAchievementsItemCount } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/achievements/items/count",
      });
    },
    { success: false },
  );

  useEffect(() => {
    void getAchievementsRules().then(({ rows }) => {
      setRules(rows);
    });
    void getAchievementsItemCount().then(rows => {
      setCount(rows);
    });
  }, []);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "achievements", "achievements.report"]} />

      <PageHeader message="pages.achievements.report.title" />

      <Grid container>
        {rules.map(rule => (
          <StyledGrid item xs={6} key={rule.id}>
            <StyledTitle variant="h5">
              <pre>{rule.title}</pre>
            </StyledTitle>
            <AchievementInfoPopover rule={rule} count={count.find(item => item.achievementRuleId === rule.id)!} />
            <ReportChart count={count.find(item => item.achievementRuleId === rule.id)!} achievementRule={rule} />
            <AchievementRedeemButton
              achievementRule={rule}
              count={count.find(item => item.achievementRuleId === rule.id)!}
            />
          </StyledGrid>
        ))}
      </Grid>
    </Grid>
  );
};
