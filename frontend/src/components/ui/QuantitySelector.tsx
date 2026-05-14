import { Minus, Plus } from '@/components/icons';

interface QuantitySelectorProps {
  quantity: number;
  maxStock: number;
  onDecrement: () => void;
  onIncrement: () => void;
  disabled?: boolean;
}

export function QuantitySelector({ 
  quantity, 
  maxStock, 
  onDecrement, 
  onIncrement,
  disabled = false 
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4 mt-4">
      <button
        onClick={onDecrement}
        disabled={disabled || quantity <= 1}
        className="w-11 h-11 flex items-center justify-center border border-outline-variant rounded-lg hover:border-primary disabled:opacity-50 min-h-[44px] min-w-[44px]"
        aria-label="Disminuir cantidad"
      >
        <Minus size={20} />
      </button>
      <span className="text-xl font-serif min-w-[2ch] text-center">{quantity}</span>
      <button
        onClick={onIncrement}
        disabled={disabled || quantity >= maxStock}
        className="w-11 h-11 flex items-center justify-center border border-outline-variant rounded-lg hover:border-primary disabled:opacity-50 min-h-[44px] min-w-[44px]"
        aria-label="Aumentar cantidad"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}