"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export const Form = FormProvider;

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />;
}

export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["space-y-2", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function FormLabel(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="text-sm font-medium leading-none" {...props} />;
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function FormDescription(
  props: React.HTMLAttributes<HTMLParagraphElement>,
) {
  return <p className="text-sm text-muted-foreground" {...props} />;
}

export function FormMessage() {
  const {
    formState: { errors },
  } = useFormContext();

  const error = Object.values(errors)[0] as { message?: string } | undefined;

  if (!error?.message) return null;

  return <p className="text-sm font-medium text-red-500">{error.message}</p>;
}
