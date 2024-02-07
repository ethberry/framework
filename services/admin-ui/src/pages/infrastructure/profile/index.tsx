import { ChangeEvent, FC, Fragment, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";

import { NodeEnv } from "@framework/types";

import { ProfileTabs } from "./tabs";
import { ProfileAddresses } from "./adresses";
import { ProfileGeneral } from "./general";
import { ProfileNotifications } from "./notifications";
import { ProfileSubscriptions } from "./subscriptions";
import { ProfileSettings } from "./settings";

export const Profile: FC = () => {
  const { tab = ProfileTabs.general } = useParams<{ tab: ProfileTabs }>();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const [value, setValue] = useState(tab);

  const handleChange = (_event: ChangeEvent<any>, newValue: ProfileTabs): void => {
    setValue(newValue);
    navigate(`/profile/${newValue === ProfileTabs.general ? "" : newValue}`);
  };

  const shouldHideAddress = process.env.NODE_ENV === NodeEnv.production;

  return (
    <Fragment>
      <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange} sx={{ mb: 2 }}>
        {Object.values(ProfileTabs).map(tab =>
          shouldHideAddress && tab === ProfileTabs.addresses ? null : (
            <Tab key={tab} label={formatMessage({ id: `pages.profile.tabs.${tab}` })} value={tab} />
          ),
        )}
      </Tabs>
      <ProfileGeneral open={value === ProfileTabs.general} />
      {!shouldHideAddress ? <ProfileAddresses open={value === ProfileTabs.addresses} /> : null}
      <ProfileSubscriptions open={value === ProfileTabs.subscriptions} />
      <ProfileNotifications open={value === ProfileTabs.notifications} />
      <ProfileSettings open={value === ProfileTabs.settings} />
    </Fragment>
  );
};
