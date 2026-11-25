import React, { forwardRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  helpText?: string;
  id: string;
  className?: string;
  containerClassName?: string;
}

/**
 * Accessible architectural textarea component tailored for project brief submissions and consultation notes.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      helpText,
      id,
      className = "",
      containerClassName = "",
      required,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const resolvedHelpText = helperText || helpText;
    return (
      <div className={`flex flex-col space-y-1.5 w-full ${containerClassName}`}>
        <label
          htmlFor={id}
          className="text-xs font-medium uppercase tracking-wider text-[#242522] flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-[#A17C55] ml-0.5">*</span>}
          </span>
          {disabled && (
            <span className="text-[0.65rem] text-[#8E8F8A] font-mono lowercase">disabled</span>
          )}
        </label>
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${id}-error` : resolvedHelpText ? `${id}-helper` : undefined
          }
          disabled={disabled}
          required={required}
          className={`w-full px-3.5 py-2.5 text-sm bg-[#FFFFFF] text-[#242522] border rounded-[2px] transition-colors duration-150 placeholder:text-[#8E8F8A] resize-y focus:outline-none focus:ring-1 ${error
            ? "border-[#A83E3E] focus:border-[#A83E3E] focus:ring-[#A83E3E]"
            : "border-[#DCD5CB] focus:border-[#A17C55] focus:ring-[#A17C55]"
            } disabled:bg-[#EFECE6] disabled:text-[#8E8F8A] disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-xs text-[#A83E3E] mt-1" role="alert">
            {error}
          </p>
        )}
        {!error && resolvedHelpText && (
          <p id={`${id}-helper`} className="text-xs text-[#6B6C67] mt-1">
            {resolvedHelpText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

