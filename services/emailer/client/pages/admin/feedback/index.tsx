import React, {FC, useContext} from "react";

import {IUserContext, UserContext} from "@trejgun/provider-user";

import {DataContext, IDataContext} from "../../../components/context/data/context";
import {IUser} from "@trejgun/solo-types";

export const Feedback: FC = () => {
  const data = useContext<IDataContext>(DataContext);
  const user = useContext<IUserContext<IUser>>(UserContext);

  return (
    <div>
      <h2>
        User {user.profile.firstName} {user.profile.lastName} ({user.profile.email}) left a feedback for us
      </h2>
      <dl>
        <dt>Rating: </dt>
        <dd>{data.feedback.rating}</dd>
        <dt>Tags: </dt>
        <dd>{data.feedback.tags.join(", ")}</dd>
        <dt>Text: </dt>
        <dd>{data.feedback.text}</dd>
      </dl>
    </div>
  );
};
