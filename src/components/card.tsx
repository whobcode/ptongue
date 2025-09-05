import React from "react";

/**
 * A container component that acts as a card.
 *
 * @param {object} props - The component's props.
 * @param {string} [props.id] - The ID of the card container.
 * @param {string} [props.className] - Optional CSS classes to apply to the card.
 * @param {React.ReactNode} props.children - The content to be rendered inside the card.
 * @returns {JSX.Element} The rendered card component.
 */
export default function Card({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className={`${className}`}>
      {children}
    </div>
  );
}