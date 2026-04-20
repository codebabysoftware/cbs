const Badge = ({ text, type = "default" }) => {
  const styles = {
    default: "bg-slate-200 text-slate-700",
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${styles[type]}`}>
      {text}
    </span>
  );
};

export default Badge;