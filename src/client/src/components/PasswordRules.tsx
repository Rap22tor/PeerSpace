import {
  getPasswordStrength,
  MAX_PASSWORD_STRENGTH,
  passwordRules,
} from "../validation/auth";
import { CheckIcon, CircleIcon } from "./icons";

interface PasswordRulesProps {
  // Referenced by the password field through `describedBy`.
  id: string;
  password: string;
}

// A strength bar and a checklist of the password rules.
export function PasswordRules({ id, password }: PasswordRulesProps) {
  const strength = getPasswordStrength(password);

  return (
    <div id={id} className="mt-2.5">
      <div className="mb-2 flex gap-1" aria-hidden="true">
        {Array.from({ length: MAX_PASSWORD_STRENGTH }, (_unused, index) => {
          return (
            <span
              key={index}
              className={`h-1 flex-1 rounded-xs ${index < strength ? "bg-accent" : "bg-line"}`}
            />
          );
        })}
      </div>
      <ul className="flex flex-col gap-1">
        {passwordRules.map((rule) => {
          const met = rule.test(password);
          return (
            <li
              key={rule.id}
              className={`flex items-center gap-1.5 text-small ${met ? "text-fg [&>svg]:text-accent" : "text-muted"}`}
            >
              {met ? <CheckIcon /> : <CircleIcon />}
              <span className="sr-only">{met ? "Met: " : "Not met: "}</span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
