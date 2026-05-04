interface IconProps {
  icon: string;
  className?: string;
}

export function Icon({ icon, className = 'w-5 h-5' }: IconProps) {
  return <i className={`fa ${icon} ${className}`} aria-hidden="true" />;
}

// Predefined icons for common actions
export const Icons = {
  search: 'fa-search',
  user: 'fa-user',
  cart: 'fa-shopping-cart',
  heart: 'fa-heart',
  menu: 'fa-bars',
  close: 'fa-times',
  arrowRight: 'fa-arrow-right',
  arrowLeft: 'fa-arrow-left',
  check: 'fa-check',
  plus: 'fa-plus',
  minus: 'fa-minus',
  trash: 'fa-trash',
  edit: 'fa-edit',
  logout: 'fa-sign-out-alt',
  settings: 'fa-cog',
};