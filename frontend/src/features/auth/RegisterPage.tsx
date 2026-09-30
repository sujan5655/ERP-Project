import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../authApi";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await register(formData).unwrap();

      setMessage(response.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error: any) {
      console.error(error);

      setError(error?.data?.message || "Registration failed.");
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>

          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
          />
        </div>

        <div>
          <label>Last Name</label>

          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <div>
          <label>Confirm Password</label>

          <input
            type="password"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
        </div>

        {message && <p>{message}</p>}

        {error && <p>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
