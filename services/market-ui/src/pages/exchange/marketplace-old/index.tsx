import { ChangeEvent, FC, Fragment, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";

import { Breadcrumbs } from "@ethberry/mui-page-layout";

import { MarketplaceTabs } from "./tabs";
import { Erc721 } from "./erc721";
import { Erc998 } from "./erc998";
import { Erc1155 } from "./erc1155";
import { Mystery } from "./mystery";

export const MarketplaceOld: FC = () => {
  const { tab = MarketplaceTabs.erc721 } = useParams<{ tab: MarketplaceTabs }>();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const [value, setValue] = useState(tab);

  const handleChange = (_event: ChangeEvent<any>, newValue: MarketplaceTabs): void => {
    setValue(newValue);
    navigate(`/marketplace/${newValue === MarketplaceTabs.erc721 ? "" : newValue}`);
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
      <Erc721 value={value} />
      <Erc998 value={value} />
      <Erc1155 value={value} />
      <Mystery value={value} />
    </Fragment>
  );
};
