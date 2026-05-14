// Re-export lucide icons for consistent usage across the app
export {
  ShoppingCart,
  Heart,
  Search,
  User,
  Menu,
  X,
  Bell,
  Zap,
  Share2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Plus,
  Minus,
  Trash2,
  Edit,
  Edit2,
  Eye,
  EyeOff,
  Download,
  Upload,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  MoreVertical,
  Copy,
  ExternalLink,
  Link,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Tag,
  DollarSign,
  Percent,
  Package,
  Archive,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Lock,
  Unlock,
  Image,
  FileText,
  Save,
  Printer,
  Truck,
  CreditCard,
  ShoppingBag,
  Star,
  Send,
  ArrowLeft,
  ArrowRight,
  Home,
  BarChart3,
  Users,
  ShoppingBasket,
} from 'lucide-react';

// Import type separately
import type { LucideIcon } from 'lucide-react';

// Helper component for consistent icon sizing
interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
}

export function Icon({ icon: IconComponent, size = 24, className = '' }: IconProps) {
  return <IconComponent size={size} className={className} />;
}