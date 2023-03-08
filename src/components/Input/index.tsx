import clsx from 'clsx'
import { forwardRef } from 'react';

// TODO: this
type Props = {
  wrapperClassName?: string,
  placeholder: string,
  label?: string,
  prefix?: string,
  hint?: string,
  type: string,
  errors?: {
    message?: string,
  },
  name: string,
  required: boolean,
}

const Input = forwardRef<HTMLInputElement, any>((props, ref) => {
  const {
    wrapperClassName = '',
    placeholder = '',
    label = '',
    prefix = '',
    hint = '',
    type = 'text',
    errors,
    name,
    required = false,
    ...rest
  } = props;

  const inputWrapperClasses = clsx('flex flex-col gap-1', wrapperClassName)
  const inputClasses = clsx(
    'border text-left rounded transition duration-150 ease-in-out bg-white text-gray-900 py-1.5 px-2',
    errors ? 'focus-within:border-red-400 border-red-300' : 'focus-within:border-gray-400 border-gray-200'
  )

  return (
    <div className={inputWrapperClasses}>
      <div className={inputClasses}>
        {label && <label
          htmlFor={name}
          className='text-xs text-primary placeholder-gray-gray4 block'
        >
          {label}
          {required && <span className='text-red-400'>*</span>}
          {hint && <span className="text-gray-400"> &mdash; {hint}</span>}
        </label>}
        <div className="flex">
          {prefix && <div>{prefix}</div>}
          <input
            type={type}
            className='w-full text-primary outline-none text-base font-light rounded-md text-gray-900'
            id={name}
            required={required}
            placeholder={placeholder}
            name={name}
            ref={ref}
            {...rest}
          />
        </div>
      </div>
      {errors?.message && (
        <p className='text-xs px-2.5 text-left text-red-400'>{errors?.message}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input'

export default Input;
