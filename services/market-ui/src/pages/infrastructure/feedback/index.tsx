import { FC } from "react";
import { Grid } from "@mui/material";

import { FormWrapper } from "@ethberry/mui-form";
import { TextArea } from "@ethberry/mui-inputs-core";
import { useApiCall } from "@ethberry/react-hooks";
import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";

import { validationSchema } from "./validation";

export const Feedback: FC = () => {
  const { fn } = useApiCall((api, data) => {
    return api
      .fetchJson({
        url: "/feedback",
        method: "POST",
        data,
      })
      .then(console.info);
  });

  const handleSubmit = async (values: { test: string }, form: any) => {
    await fn(form, values);
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "feedback"]} />

      <PageHeader message={"pages.feedback.title"} />

      <FormWrapper
        initialValues={{
          text: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        showPrompt={false}
        testId="FeedbackForm"
      >
        <TextArea name="text" />
      </FormWrapper>
    </Grid>
  );
};
