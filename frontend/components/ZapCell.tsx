export const ZapCell = ({
    name,
    index,
    onClick,
    className
}: {
    name?: string; 
    index: number;
    onClick: () => void;
    className?: string;
}) => {
    return (
        <div 
            onClick={onClick} 
            className={`flex items-center h-12 ${className || ''}`}
        >
            <div className="flex items-center w-full justify-center gap-3 text-gray-800">
                <div className="font-semibold text-sm">
                    {index}.
                </div>
                <div className="font-medium text-sm">
                    {name}
                </div>
            </div>
        </div>
    )
}