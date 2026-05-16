import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import { LogOut, Settings, User } from '@/components/icons';

interface UserDropdownProps {
  className?: string;
}

function getInitials(name: string | undefined | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function UserDropdown({ className }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const initials = getInitials(user?.name);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const handleSettings = () => {
    setIsOpen(false);
    navigate('/admin/settings');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
          <span className="text-primary font-medium text-sm">{initials}</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-outline-variant/40 bg-surface-container-low shadow-lg overflow-hidden z-50 animate-fade-in">
          <div className="p-2">
            <button
              onClick={handleSettings}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              <Settings size={18} />
              <span>Configuración</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
