import { FC } from "react";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

import { history } from "@gemunion/history";

import { Providers } from "./profiders";
import { Routes } from "./routes";

const App: FC = () => {
  return (
    <HistoryRouter history={history}>
      <Providers>
        <Routes />
      </Providers>
    </HistoryRouter>
  );
};

export default App;
