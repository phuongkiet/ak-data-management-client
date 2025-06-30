import React, { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  placeholder = "Nhập và nhấn Enter",
  className = "",
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue("");
    } else if (e.key === 'Backspace' && inputValue === "" && value.length > 0) {
      // Remove last tag when backspace on empty input
      const newTags = value.slice(0, -1);
      onChange(newTags);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={`min-h-11 w-full rounded-lg border appearance-none px-3 py-2 text-sm shadow-theme-xs bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex flex-wrap gap-2 items-center">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-brand-100 text-brand-800 rounded-md dark:bg-brand-900 dark:text-brand-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-200"
              disabled={disabled}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm placeholder:text-gray-400 dark:placeholder:text-white/30"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default TagInput; 