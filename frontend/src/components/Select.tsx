import * as SelectPrimitive from '@radix-ui/react-select';
import styles from './Select.module.css';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  disabled?: boolean;
  className?: string;
}

export function Select({ value, onChange, options, disabled = false, className = '' }: SelectProps) {
  return (
    <SelectPrimitive.Root
      value={String(value)}
      onValueChange={(newValue) => {
        // Try to convert to number if the original value was a number
        const option = options.find(opt => String(opt.value) === newValue);
        if (option) {
          onChange(option.value);
        }
      }}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger className={`${styles.trigger} ${className}`}>
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon className={styles.icon}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M6 8L0 0h12z" fill="currentColor" />
          </svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className={styles.content} position="popper" sideOffset={4}>
          <SelectPrimitive.Viewport className={styles.viewport}>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={String(option.value)}
                value={String(option.value)}
                className={styles.item}
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className={styles.indicator}>
                  ✓
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
