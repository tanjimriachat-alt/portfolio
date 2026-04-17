import { useState, useEffect } from 'react';
import { useAdmin } from '@/src/context/AdminContext';
import { cn } from '@/src/lib/utils';
import { Edit3 } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  multiline?: boolean;
}

export default function EditableText({ value, onChange, className, multiline }: EditableTextProps) {
  const { isEditMode } = useAdmin();
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };

  if (!isEditMode) {
    return <span className={className}>{value}</span>;
  }

  return (
    <div className="relative group w-full">
      {multiline ? (
        <textarea
          value={localValue}
          onChange={handleChange}
          className={cn(
            "w-full bg-neon-aqua/5 border border-neon-aqua/20 rounded-lg p-2 outline-none focus:border-neon-aqua transition-colors resize-none",
            className
          )}
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          className={cn(
            "w-full bg-neon-aqua/5 border border-neon-aqua/20 rounded-lg p-2 outline-none focus:border-neon-aqua transition-colors",
            className
          )}
        />
      )}
      <div className="absolute -top-2 -right-2 p-1 bg-neon-aqua rounded-full text-obsidian shadow-lg pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
        <Edit3 size={10} />
      </div>
    </div>
  );
}
