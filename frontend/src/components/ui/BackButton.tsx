import { ArrowLeft } from '@/components/icons';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  label?: string;
  className?: string;
  showLabelOnMobile?: boolean;
}

export function BackButton({
  label = "Volver",
  className = "",
  showLabelOnMobile = false
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all font-label min-h-[44px] min-w-[44px] rounded-lg hover:bg-surface-container px-2 ${className}`}
      aria-label="Volver al inicio"
    >
      <ArrowLeft size={16} className="sm:size-5 flex-shrink-0" />
      <span className={showLabelOnMobile ? "inline" : "hidden sm:inline"}>{label}</span>
    </button>
  );
}