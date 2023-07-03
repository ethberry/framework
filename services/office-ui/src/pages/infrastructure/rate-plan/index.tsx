import { ChangeEvent, FC, useEffect, useState } from "react";
import { Grid, Tab, Tabs } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useIntl } from "react-intl";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import type { IPaginationResult } from "@gemunion/types-collection";
import { IRatePlan, RatePlanType } from "@framework/types";

import { RatePlanTab } from "./tab";

export const RatePlan: FC = () => {
  const { tab = RatePlanType.BRONZE } = useParams<{ tab: RatePlanType }>();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const [value, setValue] = useState(tab);
  const [limits, setLimits] = useState<Array<IRatePlan>>([]);

  const { fn } = useApiCall(
    async api => {
      return api
        .fetchJson({
          url: "/rate-plans",
        })
        .then((json: IPaginationResult<IRatePlan>) => {
          setLimits(json.rows);
        });
    },
    { success: false },
  );

  const fetchRatePlans = (): Promise<void> => {
    return fn();
  };

  const handleChange = (_event: ChangeEvent<any>, newValue: RatePlanType): void => {
    setValue(newValue);
    navigate(`/rate-plans/${newValue === RatePlanType.BRONZE ? "" : newValue}`);
  };

  useEffect(() => {
    void fetchRatePlans();
  }, []);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "rate-plan"]} />

      <PageHeader message="pages.rate-plan.title" />

      <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange} sx={{ mb: 2 }}>
        {Object.values(RatePlanType).map(tab => (
          <Tab key={tab} label={formatMessage({ id: `pages.rate-plan.tabs.${tab}` })} value={tab} />
        ))}
      </Tabs>
      <RatePlanTab
        open={value === RatePlanType.BRONZE}
        limits={limits.filter(limit => limit.ratePlan === RatePlanType.BRONZE)}
      />
      <RatePlanTab
        open={value === RatePlanType.SILVER}
        limits={limits.filter(limit => limit.ratePlan === RatePlanType.SILVER)}
      />
      <RatePlanTab
        open={value === RatePlanType.GOLD}
        limits={limits.filter(limit => limit.ratePlan === RatePlanType.GOLD)}
      />
    </Grid>
  );
};
