import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const auth = getAuth();
  const db = getDatabase();
  let navigate = useNavigate();

  let [email, setEmail] = useState("");
  let [fullName, setFullName] = useState("");
  let [password, setPassword] = useState("");
  let [emailErr, setEmailErr] = useState("");
  let [fullNameErr, setFullNameErr] = useState("");
  let [passwordErr, setPasswordErr] = useState("");

  let handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailErr("");
  };
  let handleFullName = (e) => {
    setFullName(e.target.value);
    setFullNameErr("");
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
    if (!fullName) {
      setFullNameErr("Full Name is required");
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
        fullName &&
        password &&
        re0.test(email) &&
        re.test(password) &&
        re2.test(password) &&
        re3.test(password) &&
        re4.test(password) &&
        re5.test(password)
      ) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((user) => {
            updateProfile(auth.currentUser, {
              displayName: fullName,
              photoURL: "images/demo-profile.jpg",
            })
              .then(() => {
                setEmail("");
                setFullName("");
                setPassword("");
                sendEmailVerification(auth.currentUser);

                setTimeout(() => {
                  navigate("/login");
                }, 1000);
              })
              .catch((error) => {
                console.log(error);
              })
              .then(() => {
                set(ref(db, "users/" + user.user.uid), {
                  username: user.user.displayName,
                  email: user.user.email,
                });
              });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode.includes("auth/email-already-in-use")) {
              setEmailErr("Email already in use");
            }
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
          <h1 className="text-4xl font-bold text-[#11175D]">
            Get started with easily register
          </h1>
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
                className="border-border-box relative mb-5 block w-[497px] border border-solid py-6 pl-[70px] pr-[90px] outline-none placeholder:text-xl placeholder:font-semibold"
                placeholder="Email"
                onChange={handleEmail}
              ></input>
              <p className="text-left font-nunito text-red-700">
                {fullNameErr}
              </p>
              <input
                className="border-border-box relative mb-5 block w-[497px] border border-solid py-6 pl-[70px] pr-[90px] outline-none placeholder:text-xl placeholder:font-semibold"
                placeholder="Fullname"
                onChange={handleFullName}
              ></input>
              <p className="text-left font-nunito text-red-700">
                {passwordErr}
              </p>
              <input
                className="border-border-box relative mb-5 block w-[497px] border border-solid py-6 pl-[70px] pr-[90px] outline-none placeholder:text-xl placeholder:font-semibold"
                placeholder="Password"
                onChange={handlePassword}
                type="password"
              ></input>
              <button
                onClick={handleSubmit}
                className="w-full rounded-full bg-[#086FA4] py-5 text-white"
              >
                <a>Sign Up</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
