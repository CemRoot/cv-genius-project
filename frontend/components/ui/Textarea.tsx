import React, { useId } from 'react';
import clsx from 'clsx';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className,
  label,
  error,
  helpText,
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const textareaId = id || `textarea-${generatedId}`;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        ref={ref}
        className={clsx(
          'w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white resize-vertical',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;