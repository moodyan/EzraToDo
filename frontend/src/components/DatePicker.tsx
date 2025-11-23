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
  const selectedDate = value ? new Date(value) : null;

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
  };

  return (
    <div className={`${styles.datePickerWrapper} ${className}`}>
      <ReactDatePicker
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
      />
    </div>
  );
}
