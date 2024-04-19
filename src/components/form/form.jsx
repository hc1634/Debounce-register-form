import React, { useState } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import "./form.css";

const Form = () => {
  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [formSubmit, setFormSubmit] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleInput = (event) => {
    let newDetails = { ...details, [event.target.name]: event.target.value };
    setDetails(newDetails);
  };
  const debouncedSubmitHandle = debounce((details) => {
    // console.log(details);
    const errors = validate(details);
    setFormErrors(errors);
    setFormSubmit(true);
    setShowToast(true);

    axios
      .post(
        "https://sheet.best/api/sheets/72b3f0ff-1079-41bb-8873-df4ab8795ef2",
        details
      )
      .then((response) => {
        return response;
      });

    if (!errors.name && !errors.email && !errors.password && !errors.mobile) {
      setTimeout(() => {
        setDetails({
          name: "",
          email: "",
          password: "",
          mobile: "",
        });
        setFormSubmit(false);
      }, 2000);
    }

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  }, 1000);
  const handleSubmit = (event) => {
    event.preventDefault();
    debouncedSubmitHandle(details);
  };

  const validate = (data) => {
    const errors = {};
    if (!data.name) {
      errors.name = "Name is required";
    }
    //Mobile Validation
    if (!data.mobile) {
      errors.mobile = "Mobile number is required";
    }
    // Email validation
    let emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!emailPattern.test(data.email)) {
      errors.email = "Email doesn't match the pattern! Provide valid email.";
    }
    // Password validation
    let passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$/;
    if (!data.password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(data.password)) {
      errors.password =
        "Password should have one Uppercase, one Lowercase, a number and a special character";
    }
    return errors;
  };

  return (
    <div className="center">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <center>
            <h2>Register</h2>
          </center>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              name="name"
              type="text"
              value={details.name}
              placeholder="Enter your Name"
              onChange={handleInput}
              autoComplete="off"
            />
            {formErrors.name && <p>{formErrors.name}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              value={details.email}
              placeholder="Enter your Email"
              onChange={handleInput}
              autoComplete="off"
            />
            {formErrors.email && <p>{formErrors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              value={details.password}
              placeholder="Enter your Password"
              onChange={handleInput}
              autoComplete="off"
            />
            {formErrors.password && <p>{formErrors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile</label>
            <input
              name="mobile"
              type="tel"
              value={details.mobile}
              placeholder="123-4567-890"
              onChange={handleInput}
              autoComplete="off"
              pattern="[0-9]{3}-[0-9]{4}-[0-9]{3}"
            />
            {formErrors.mobile && <p>{formErrors.mobile}</p>}
          </div>

          <center>
            <button type="submit">Register</button>
          </center>
        </form>
        {Object.keys(formErrors).length === 0 && formSubmit && showToast ? (
          <div className="toast">
            <b className="success-msg">Form Submitted</b>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Form;
