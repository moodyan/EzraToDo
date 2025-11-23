import { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  disabled?: boolean;
  className?: string;
}

export function CustomSelect({ value, onChange, options, disabled = false, className = '' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        // When opening, focus the currently selected option
        const currentIndex = options.findIndex(opt => opt.value === value);
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
    }
  };

  const handleOptionClick = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          handleOptionClick(options[focusedIndex].value);
        } else {
          setIsOpen(true);
          const currentIndex = options.findIndex(opt => opt.value === value);
          setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          const currentIndex = options.findIndex(opt => opt.value === value);
          setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
        } else {
          setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          const currentIndex = options.findIndex(opt => opt.value === value);
          setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
        } else {
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1));
        }
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.customSelect} ${disabled ? styles.disabled : ''} ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
    >
      <button
        type="button"
        className={`${styles.selectButton} ${isOpen ? styles.open : ''}`}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.selectValue}>{selectedOption?.label || 'Select...'}</span>
        <span className={styles.selectArrow}>▼</span>
      </button>

      {isOpen && (
        <ul className={styles.optionsList} role="listbox">
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`${styles.option} ${
                option.value === value ? styles.selected : ''
              } ${index === focusedIndex ? styles.focused : ''}`}
              onClick={() => handleOptionClick(option.value)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
