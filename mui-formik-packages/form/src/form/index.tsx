import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { PromptIfDirty } from "../prompt";
import { FormButtons } from "../buttons";

interface IFormProps {
  showButtons?: boolean;
  showPrompt?: boolean;
  submit?: string;
  onSubmit: (values: any, formikBag?: any) => void;
  className?: string;
  initialValues: any;
  validationSchema?: any;
  formSubmitButtonRef?: any;
  innerRef?: any;
}

export const FormikForm: FC<IFormProps> = props => {
  const {
    children,
    initialValues,
    onSubmit,
    showButtons,
    showPrompt,
    submit,
    formSubmitButtonRef,
    innerRef,
    className,
    validationSchema,
  } = props;

  const methods = useForm({
    mode: "all",
    defaultValues: initialValues,
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
  });

  console.log("methods", methods);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    onSubmit(methods.getValues(), methods);

    return false;
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className={className} ref={innerRef}>
        <PromptIfDirty visible={showPrompt} />

        {children}

        <FormButtons ref={formSubmitButtonRef} visible={showButtons} submit={submit} handleSubmit={handleSubmit} />
      </form>
    </FormProvider>
  );
};
