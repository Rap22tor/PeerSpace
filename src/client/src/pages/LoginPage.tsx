import { useRef, useState, type FormEvent } from "react";
import { useAuth } from "../auth/AuthContext";
import { getFormErrorMessage } from "../auth/errors";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { FormBanner } from "../components/FormBanner";
import { TextField } from "../components/TextField";
import { TextLink } from "../components/TextLink";
import { validateEmail, validateLoginPassword } from "../validation/auth";

interface LoginErrors {
  email?: string;
  password?: string;
}

export function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const nextErrors: LoginErrors = {
      email: validateEmail(email),
      password: validateLoginPassword(password),
    };
    setErrors(nextErrors);
    setFormError(null);

    if (nextErrors.email !== undefined) {
      emailRef.current?.focus();
      return;
    }
    if (nextErrors.password !== undefined) {
      passwordRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      // On success the auth state changes and GuestOnly redirects us.
    } catch (error) {
      setFormError(getFormErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Welcome" subtitle="Sign in to continue.">
      <form
        className="flex flex-col gap-5"
        noValidate
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        {formError !== null ? <FormBanner>{formError}</FormBanner> : null}
        <TextField
          ref={emailRef}
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="name@school.com"
          autoFocus
          value={email}
          onChange={(value) => {
            setEmail(value);
            setErrors({ ...errors, email: undefined });
          }}
          error={errors.email}
        />
        <TextField
          ref={passwordRef}
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setErrors({ ...errors, password: undefined });
          }}
          error={errors.password}
        />
        <Button>{submitting ? "Signing in…" : "Sign in"}</Button>
      </form>
      <p className="mt-5 text-sm text-muted">
        No account yet? <TextLink to="/register">Register</TextLink>
      </p>
    </AuthLayout>
  );
}
