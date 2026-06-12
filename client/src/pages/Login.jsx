import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

function Login() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={submitHandler}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
        />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;