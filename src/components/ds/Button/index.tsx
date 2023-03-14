import clsx from "clsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

const COLORS = {
  blue: "bg-blue-100 text-blue-500",
  gray: "bg-gray-200 text-gray-600",
  green: "bg-green-100 text-green-500",
  orange: "bg-orange-100 text-orange-500",
  pink: "bg-pink-100 text-pink-500",
  red: "bg-red-100 text-red-500",
  darkPink: "bg-pink-600 text-white",
};

const SIZES = {
  small: "px-3 py-2 text-xs",
  medium: "px-5 py-3 text-sm",
  large: "px-7 py-5",
}

type Props = {
  url?: string;
  newTab?: boolean;
  color?: keyof typeof COLORS;
  size?: keyof typeof SIZES;
  type?: "button" | "submit" | "reset" | undefined;
  isLoading?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler;
};

export default function Button({
  url,
  newTab,
  color,
  size,
  type = 'button',
  isLoading,
  children,
  onClick,
}: Props) {
  const buttonClasses = clsx(
    "flex cursor-pointer items-center justify-center gap-1.5 rounded font-semibold relative disabled:opacity-70 disabled:cursor-not-allowed",
    color && Object.hasOwn(COLORS, color) ? COLORS[color] : COLORS.gray,
    size && Object.hasOwn(SIZES, size) ? SIZES[size] : SIZES.medium,
  );
  const textClasses = clsx(
    'whitespace-nowrap',
    isLoading && 'invisible',
  )
  const loadingIconWrapperClasses = 'absolute inset-0 flex justify-center items-center'

  function openTab() {
    url && newTab && window.open(url, "_blank")?.focus();
    // TODO: Handle when newTab is false
  }

  return (
    <button className={buttonClasses} onClick={onClick ? onClick : openTab} type={type} disabled={isLoading}>
      {isLoading && <div className={loadingIconWrapperClasses}><FontAwesomeIcon icon={faCircleNotch} className="animate-spin w-5 h-5" /></div>}
      {children && <span className={textClasses}>{children}</span>}
    </button>
  );
}
