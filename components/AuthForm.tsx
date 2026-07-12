'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ZodType } from "zod";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import ImageUpload from "./ImageUpload";

interface Props<T extends FieldValues> {
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{success: boolean, error?:string}>;
    type: 'SIGN_IN' |'SIGN_UP';
}

const AuthForm = <T extends FieldValues> ({ type, schema, defaultValues, onSubmit}: Props<T>) => {
    const isSignIn = type === 'SIGN_IN';
    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    });

    const handleSubmit: SubmitHandler<T> = async(data) => {}

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-white">
                {isSignIn ? 'Welcome back to BookWise' : 'Create Your library account'}
            </h1>

            <p className="text-light-100">
                {isSignIn 
                    ? 'Access the vast collection of resources, and stay updated' 
                    : 'Please complete all fields and upload a valid university ID to gain access to the library'
                }
            </p>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6">
                {Object.keys(defaultValues).map((field) => (
                    <Controller
                        key={field}
                        control={form.control}
                        name={field as Path<T>}
                        render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="capitalize">{FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}</FieldLabel>
                            {field.name === 'universityCard' ? ( <ImageUpload /> 
                            ) : (
                               <Input
                                    required
                                    {...field}
                                    id={field.name}
                                    type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                                    aria-invalid={fieldState.invalid}
                                    className="form-input"
                                /> 
                            )}
                        </Field>
                        )}
                    />
                ))}
                

                <Button type="submit" className="form-btn">
                    {isSignIn ? 'Sign In' : 'Sign Up'}
                </Button>
            </form>

            <p className="text-center text-base font-medium">
                {isSignIn ? 'New to BookWise? ' : 'Already have an acccount? '}

                <Link href={isSignIn ? '/sign-up' : '/sign-in'} className="font-bold text-primary">
                    {isSignIn ? 'Create an account' : 'Sign in'}
                </Link>
            </p>
        </div>
        
    );
};

export default AuthForm;