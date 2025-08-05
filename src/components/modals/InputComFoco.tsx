import React, { useEffect, useRef, useCallback } from 'react';

interface InputComFocoProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export const InputComFoco: React.FC<InputComFocoProps> = ({
  value,
  onChange,
  placeholder,
  className,
  id
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number>(0);
  const isTypingRef = useRef<boolean>(false);

  // Salvar posição do cursor antes de qualquer update
  const handleBeforeInput = useCallback(() => {
    if (inputRef.current) {
      cursorPositionRef.current = inputRef.current.selectionStart || 0;
      isTypingRef.current = true;
    }
  }, []);

  // Restaurar posição do cursor após update
  const restoreCursor = useCallback(() => {
    if (inputRef.current && isTypingRef.current) {
      const position = cursorPositionRef.current;
      inputRef.current.setSelectionRange(position, position);
      isTypingRef.current = false;
    }
  }, []);

  // Controlar mudanças de valor
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    cursorPositionRef.current = e.target.selectionStart || 0;
    onChange(newValue);
  }, [onChange]);

  // Restaurar cursor após cada render
  useEffect(() => {
    restoreCursor();
  });

  // Prevenir perda de foco
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Salvar posição antes de qualquer tecla
    if (inputRef.current) {
      cursorPositionRef.current = inputRef.current.selectionStart || 0;
    }
  }, []);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      value={value}
      onChange={handleChange}
      onBeforeInput={handleBeforeInput}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className || "mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
      autoComplete="off"
      spellCheck="false"
    />
  );
};