import { ChangeEvent, FC, Fragment } from "react";
import { Tab, Tabs } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";

import { NodeEnv } from "@ethberry/constants";

import { ProfileTabs } from "./tabs";
import { ProfileAddresses } from "./adresses";
import { ProfileGeneral } from "./general";
import { ProfileSubscriptions } from "./subscriptions";
import { ProfileSettings } from "./settings";

export const Profile: FC = () => {
  const { tab = ProfileTabs.general } = useParams<{ tab: ProfileTabs }>();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const handleChange = (_event: ChangeEvent<any>, newValue: ProfileTabs): void => {
    navigate(`/profile/${newValue === ProfileTabs.general ? "" : newValue}`);
  };

  const isProd = process.env.NODE_ENV === NodeEnv.production;

  return (
    <Fragment>
      <Tabs value={tab} indicatorColor="primary" textColor="primary" onChange={handleChange} sx={{ mb: 2 }}>
        {Object.values(ProfileTabs).map(tab =>
          isProd && tab === ProfileTabs.addresses ? null : (
            <Tab key={tab} label={formatMessage({ id: `pages.profile.tabs.${tab}` })} value={tab} />
          ),
        )}
      </Tabs>
      <ProfileGeneral open={tab === ProfileTabs.general} />
      {!isProd ? <ProfileAddresses open={tab === ProfileTabs.addresses} /> : null}
      <ProfileSubscriptions open={tab === ProfileTabs.subscriptions} />
      <ProfileSettings open={tab === ProfileTabs.settings} />
    </Fragment>
  );
};
