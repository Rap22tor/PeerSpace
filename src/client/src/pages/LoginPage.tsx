import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { getFormErrorMessage } from "../auth/errors";
import { AuthLayout } from "../components/AuthLayout";
import { FormBanner } from "../components/FormBanner";
import { TextField } from "../components/TextField";
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
        className="auth-form"
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
        <button type="submit" className="btn">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="auth-footer">
        No account yet?{" "}
        <Link to="/register" className="link">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
