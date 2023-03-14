import { FC, Fragment, useContext } from "react";

import { PageHeader } from "@gemunion/mui-page-layout";
import { IUserContext, UserContext } from "@gemunion/provider-user";
import { IUser } from "@framework/types";

import { UserForm } from "./user-form";
import { GuestForm } from "./guest-form";
import { Cart } from "./cart";

export const Checkout: FC = () => {
  const user = useContext<IUserContext<IUser>>(UserContext);

  return (
    <Fragment>
      <PageHeader message="pages.checkout.title" />

      <Cart />

      {user.isAuthenticated() ? <UserForm /> : <GuestForm />}
    </Fragment>
  );
};
