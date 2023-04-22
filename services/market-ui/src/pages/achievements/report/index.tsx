import { FC, useEffect, useState } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { AchievementRedeemButton } from "../../../components/buttons/achievements/redeem";
import { IAchievementRule, IAchievementItemReport } from "@framework/types";
import { ReportChart } from "./chart";

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
          <Grid
            item
            xs={6}
            key={rule.id}
            sx={{ display: "flex", alignItems: "center", flexDirection: "column", my: 2 }}
          >
            <ReportChart count={count.find(item => item.achievementRuleId === rule.id)!} achievementRule={rule} />
            <AchievementRedeemButton
              achievementRule={rule}
              count={count.find(item => item.achievementRuleId === rule.id)!}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};
