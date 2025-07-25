import React from "react";

export default function PlaySvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM7.15266 5.23351C6.65336 4.91578 6 5.27444 6 5.86625V10.1337C6 10.7256 6.65336 11.0842 7.15266 10.7665L10.5057 8.63275C10.9688 8.33803 10.9688 7.66197 10.5057 7.36725L7.15266 5.23351Z"
        fill="currentColor"
      />
    </svg>
  );
}
