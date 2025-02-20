import { useEffect, useState } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import FormFieldWrapper from "~/components/FormFieldWrapper/FormFieldWrapper.tsx";
import { type FormFieldProps } from "~/config/types.ts";
import { toEnglishDigit } from "~/helpers/helpers.ts";


export default function FormFieldPhone(props: FormFieldProps<HTMLInputElement>) {
    const {
        name,
        label,
        required,
        unit,
        helperText,
        ...restProps
    } = props

    const formMethods = useFormContext()
    const controller = useController({ name, control: formMethods.control })
    const watch = useWatch({ name, control: formMethods.control })

    const formatValue = (value: string) => {
        value = toEnglishDigit(value ?? "")

        return value.length > 13
            ? value
                .slice(0, 13)
            : value
                .replace(/[^0-9]+/g, "")
                .split("")
                .reduce((acc, cur, currentIndex) => {
                    acc += (currentIndex === 3 || currentIndex === 7 ? " " : "") + cur;
                    return acc;
                }, "");
    };

    const [value, setValue] = useState<string>(formatValue(restProps.defaultValue?.toString() ?? ""));

    useEffect(() => {
        setValue(formatValue(watch));
    }, [watch]);


    return (
        <FormFieldWrapper
            name={name}
            label={label}
            required={required}
            unit={unit}
            helperText={helperText}
            // errorMessage={controller.fieldState.error?.message}
        >
            <input
                type="text"
                id={name}
                name={name}
                dir="ltr"
                inputMode="tel"
                placeholder="021"
                className={["form-control", controller.fieldState.error ? "form-control--error" : ""].filter(Boolean).join(" ")}
                value={formatValue(value)}
                onChange={event => {
                    controller.field.onChange(formatValue(event.target.value ?? "").replace(/[^0-9]+/g, ""))
                }}
                {...restProps}
            />
        </FormFieldWrapper>
    );
}