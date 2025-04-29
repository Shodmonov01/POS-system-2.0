// import { useRef, useEffect, useState, KeyboardEvent } from 'react';
// import { Input } from '@/components/ui/input';
// import { cn } from '@/lib/utils';

// interface BarcodeInputProps {
//   onScan: (barcode: string) => void;
//   placeholder?: string;
//   className?: string;
//   disabled?: boolean;
// }

// export function BarcodeInput({
//   onScan,
//   placeholder = 'Scan or enter barcode...',
//   className,
//   disabled = false,
// }: BarcodeInputProps) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [value, setValue] = useState('');
//   const [isScanning, setIsScanning] = useState(false);
  
//   // Focus input on component mount and after each scan
//   useEffect(() => {
//     if (!disabled && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [disabled]);

//   // Handle keydown events
//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && value.trim()) {
//       onScan(value.trim());
//       setValue('');
//       e.preventDefault(); // Prevent form submission
//     }
//   };

//   // Keep input focused when clicked elsewhere
//   useEffect(() => {
//     const handleClick = () => {
//       if (!disabled && inputRef.current) {
//         inputRef.current.focus();
//       }
//     };

//     document.addEventListener('click', handleClick);
    
//     return () => {
//       document.removeEventListener('click', handleClick);
//     };
//   }, [disabled]);

//   // Handle scanner input (characterized by fast input)
//   useEffect(() => {
//     let scanTimer: ReturnType<typeof setTimeout>;
//     let lastInputTime = 0;
    
//     const handleScannerInput = () => {
//       const now = Date.now();
//       const isRapidInput = now - lastInputTime < 50; // Scanner typically inputs characters rapidly
      
//       if (isRapidInput && !isScanning) {
//         setIsScanning(true);
//       }
      
//       lastInputTime = now;
      
//       // Reset scanning state after a short delay
//       clearTimeout(scanTimer);
//       scanTimer = setTimeout(() => {
//         if (isScanning && value.trim()) {
//           onScan(value.trim());
//           setValue('');
//         }
//         setIsScanning(false);
//       }, 100);
//     };

//     if (value) {
//       handleScannerInput();
//     }
    
//     return () => {
//       clearTimeout(scanTimer);
//     };
//   }, [value, isScanning, onScan]);

//   return (
//     <div className="relative">
//       <Input
//         ref={inputRef}
//         type="text"
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder={placeholder}
//         className={cn(
//           "text-lg py-6 px-4 bg-white dark:bg-gray-950 border-2 focus-visible:ring-2 focus-visible:ring-blue-500",
//           isScanning && "border-green-500",
//           className
//         )}
//         disabled={disabled}
//         autoComplete="off"
//       />
//       {isScanning && (
//         <div className="absolute right-3 top-1/2 -translate-y-1/2">
//           <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
//         </div>
//       )}
//     </div>
//   );
// }

import { useRef, useEffect, useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface BarcodeInputProps {
  onScan: (barcode: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function BarcodeInput({
  onScan,
  placeholder = 'Scan or enter barcode...',
  className,
  disabled = false,
}: BarcodeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Focus input on component mount and after each scan
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Validate barcode (e.g., minimum length or format)
  const isValidBarcode = (barcode: string) => {
    return barcode.trim().length >= 3; // Example: Minimum 3 characters
  };

  // Handle keydown events
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      if (isValidBarcode(value)) {
        setIsProcessing(true);
        onScan(value.trim());
        setValue('');
      } else {
        setValue(''); // Clear invalid input
      }
      e.preventDefault(); // Prevent form submission
    }
  };

  // Keep input focused when clicked elsewhere
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

  // Handle scanner input (characterized by fast input)
  useEffect(() => {
    let scanTimer: ReturnType<typeof setTimeout>;
    let lastInputTime = 0;

    const handleScannerInput = () => {
      const now = Date.now();
      const isRapidInput = now - lastInputTime < 50; // Scanner typically inputs rapidly

      if (isRapidInput && !isScanning) {
        setIsScanning(true);
      }

      lastInputTime = now;

      // Reset scanning state after a short delay
      clearTimeout(scanTimer);
      scanTimer = setTimeout(() => {
        if (isScanning && value.trim() && isValidBarcode(value)) {
          setIsProcessing(true);
          onScan(value.trim());
          setValue('');
        }
        setIsScanning(false);
        setIsProcessing(false);
      }, 100);
    };

    if (value) {
      handleScannerInput();
    }

    return () => {
      clearTimeout(scanTimer);
    };
  }, [value, isScanning, onScan]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
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
  );
}