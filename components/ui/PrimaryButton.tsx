interface Props {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children: React.ReactNode;
}

const PrimaryButton: React.FC<Props> = ({ type = 'button', disabled, children }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
    >
      {children}
    </button>
  );
};

export default PrimaryButton;