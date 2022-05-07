import { ChangeEvent, FC, useState } from "react";
import { Grid, Tab, Tabs } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { Breadcrumbs } from "@gemunion/mui-page-layout";

import { CraftTabs } from "./tabs";
import { Resources } from "./resources";
import { Heroes } from "./heroes";
import { Items } from "./items";

export const Craft: FC = () => {
  const { tab = CraftTabs.resources } = useParams<{ tab: CraftTabs }>();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const [value, setValue] = useState(tab);

  const handleChange = (_event: ChangeEvent<any>, newValue: CraftTabs): void => {
    setValue(newValue);
    navigate(`/craft/${newValue === CraftTabs.items ? "" : newValue}`);
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "craft"]} />

      <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
        {Object.values(CraftTabs).map(tab => (
          <Tab key={tab} label={formatMessage({ id: `pages.craft.tabs.${tab}` })} value={tab} />
        ))}
      </Tabs>
      <br />
      <Heroes value={value} />
      <Items value={value} />
      <Resources value={value} />
    </Grid>
  );
};
