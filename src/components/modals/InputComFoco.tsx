import React, { useRef, useEffect } from 'react';

interface InputComFocoProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  type?: string;
}

export const InputComFoco: React.FC<InputComFocoProps> = ({
  value,
  onChange,
  placeholder,
  className,
  id,
  type = "text"
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const lastValueRef = useRef<string>(value);
  const cursorPositionRef = useRef<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const newValue = input.value;
    
    // Salvar posição do cursor antes de chamar onChange
    cursorPositionRef.current = input.selectionStart || 0;
    lastValueRef.current = newValue;
    
    onChange(newValue);
  };

  // Apenas restaurar cursor se o valor mudou externamente (não pelo usuário)
  useEffect(() => {
    if (inputRef.current && value !== lastValueRef.current) {
      // Valor foi alterado externamente, restaurar foco se o input estava focado
      if (document.activeElement === inputRef.current) {
        const position = Math.min(cursorPositionRef.current, inputRef.current.value.length);
        inputRef.current.setSelectionRange(position, position);
      }
      lastValueRef.current = value;
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      id={id}
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className || "mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
      autoComplete="off"
    />
  );
};