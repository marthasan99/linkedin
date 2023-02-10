import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../slices/userSlice";

const Login = () => {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [passwordShow, setPasswordShow] = useState(false);
  let [emailErr, setEmailErr] = useState("");
  let [passwordErr, setPasswordErr] = useState("");

  let handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailErr("");
  };
  let handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordErr("");
  };

  let handleSubmit = () => {
    const re0 =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const re = /^(?=.*[a-z])/;
    const re2 = /^(?=.*[A-Z])/;
    const re3 = /^(?=.*[0-9])/;
    const re4 = /^(?=.*[!@#$%^&*])/;
    const re5 = /^(?=.{8,})/;

    if (!email) {
      setEmailErr("Email is required");
    } else {
      if (!re0.test(email)) {
        setEmailErr("Please enter a valid email");
      }
    }
    if (!password) {
      setPasswordErr("Password is required");
    } else {
      if (!re.test(password)) {
        setPasswordErr(
          "Password must contain at least 1 lowercase alphabetical character"
        );
      }
      if (!re2.test(password)) {
        setPasswordErr(
          "Password must contain at least 1 uppercase alphabetical character"
        );
      }
      if (!re3.test(password)) {
        setPasswordErr("Password must contain at least 1 numeric character");
      }
      if (!re4.test(password)) {
        setPasswordErr("Password must contain at least one special character");
      }
      if (!re5.test(password)) {
        setPasswordErr("Password must be eight characters or longer");
      }
      if (
        email &&
        password &&
        re0.test(email) &&
        re.test(password) &&
        re2.test(password) &&
        re3.test(password) &&
        re4.test(password) &&
        re5.test(password)
      ) {
        signInWithEmailAndPassword(auth, email, password)
          .then((user) => {
            dispatch(userLoginInfo(user.user));
            localStorage.setItem("userInfo", JSON.stringify(user.user));
            setTimeout(() => {
              navigate("/");
            }, 1000);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });
      }
    }
  };

  return (
    <>
      <div className="  flex h-screen w-full items-center justify-center text-center ">
        <div className="hidden w-full">
          <div className="flex w-full items-center justify-center">
            <img src="images/Logo.png" alt="logo" />
          </div>
          <h1 className="text-4xl font-bold text-[#11175D]">Login</h1>
          <p>Free register and you can enjoy it</p>
        </div>
        <div className="w-full font-nunito">
          <div className="flex w-full items-center justify-center">
            <img src="images/Logo.png" alt="logo" />
          </div>
          <h1 className="mt-10 mb-3 text-4xl font-bold text-[#11175D]">
            Get started with easily register
          </h1>
          <p className="font-regular mb-12 text-base text-[#11175D] opacity-50">
            Free register and you can enjoy it
          </p>
          <div className="flex w-full justify-center">
            <div className="w-[497px]">
              <p className="text-left font-nunito text-red-700">{emailErr}</p>
              <input
                onChange={handleEmail}
                className="border-border-box relative mb-5 block w-[497px] border border-solid py-6 pl-[70px] pr-[90px] outline-none placeholder:text-xl placeholder:font-semibold"
                placeholder="Email"
              ></input>

              <p className="text-left font-nunito text-red-700">
                {passwordErr}
              </p>
              <input
                onChange={handlePassword}
                className="border-border-box relative mb-5 block w-[497px] border border-solid py-6 pl-[70px] pr-[90px] outline-none placeholder:text-xl placeholder:font-semibold"
                placeholder="Password"
                type="password"
              ></input>
              <button
                onClick={handleSubmit}
                className="w-full rounded-full bg-[#086FA4] py-5 text-white"
              >
                <a>Login</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
