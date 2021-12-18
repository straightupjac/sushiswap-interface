import { DEFAULT_FORM_FIELD_CLASSNAMES } from 'app/components/Form'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import React, { FC, ReactElement } from 'react'
import { useFormContext } from 'react-hook-form'

import FormFieldHelperText from '../FormFieldHelperText'

export interface FormSelectFieldProps extends React.HTMLProps<HTMLSelectElement> {
  error?: string
  helperText?: string
  children?: ReactElement<HTMLInputElement>
  options: { value: string; label: string }[]
}

const FormSelectField: FC<FormSelectFieldProps> = ({ name, label, children, helperText, error, options, ...rest }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <Typography weight={700}>{label}</Typography>
      <div className="mt-2 flex rounded-md shadow-sm">
        <select
          {...register(name)}
          {...rest}
          className={classNames(DEFAULT_FORM_FIELD_CLASSNAMES, errors[name] ? '!border-red' : '')}
        >
          {options.map(({ value, label }) => (
            <option value={label} key={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {errors[error] ? (
        <FormFieldHelperText className="!text-red">{errors[error].name}</FormFieldHelperText>
      ) : (
        <FormFieldHelperText>{helperText}</FormFieldHelperText>
      )}
    </>
  )
}

export default FormSelectField