import { FC, Fragment, useContext } from "react";

import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";
import { IUserContext, UserContext } from "@ethberry/provider-user";
import type { IUser } from "@framework/types";

import { UserForm } from "./user-form";
import { GuestForm } from "./guest-form";
import { Cart } from "./cart";

export const Checkout: FC = () => {
  const user = useContext<IUserContext<IUser>>(UserContext);

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "ecommerce", "checkout"]} />

      <PageHeader message="pages.checkout.title" />

      <Cart />

      {user.isAuthenticated() ? <UserForm /> : <GuestForm />}
    </Fragment>
  );
};
