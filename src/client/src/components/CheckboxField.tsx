interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// A labelled checkbox. Clicking the label text toggles it too.
export function CheckboxField({
  label,
  checked,
  onChange,
}: CheckboxFieldProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 font-medium text-fg">
      <input
        type="checkbox"
        className="size-4 cursor-pointer accent-accent"
        checked={checked}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
      />
      {label}
    </label>
  );
}
