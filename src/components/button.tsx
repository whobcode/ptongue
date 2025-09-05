import React from "react";

/**
 * A customizable button component.
 *
 * @param {object} props - The component's props.
 * @param {string} props.text - The text to display on the button.
 * @param {string} [props.className] - Optional CSS classes to apply to the button.
 * @param {React.MouseEventHandler<HTMLDivElement>} [props.onClick] - Optional click handler for the button.
 * @returns {JSX.Element} The rendered button component.
 */
export default function Button({
  text,
  className,
  onClick,
}: {
  text: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}) {
  return (
    <div
      onClick={onClick}
      className={`shadow-sm hover:shadow-md ${className} duration-200 text-center`}
    >
      {text}
    </div>
  );
}