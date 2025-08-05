import React, { useRef, useLayoutEffect } from 'react';

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
  const cursorRef = useRef<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    // Salvar posição do cursor
    cursorRef.current = cursorPosition;
    
    // Chamar onChange
    onChange(newValue);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    cursorRef.current = target.selectionStart || 0;
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    cursorRef.current = target.selectionStart || 0;
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    cursorRef.current = target.selectionStart || 0;
  };

  // Restaurar cursor após re-render
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement === input) {
      const position = Math.min(cursorRef.current, input.value.length);
      input.setSelectionRange(position, position);
    }
  });

  return (
    <input
      ref={inputRef}
      id={id}
      type={type}
      value={value}
      onChange={handleChange}
      onSelect={handleSelect}
      onKeyUp={handleKeyUp}
      onClick={handleClick}
      placeholder={placeholder}
      className={className || "mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
      autoComplete="off"
    />
  );
};