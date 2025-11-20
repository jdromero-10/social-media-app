import { useRef, useState, KeyboardEvent, ChangeEvent } from 'react';

interface CodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

/**
 * Componente para ingresar código de verificación de 6 dígitos
 * Mueve automáticamente el foco entre los inputs
 */
export const CodeInput = ({
  length = 6,
  value,
  onChange,
  error,
  disabled = false,
  autoFocus = false,
}: CodeInputProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(
    autoFocus ? 0 : null,
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Dividir el valor en dígitos individuales
  const digits = value.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  const handleChange = (index: number, digit: string) => {
    // Solo permitir números
    if (digit && !/^\d$/.test(digit)) {
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = digit;

    const newValue = newDigits.join('');
    onChange(newValue);

    // Mover al siguiente input si se ingresó un dígito
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Si se presiona Backspace y el input está vacío, mover al anterior
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Si se presiona ArrowLeft, mover al anterior
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Si se presiona ArrowRight, mover al siguiente
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Solo permitir números
    const numbersOnly = pastedData.replace(/\D/g, '');
    
    if (numbersOnly.length > 0) {
      const newValue = numbersOnly.slice(0, length);
      onChange(newValue);
      
      // Mover foco al último dígito ingresado o al último input
      const focusIndex = Math.min(newValue.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(index, e.target.value)
            }
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            disabled={disabled}
            autoFocus={autoFocus && index === 0}
            className={`
              w-12 h-14 sm:w-14 sm:h-16
              text-center text-2xl sm:text-3xl font-bold
              border-2 rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0
              bg-white
              ${
                error
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : focusedIndex === index
                    ? 'border-[#00b1c0] focus:ring-[#00dde5] focus:border-[#00b1c0]'
                    : 'border-gray-300 hover:border-gray-400 focus:ring-[#00dde5] focus:border-[#00b1c0]'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
            `}
            aria-label={`Dígito ${index + 1} de ${length}`}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

