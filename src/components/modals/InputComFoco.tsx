import React, { useEffect, useRef, useCallback } from 'react';

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
  const preventBlurRef = useRef<boolean>(false);

  // Controlar mudanças de valor com debounce
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const newValue = target.value;
    
    // Salvar posição atual do cursor
    cursorPositionRef.current = target.selectionStart || 0;
    
    // Evitar blur durante digitação
    preventBlurRef.current = true;
    
    // Chamar onChange com um pequeno delay para manter o cursor
    setTimeout(() => {
      onChange(newValue);
      preventBlurRef.current = false;
    }, 0);
  }, [onChange]);

  // Restaurar cursor após mudanças no value
  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement === input) {
      const position = Math.min(cursorPositionRef.current, input.value.length);
      
      // Usar requestAnimationFrame para garantir que o DOM foi atualizado
      requestAnimationFrame(() => {
        if (input === document.activeElement) {
          input.setSelectionRange(position, position);
        }
      });
    }
  }, [value]);

  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    cursorPositionRef.current = target.selectionStart || 0;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    // Salvar posição do cursor em operações de navegação
    setTimeout(() => {
      cursorPositionRef.current = target.selectionStart || 0;
    }, 0);
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    // Prevenir blur se estivermos digitando
    if (preventBlurRef.current) {
      e.preventDefault();
      e.target.focus();
      return;
    }
  }, []);

  return (
    <input
      ref={inputRef}
      id={id}
      type={type}
      value={value}
      onChange={handleChange}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className || "mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"}
      autoComplete="off"
      spellCheck="false"
    />
  );
};