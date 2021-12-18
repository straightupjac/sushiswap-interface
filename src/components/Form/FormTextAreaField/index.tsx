import { DEFAULT_FORM_FIELD_CLASSNAMES } from 'app/components/Form'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import React, { FC, ReactElement } from 'react'
import { useFormContext } from 'react-hook-form'

import FormFieldHelperText from '../FormFieldHelperText'

export interface FormTextAreaFieldProps extends React.HTMLProps<HTMLTextAreaElement> {
  error?: string
  helperText?: string
  children?: ReactElement<HTMLInputElement>
}

const FormTextAreaField: FC<FormTextAreaFieldProps> = ({ name, label, children, helperText, error, ...rest }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <Typography weight={700}>{label}</Typography>
      <div className="mt-2 flex rounded-md shadow-sm">
        <textarea
          {...register(name)}
          {...rest}
          className={classNames(DEFAULT_FORM_FIELD_CLASSNAMES, errors[name] ? '!border-red' : '')}
        />
      </div>
      {errors[error] ? (
        <FormFieldHelperText className="!text-red">{errors[error].name}</FormFieldHelperText>
      ) : (
        <FormFieldHelperText>{helperText}</FormFieldHelperText>
      )}
    </>
  )
}

export default FormTextAreaField