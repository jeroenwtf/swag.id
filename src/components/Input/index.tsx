import clsx from 'clsx'
import { forwardRef } from 'react';

// TODO: this
type Props = {
  wrapperClassName?: string,
  placeholder: string,
  label: string,
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
    type = 'text',
    errors,
    name,
    required = false,
    ...rest
  } = props;

  const inputWrapperClasses = clsx('flex flex-col gap-1', wrapperClassName)
  const inputClasses = clsx(
    'border text-left rounded transition duration-150 ease-in-out',
    errors ? 'focus-within:border-red-400 border-red-300' : 'focus-within:border-gray-400 border-gray-200'
  )

  return (
    <div className={inputWrapperClasses}>
      <div className={inputClasses}>
        <label
          htmlFor={name}
          className='text-xs text-primary placeholder-gray-gray4 px-2 pt-1.5'
        >
          {label} {required && <span className='text-red-400'>*</span>}
        </label>
        <input
          type={type}
          className='w-full px-2 pb-1.5 text-primary outline-none text-base font-light rounded-md'
          id={name}
          placeholder={placeholder}
          name={name}
          ref={ref}
          {...rest}
        />
      </div>
      {errors?.message && (
        <p className='text-xs px-3 text-left text-red-400'>{errors?.message}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input'

export default Input;
