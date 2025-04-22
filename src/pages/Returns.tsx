import { ReturnForm } from '@/components/returns/ReturnForm';

export function ReturnsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Returns</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ReturnForm />
        
        <div className="space-y-6">
          <div className="text-xl font-semibold">Recent Returns</div>
          <div className="rounded-md border p-6 text-center text-muted-foreground">
            No recent returns to display
          </div>
        </div>
      </div>
    </div>
  );
}