interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute z-10 w-64 p-2 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
        {content}
      </div>
    </div>
  );
};
