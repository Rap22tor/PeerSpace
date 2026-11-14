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
    <div id={id} className="password-rules">
      <div className="strength-bar" aria-hidden="true">
        {Array.from({ length: MAX_PASSWORD_STRENGTH }, (_unused, index) => {
          return (
            <span
              key={index}
              className={
                index < strength ? "strength-segment on" : "strength-segment"
              }
            />
          );
        })}
      </div>
      <ul className="rules-list">
        {passwordRules.map((rule) => {
          const met = rule.test(password);
          return (
            <li key={rule.id} className={met ? "rule met" : "rule"}>
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
