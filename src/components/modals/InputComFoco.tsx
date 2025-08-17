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
  const cursorPositionRef = useRef<number>(0);
  const shouldRestoreCursor = useRef<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const newValue = input.value;
    
    // Salvar posição atual do cursor
    cursorPositionRef.current = input.selectionStart || 0;
    shouldRestoreCursor.current = true;
    
    onChange(newValue);
  };

  // Restaurar cursor apenas quando necessário
  useEffect(() => {
    if (shouldRestoreCursor.current && inputRef.current && document.activeElement === inputRef.current) {
      const position = Math.min(cursorPositionRef.current, inputRef.current.value.length);
      inputRef.current.setSelectionRange(position, position);
      shouldRestoreCursor.current = false;
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