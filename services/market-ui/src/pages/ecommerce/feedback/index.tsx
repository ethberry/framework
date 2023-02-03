import { FC } from "react";

import { FormWrapper } from "@gemunion/mui-form";
import { TextArea } from "@gemunion/mui-inputs-core";
import { useApiCall } from "@gemunion/react-hooks";

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
  );
};
