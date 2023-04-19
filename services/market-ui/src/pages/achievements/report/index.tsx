import { FC, useEffect } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";

export const AchievementReport: FC = () => {
  const { fn: getAchievementsRules } = useApiCall(async api => {
    return api.fetchJson({
      url: "/achievements/rules",
    });
  });

  const { fn: getAchievementsItemCount } = useApiCall(async api => {
    return api.fetchJson({
      url: "/achievements/items/count",
    });
  });

  useEffect(() => {
    void getAchievementsRules().then(console.info);
    void getAchievementsItemCount().then(console.info);
  }, []);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "achievements", "achievements.report"]} />

      <PageHeader message="pages.achievements.report.title" />
    </Grid>
  );
};
