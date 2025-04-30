import { useRef, useEffect, useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { productApi } from '@/api/productApi';
import { Product } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

// Кастомный хук debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    console.log('useDebounce: Входное значение:', value);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      console.log('useDebounce: Установлено debouncedValue:', value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface BarcodeInputProps {
  onScan: (barcode: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function BarcodeInput({
  onScan,
  placeholder = 'Сканируйте штрих-код или ищите товары...',
  className,
  disabled = false,
}: BarcodeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedValue = useDebounce(value, 300);

  // Фокусировка на инпуте
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const isValidBarcode = (barcode: string) => {
    const isValid = barcode.trim().length >= 2;
    console.log('isValidBarcode:', barcode, 'Результат:', isValid);
    return isValid;
  };

  // Загрузка подсказок
  useEffect(() => {
    const fetchSuggestions = async () => {
      console.log('fetchSuggestions: debouncedValue:', debouncedValue, 'isScanning:', isScanning);
      if (debouncedValue && isValidBarcode(debouncedValue) && !isScanning) {
        try {
          console.log('fetchSuggestions: Выполняется запрос productApi.search с q:', debouncedValue);
          const response = await productApi.search({ q: debouncedValue });
          const products = response.data;
          console.log('fetchSuggestions: Получены продукты:', products);
          setSuggestions(products.slice(0, 5));
          setIsOpen(products.length > 0);
        } catch (error) {
          console.error('fetchSuggestions: Ошибка:', error);
          setSuggestions([]);
          setIsOpen(false);
        }
      } else {
        console.log('fetchSuggestions: Подсказки не запрашиваются. Условия не выполнены.');
        setSuggestions([]);
        setIsOpen(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue, isScanning]);

  // Обработка нажатия Enter
  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      console.log('handleKeyDown: Нажат Enter, value:', value);
      if (isValidBarcode(value)) {
        setIsProcessing(true);
        await onScan(value.trim());
        setValue('');
        setSuggestions([]);
        setIsOpen(false);
        setIsProcessing(false);
        inputRef.current?.focus();
      } else {
        setValue('');
        setSuggestions([]);
        setIsOpen(false);
      }
    }
  };

  // Автофокус при клике на документ
  useEffect(() => {
    const handleClick = () => {
      if (!disabled && inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [disabled]);

  // Обработка ввода со сканера
  useEffect(() => {
    let scanTimer: ReturnType<typeof setTimeout>;
    let lastInputTime = 0;

    const handleScannerInput = () => {
      const now = Date.now();
      const isRapidInput = now - lastInputTime < 50;
      console.log('handleScannerInput: isRapidInput:', isRapidInput, 'value:', value);

      if (isRapidInput && !isScanning) {
        setIsScanning(true);
        setIsOpen(false);
        console.log('handleScannerInput: Начато сканирование');
      }

      lastInputTime = now;

      clearTimeout(scanTimer);
      scanTimer = setTimeout(async () => {
        if (isScanning && value.trim() && isValidBarcode(value)) {
          console.log('handleScannerInput: Обработка сканированного штрих-кода:', value);
          setIsProcessing(true);
          await onScan(value.trim());
          setValue('');
          setSuggestions([]);
          setIsOpen(false);
          setIsProcessing(false);
        }
        setIsScanning(false);
        console.log('handleScannerInput: Сканирование завершено');
      }, 100);
    };

    if (value) {
      handleScannerInput();
    }

    return () => {
      clearTimeout(scanTimer);
    };
  }, [value, isScanning, onScan]);

  // Выбор подсказки
  const handleSuggestionClick = async (barcode: string) => {
    console.log('handleSuggestionClick: Выбран штрих-код:', barcode);
    setIsProcessing(true);
    await onScan(barcode);
    setValue('');
    setSuggestions([]);
    setIsOpen(false);
    setIsProcessing(false);
    inputRef.current?.focus();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              console.log('Input onChange: Новое значение:', e.target.value);
              setValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              'text-lg py-6 px-4 bg-white dark:bg-gray-950 border-2 focus-visible:ring-2 focus-visible:ring-blue-500',
              isScanning && 'border-green-500',
              isProcessing && 'border-yellow-500',
              className
            )}
            disabled={disabled || isProcessing}
            autoComplete="off"
          />
          {isScanning && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          )}
          {isProcessing && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <ScrollArea className="h-[200px]">
          <div className="p-2">
            {suggestions.map((product) => (
              <Button
                key={product.id}
                variant="outline"
                className="w-full justify-start flex-col items-start h-auto py-2 my-1"
                onClick={() => handleSuggestionClick(product.barcode)}
              >
                <span className="font-medium">{product.name}</span>
                <span className="text-sm text-muted-foreground">{product.barcode}</span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(Number(product.price))}
                </span>
              </Button>
            ))}
            {suggestions.length === 0 && value && (
              <div className="p-2 text-sm text-muted-foreground">Товары не найдены</div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}