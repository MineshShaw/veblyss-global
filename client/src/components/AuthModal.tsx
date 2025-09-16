import { login, signup } from "@/lib/Auth";
import React, { useState, FC, MouseEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";

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
  },
  container: {
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    maxWidth: "400px",
    width: "100%",
    padding: "2rem",
    fontFamily: "inherit",
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
    background: "linear-gradient(90deg, #b48e3e 30%, #7d553b 100%)",
    fontWeight: 600,
    fontSize: "1.05rem",
    letterSpacing: "1px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(180, 142, 62, 0.1)",
  },
  switch: {
    color: "#7d553b",
    cursor: "pointer",
    fontWeight: 500,
    textAlign: "center" as const,
    marginTop: "0.7rem",
  }
};

const AuthModal: FC<AuthModalProps> = ({ open, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  // Track state for each input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignup) {
      signup(name, email, password)
        .then(data => {
          console.log("Signup successful:", data);
          dispatch({ type: "SET_USER", payload: data.user });
          onClose();
        })
        .catch(err => {
          console.error("Signup error:", err);
        });
    } else {
      login(email, password)
        .then(data => {
          console.log("Login successful:", data);
          dispatch({ type: "SET_USER", payload: data.user });
          onClose();
        })
        .catch(err => {
          console.error("Login error:", err);
        });
    }

    setName(""); setEmail(""); setPassword(""); onClose();
  };

  return (
    <div style={modalStyle.backdrop} onClick={handleBackdropClick}>
      <div
        style={modalStyle.container}
        onClick={e => e.stopPropagation()}
      >
        <div style={modalStyle.heading}>
          {isSignup ? "Create an Account" : "Welcome Back"}
        </div>
        <form onSubmit={handleFormSubmit}>
          {isSignup && (
            <input
              style={modalStyle.input}
              type="text"
              placeholder="Full Name"
              required
              autoComplete="name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          )}
          <input
            style={modalStyle.input}
            type="email"
            placeholder="Email Address"
            required
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            style={modalStyle.input}
            type="password"
            placeholder="Password"
            required
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" style={modalStyle.button}>
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <div
          style={modalStyle.switch}
          onClick={() => setIsSignup(!isSignup)}
          role="button"
          tabIndex={0}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
