import "../styles/register.css";
import { useId, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { ApiError } from "../api";
import { useAuth } from "../auth/AuthContext";
import { getFormErrorMessage } from "../auth/errors";
import { AuthLayout } from "../components/AuthLayout";
import { FormBanner } from "../components/FormBanner";
import { PasswordRules } from "../components/PasswordRules";
import { TextField } from "../components/TextField";
import {
  PASSWORD_HINT,
  validateEmail,
  validateName,
  validateRegisterPassword,
} from "../validation/auth";

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function RegisterPage() {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  // The server's message when the email is taken (409), shown with a sign in link.
  const [emailTaken, setEmailTaken] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const rulesId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const nextErrors: RegisterErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validateRegisterPassword(password),
    };
    setErrors(nextErrors);
    setEmailTaken(null);
    setFormError(null);

    if (nextErrors.name !== undefined) {
      nameRef.current?.focus();
      return;
    }
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
      await register({ name: name.trim(), email: email.trim(), password });
      // On success the auth state changes and GuestOnly redirects us.
    } catch (error) {
      handleSubmitError(error);
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmitError(error: unknown) {
    if (error instanceof ApiError && error.status === 409) {
      setEmailTaken(error.message);
      emailRef.current?.focus();
      return;
    }
    if (error instanceof ApiError && Object.keys(error.fields).length > 0) {
      setErrors({
        name: error.fields.name,
        email: error.fields.email,
        password: error.fields.password,
      });
      return;
    }
    setFormError(getFormErrorMessage(error));
  }

  const emailError =
    emailTaken !== null ? (
      <>
        {emailTaken}{" "}
        <Link to="/login" className="link">
          Sign in
        </Link>
      </>
    ) : (
      errors.email
    );

  return (
    <AuthLayout title="Create your account" subtitle="It takes under a minute.">
      <form
        className="auth-form"
        noValidate
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        {formError !== null ? <FormBanner>{formError}</FormBanner> : null}
        <TextField
          ref={nameRef}
          label="Name"
          autoComplete="name"
          autoFocus
          value={name}
          onChange={(value) => {
            setName(value);
            setErrors({ ...errors, name: undefined });
          }}
          valid={name !== "" && validateName(name) === undefined}
          error={errors.name}
        />
        <TextField
          ref={emailRef}
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="name@school.com"
          value={email}
          onChange={(value) => {
            setEmail(value);
            setErrors({ ...errors, email: undefined });
            setEmailTaken(null);
          }}
          error={emailError}
        />
        <div>
          <TextField
            ref={passwordRef}
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setErrors({ ...errors, password: undefined });
            }}
            hint={password === "" ? PASSWORD_HINT : undefined}
            describedBy={password === "" ? undefined : rulesId}
            error={errors.password}
          />
          {password === "" ? null : (
            <PasswordRules id={rulesId} password={password} />
          )}
        </div>
        <button type="submit" className="btn">
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="auth-footer">
        Already registered?{" "}
        <Link to="/login" className="link">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
