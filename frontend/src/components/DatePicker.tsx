import { useState, useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './DatePicker.module.css';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
  minDate?: Date;
  className?: string;
}

export function DatePicker({ value, onChange, disabled = false, minDate, className = '' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<ReactDatePicker>(null);

  // Parse date string in local timezone to avoid timezone offset issues
  const selectedDate = value ? (() => {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  })() : null;

  const handleChange = (date: Date | null) => {
    if (date) {
      // Format as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange('');
    }
    setIsOpen(false);
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.datePickerWrapper} ${className}`}>
      <ReactDatePicker
        ref={datePickerRef}
        selected={selectedDate}
        onChange={handleChange}
        disabled={disabled}
        minDate={minDate}
        dateFormat="MMM d, yyyy"
        placeholderText="Select date"
        className={styles.dateInput}
        calendarClassName={styles.calendar}
        isClearable
        showPopperArrow={false}
        fixedHeight
        open={isOpen}
        onInputClick={handleInputClick}
        onClickOutside={() => setIsOpen(false)}
      />
    </div>
  );
}
