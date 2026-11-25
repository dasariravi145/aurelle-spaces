import React, { forwardRef } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: (SelectOption | string)[];
  error?: string;
  helperText?: string;
  id: string;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
}

/**
 * Accessible architectural select component with styled dropdown frame and keyboard accessibility.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      id,
      placeholder = "Select an option",
      className = "",
      containerClassName = "",
      required,
      disabled,
      ...props
    },
    ref
  ) => {
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
        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            disabled={disabled}
            required={required}
            className={`w-full appearance-none px-3.5 py-2.5 pr-10 text-sm bg-[#FFFFFF] text-[#242522] border rounded-[2px] transition-colors duration-150 focus:outline-none focus:ring-1 ${
              error
                ? "border-[#A83E3E] focus:border-[#A83E3E] focus:ring-[#A83E3E]"
                : "border-[#DCD5CB] focus:border-[#A17C55] focus:ring-[#A17C55]"
            } disabled:bg-[#EFECE6] disabled:text-[#8E8F8A] disabled:cursor-not-allowed ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => {
              const opt = typeof option === "string" ? { value: option, label: option } : option;
              return (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6B6C67]">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p id={`${id}-error`} className="text-xs text-[#A83E3E] mt-1" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${id}-helper`} className="text-xs text-[#6B6C67] mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

