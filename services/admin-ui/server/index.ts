import "./configs/env";

import app from "./configs/express";

import assets from "./routes/common/assets";
import main from "./routes/common/main";
import fe from "./routes/common/fe";

app.use(assets);
app.use(main);
app.use(fe);

app.listen(process.env.PORT, process.env.HOST, () => {
  console.info(`Express server listening on port http://${process.env.HOST}:${process.env.PORT}/`);
});

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

export default app;
