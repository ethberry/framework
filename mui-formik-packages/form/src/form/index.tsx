import { FC } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { PromptIfDirty } from "../prompt";
import { FormButtons } from "../buttons";

interface IFormWrapperProps<T> {
  showButtons?: boolean;
  showPrompt?: boolean;
  submit?: string;
  onSubmit: (values: T, form?: UseFormReturn) => void;
  className?: string;
  initialValues: T;
  validationSchema?: any;
  formSubmitButtonRef?: any;
  innerRef?: any;
}

export const FormWrapper: FC<IFormWrapperProps<any>> = props => {
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

  const form = useForm({
    mode: "all",
    defaultValues: initialValues,
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    onSubmit(form.getValues(), form);

    return false;
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={className} ref={innerRef}>
        <PromptIfDirty visible={showPrompt} />

        {children}

        <FormButtons ref={formSubmitButtonRef} visible={showButtons} submit={submit} handleSubmit={handleSubmit} />
      </form>
    </FormProvider>
  );
};
