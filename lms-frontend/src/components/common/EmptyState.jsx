const EmptyState = ({ text = "No data available" }) => {
  return (
    <div className="text-center text-slate-500 py-10">
      {text}
    </div>
  );
};

export default EmptyState;