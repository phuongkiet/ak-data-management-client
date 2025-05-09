import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import { Tooltip } from "react-tooltip";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  tooltip?: string;
  tooltipId?: string;
}

const ProductLabel: FC<LabelProps> = ({
  htmlFor,
  children,
  className,
  tooltip,
  tooltipId = "default-tooltip",
}) => {
  return (
    <div className="flex items-center gap-1">
      <label
        htmlFor={htmlFor}
        className={clsx(
          twMerge(
            "mb-1.5 flex items-center text-sm font-medium text-gray-700 dark:text-gray-400",
            className
          )
        )}
        data-tooltip-id={tooltip ? tooltipId : undefined}
        data-tooltip-content={tooltip}
      >
        {children} {tooltip && (
          <svg
            width="15"
            height="15"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 cursor-help text-gray-500"
          >
            <circle
              cx="10"
              cy="10"
              r="9"
              fill="#F3F4F6"
              stroke="#6B7280"
              strokeWidth="1.5"
            />
            <text
              x="10"
              y="14"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#6B7280"
            >
              ?
            </text>
          </svg>
        )}
      </label>
      {tooltip && <Tooltip id={tooltipId} place="top" className="z-50" />}
    </div>
  );
};

export default ProductLabel;
