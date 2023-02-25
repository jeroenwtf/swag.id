import clsx from "clsx";

const COLORS = {
  blue: "bg-blue-100 text-blue-500",
  gray: "bg-gray-200 text-gray-600",
  green: "bg-green-100 text-green-500",
  orange: "bg-orange-100 text-orange-500",
  pink: "bg-pink-100 text-pink-500",
  red: "bg-red-100 text-red-500",
};

const SIZES = {
  small: "px-3 py-2 text-xs",
  medium: "px-5 py-3 text-sm",
  large: "px-7 py-5",
}

type Props = {
  url?: string;
  newTab?: boolean;
  icon?: string;
  color?: keyof typeof COLORS;
  size?: keyof typeof SIZES;
  type?: "button" | "submit" | "reset" | undefined;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler;
};

export default function Button({
  url,
  newTab,
  icon,
  color,
  size,
  type = 'button',
  children,
  onClick,
}: Props) {
  const buttonClasses = clsx(
    "flex cursor-pointer items-center justify-center gap-1.5 rounded font-semibold",
    color && Object.hasOwn(COLORS, color) ? COLORS[color] : COLORS.gray,
    size && Object.hasOwn(SIZES, size) ? SIZES[size] : SIZES.medium,
  );

  function openTab() {
    url && newTab && window.open(url, "_blank")?.focus();
    // TODO: Handle when newTab is false
  }

  return (
    <button className={buttonClasses} onClick={onClick ? onClick : openTab} type={type}>
      {/* icon && <HeroIcon icon={icon} /> */}
      {children && <span className="whitespace-nowrap">{children}</span>}
    </button>
  );
}
