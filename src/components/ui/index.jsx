export function Table({ children }) {
  return (
    <table className="w-full border-collapse border border-gray-300">
      {children}
    </table>
  );
}

export function Input({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border p-2 rounded w-full bg-white text-black"
    />
  );
}

export function Button({ onClick, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 text-white px-4 py-2 rounded ${className}`}
    >
      {children}
    </button>
  );
}
