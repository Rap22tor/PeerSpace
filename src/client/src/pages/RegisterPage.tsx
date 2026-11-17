import { useId, useRef, useState, type FormEvent } from "react";
import { ApiError } from "../backendRaw";
import { useAuth } from "../auth/AuthContext";
import { getFormErrorMessage } from "../auth/errors";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { FormBanner } from "../components/FormBanner";
import { PasswordRules } from "../components/PasswordRules";
import { TextField } from "../components/TextField";
import { TextLink } from "../components/TextLink";
import {
  PASSWORD_HINT,
  validateEmail,
  validateName as validateUserName,
  validateRegisterPassword,
} from "../validation/auth";

interface RegisterErrors {
  userName?: string;
  email?: string;
  password?: string;
}

export function RegisterPage() {
  const { register } = useAuth();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  // The server's message when the email is taken (409), shown with a sign in link.
  const [emailTaken, setEmailTaken] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const userNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const rulesId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const nextErrors: RegisterErrors = {
      userName: validateUserName(userName),
      email: validateEmail(email),
      password: validateRegisterPassword(password),
    };
    setErrors(nextErrors);
    setEmailTaken(null);
    setFormError(null);

    if (nextErrors.userName !== undefined) {
      userNameRef.current?.focus();
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
      await register({ userName: userName.trim(), email: email.trim(), password });
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
        userName: error.fields.userName,
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
        {emailTaken} <TextLink to="/login">Sign in</TextLink>
      </>
    ) : (
      errors.email
    );

  return (
    <AuthLayout title="Create your account" subtitle="Get started with FYB" >
      <form
        className="flex flex-col gap-5"
        noValidate
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        {formError !== null ? <FormBanner>{formError}</FormBanner> : null}
        <TextField
          ref={userNameRef}
          label="Username"
          autoComplete="username"
          autoFocus
          value={userName}
          onChange={(value) => {
            setUserName(value);
            setErrors({ ...errors, userName: undefined });
          }}
          valid={userName !== "" && validateUserName(userName) === undefined}
          error={errors.userName}
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
        <Button>{submitting ? "Creating account…" : "Create account"}</Button>
      </form>
      <p className="mt-5 text-sm text-muted">
        Already registered? <TextLink to="/login">Sign in</TextLink>
      </p>
    </AuthLayout>
  );
}
