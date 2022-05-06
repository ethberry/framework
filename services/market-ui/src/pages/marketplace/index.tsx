import { ChangeEvent, FC, Fragment, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";

import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";

import { MarketplaceTabs } from "./tabs";
import { Resources } from "./resources";
import { Heroes } from "./heroes";
import { Items } from "./items";

import { HeroesDropbox } from "./heroes-dropbox";
import { ItemsDropbox } from "./items-dropbox";

export const Marketplace: FC = () => {
  const { tab = MarketplaceTabs.heroes } = useParams<{ tab: MarketplaceTabs }>();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const [value, setValue] = useState(tab);

  const handleChange = (_event: ChangeEvent<any>, newValue: MarketplaceTabs): void => {
    setValue(newValue);
    navigate(`/marketplace/${newValue === MarketplaceTabs.resources ? "" : newValue}`);
  };

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "marketplace"]} />

      <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
        {Object.values(MarketplaceTabs).map(tab => (
          <Tab key={tab} label={formatMessage({ id: `pages.marketplace.tabs.${tab}` })} value={tab} />
        ))}
      </Tabs>
      <br />
      <Heroes value={value} />
      <HeroesDropbox value={value} />
      <Items value={value} />
      <ItemsDropbox value={value} />
      <Resources value={value} />
    </Fragment>
  );
};
