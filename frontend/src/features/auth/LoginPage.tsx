import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { useLoginMutation } from "../authApi";
import { setCredentials } from "../authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    try {
      const response = await login({
        email,
        password,
      }).unwrap();

      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.tokens.access,
          refreshToken: response.tokens.refresh,
        }),
      );

      console.log(response.message);

      navigate("/");
    } catch (error: any) {
      console.error(error);

      setError(
        error?.data?.errors?.non_field_errors?.[0] ||
          error?.data?.message ||
          "Login failed.",
      );
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <p> THis is login page </p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
