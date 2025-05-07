import { ReactNode, Suspense } from 'react';
import { LoaderPinwheel } from 'lucide-react';

interface LazyBoundaryProps {
    children: ReactNode;
}

export function LazyBoundary({ children }: LazyBoundaryProps) {
    return (
        <Suspense
            fallback={
                <div className="centered-spin-icon">
                    <LoaderPinwheel className="spin-icon" />
                </div>
            }
        >
            {children}
        </Suspense>
    );
}
