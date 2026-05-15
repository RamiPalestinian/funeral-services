import './FormInput.css';
import type { InputHTMLAttributes } from 'react';
import {useId} from 'react';
//  Расширяем стандартные пропсы input
type FormInputProps = {
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const FormInput = ({ label, ...otherProps } : FormInputProps) => {
  const inputLabelClassName =
    otherProps.value &&
    typeof otherProps.value === 'string' &&
    otherProps.value.length
      ? 'shrink auth-form-input-label'
      : 'auth-form-input-label';

      const id = useId();
  return (
    <div className="auth-form-input-group">
      <input className="auth-form-input" {...otherProps} autoComplete="off" id={id} />
      {label && (
        <label className={inputLabelClassName} htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
};

export default FormInput;
