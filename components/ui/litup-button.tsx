import React from "react";

export default function LitupButton({
  children,
  color = false,
  onClick,
}: {
  children: React.ReactNode;
  color: boolean;
  onClick: () => void;
}) {
  if (color) {
    return (
      <button className="p-[3px] relative w-full mb-1" onClick={onClick}>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg" />
        <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
          {children}
        </div>
      </button>
    );
  }

  return (
    <button className="p-[3px] relative w-full mb-1" onClick={onClick}>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
      <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
        {children}
      </div>
    </button>
  );
}
