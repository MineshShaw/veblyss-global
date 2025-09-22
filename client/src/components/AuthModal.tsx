"use client";
import React, { useState, FC, MouseEvent, FormEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, signup } from "@/lib/Auth";
import { setUser } from "@/redux/userSlice";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const modalStyle = {
  backdrop: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.45)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 220ms ease",
  },
  container: {
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    maxWidth: "400px",
    width: "100%",
    padding: "2rem",
    fontFamily: "inherit",
    transition: "transform 240ms cubic-bezier(.2,.9,.2,1), opacity 240ms ease",
    transformOrigin: "center center",
  },
  heading: {
    fontWeight: 700,
    fontSize: "1.5rem",
    color: "#2b2b2b",
    marginBottom: "1.2rem",
    textAlign: "center" as const,
  },
  input: {
    width: "100%",
    padding: "0.7rem",
    margin: "0.5rem 0",
    borderRadius: "5px",
    border: "1px solid #cccccc",
    background: "#fafafa",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "0.8rem",
    margin: "1.3rem 0 0.3rem 0",
    borderRadius: "5px",
    border: "none",
    color: "#fff",
    background: "#368580",
    fontWeight: 600,
    fontSize: "1.05rem",
    letterSpacing: "1px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(180, 142, 62, 0.1)",
    transition: "transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease",
  },
  switch: {
    color: "#7d553b",
    cursor: "pointer",
    fontWeight: 500,
    textAlign: "center" as const,
    marginTop: "0.7rem",
  },
  successBadge: {
    position: "absolute" as const,
    top: "-28px",
    right: "calc(50% - 28px)",
    width: "56px",
    height: "56px",
    borderRadius: "999px",
    background: "#22c55e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 18px rgba(34,197,94,0.2)",
    transform: "scale(0.8)",
    opacity: 0,
    transition: "transform 280ms cubic-bezier(.2,.9,.2,1), opacity 220ms ease",
  },
};

const AuthModal: FC<AuthModalProps> = ({ open, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // animation states
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    // trigger entrance animation
    // slight delay makes transition smoother
    const t = window.setTimeout(() => setMounted(true), 10);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // play exit animation then close
      setMounted(false);
      window.setTimeout(() => onClose(), 220);
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const payload = isSignup
        ? await signup(name.trim(), email.trim(), password)
        : await login(email.trim(), password);

      const user = payload.user || payload;
      dispatch(
        setUser({
          name: user.name ?? null,
          email: user.email ?? null,
          cartdata: user.cartdata ?? null,
          wishlistdata: user.wishlistdata ?? null,
          orderdata: user.orderdata ?? null,
          addressdata: user.addressdata ?? null,
        })
      );

      // gentle success animation before closing
      setSuccess(true);
      // keep loading state briefly so buttons show feedback
      setLoading(false);

      // show success for a short while then close with exit animation
      window.setTimeout(() => {
        setMounted(false); // trigger exit animation
        window.setTimeout(() => {
          // reset local fields and then close modal
          setName("");
          setEmail("");
          setPassword("");
          setSuccess(false);
          onClose();
        }, 240);
      }, 800);
    } catch (err) {
      console.error(err);
      setError("Authentication failed");
      setLoading(false);
    }
  };

  const containerDynamicStyle = {
    ...modalStyle.container,
    transform: mounted ? "translateY(0) scale(1)" : "translateY(8px) scale(0.98)",
    opacity: mounted ? 1 : 0,
  };

  const backdropDynamicStyle = {
    ...modalStyle.backdrop,
    opacity: mounted ? 1 : 0,
    background: mounted ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.0)",
  };

  const successBadgeStyle = {
    ...modalStyle.successBadge,
    transform: success ? "scale(1)" : modalStyle.successBadge.transform,
    opacity: success ? 1 : 0,
  };

  return (
    <div style={backdropDynamicStyle} onClick={handleBackdropClick} aria-hidden={!mounted}>
      <div
        style={containerDynamicStyle}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isSignup ? "Sign up" : "Login"}
      >
        {/* success badge */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <div style={successBadgeStyle} aria-hidden={!success}>
            {/* simple checkmark svg */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div style={modalStyle.heading}>{isSignup ? "Create an Account" : "Welcome Back"}</div>

        <form onSubmit={handleFormSubmit} aria-busy={loading || success}>
          {isSignup && (
            <input
              style={modalStyle.input}
              type="text"
              placeholder="Full Name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || success}
            />
          )}

          <input
            style={modalStyle.input}
            type="email"
            placeholder="Email Address"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || success}
          />

          <input
            style={modalStyle.input}
            type="password"
            placeholder="Password"
            required
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || success}
          />

          {error && (
            <div style={{ color: "crimson", marginTop: 8, textAlign: "center" }}>{error}</div>
          )}

          <button
            type="submit"
            style={{
              ...modalStyle.button,
              opacity: loading || success ? 0.9 : 1,
              transform: loading ? "translateY(0) scale(0.995)" : undefined,
              pointerEvents: loading || success ? "none" : undefined,
            }}
            disabled={loading || success}
          >
            {success ? "Welcome!" : isSignup ? (loading ? "Signing up..." : "Sign Up") : (loading ? "Signing in..." : "Login")}
          </button>
        </form>

        <div
          style={modalStyle.switch}
          onClick={() => {
            if (loading) return;
            setIsSignup(!isSignup);
            setError(null);
          }}
          role="button"
          tabIndex={0}
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
