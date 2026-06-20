import { useEffect, useState } from 'react';

export default function Popup({ isOpen, message, type, onClose }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  const bgColors = {
    success: 'bg-[#519c48]',
    error: 'bg-[#B15E4B]',
    info: 'bg-[#423E37]'
  };

  return (
    <div
      className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
      `}
      onTransitionEnd={handleAnimationEnd}
    >
      <div className={`${bgColors[type]} text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4`}>
        <span className="font-bold text-sm tracking-wide">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 opacity-70 hover:opacity-100 transition-opacity font-black text-xl leading-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
