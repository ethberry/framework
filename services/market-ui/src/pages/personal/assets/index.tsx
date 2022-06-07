import { ChangeEvent, FC, Fragment, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { Breadcrumbs } from "@gemunion/mui-page-layout";

import { AssetsTabs } from "./tabs";
import { Resources } from "./resources";
import { Heroes } from "./heroes";
import { Items } from "./items";

export const MyAssets: FC = () => {
  const { tab = AssetsTabs.heroes } = useParams<{ tab: AssetsTabs }>();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const [value, setValue] = useState(tab);

  const handleChange = (_event: ChangeEvent<any>, newValue: AssetsTabs): void => {
    setValue(newValue);
    navigate(`/my-assets/${newValue === AssetsTabs.items ? "" : newValue}`);
  };

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "assets"]} />

      <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
        {Object.values(AssetsTabs).map(tab => (
          <Tab key={tab} label={formatMessage({ id: `pages.assets.tabs.${tab}` })} value={tab} />
        ))}
      </Tabs>
      <br />
      <Heroes value={value} />
      <Items value={value} />
      <Resources value={value} />
    </Fragment>
  );
};
