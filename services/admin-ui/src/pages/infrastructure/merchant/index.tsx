import { ChangeEvent, FC, Fragment, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";

import { PageHeader } from "@gemunion/mui-page-layout";

import { MerchantTabs } from "./tabs";
import { MerchantGeneral } from "./general";
import { MerchantManagers } from "./managers";

export const Merchant: FC = () => {
  const { tab = MerchantTabs.general } = useParams<{ tab: MerchantTabs }>();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const [value, setValue] = useState(tab);

  const handleChange = (_event: ChangeEvent<any>, newValue: MerchantTabs): void => {
    setValue(newValue);
    navigate(`/merchant/${newValue === MerchantTabs.general ? "" : newValue}`);
  };

  return (
    <Fragment>
      <PageHeader message="pages.merchant.title" />

      <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange} sx={{ mb: 2 }}>
        {Object.values(MerchantTabs).map(tab => (
          <Tab key={tab} label={formatMessage({ id: `pages.merchant.tabs.${tab}` })} value={tab} />
        ))}
      </Tabs>
      <MerchantGeneral open={value === MerchantTabs.general} />
      <MerchantManagers open={value === MerchantTabs.managers} />
    </Fragment>
  );
};
