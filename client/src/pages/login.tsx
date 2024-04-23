import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { io } from "socket.io-client";
import ThemeButton from "./theme_button";

const URL = process.env.NEXT_PUBLIC_URL ?? "";
export const socket = io(URL, { transports: ["websocket"] });

const validateUsername = (username: string) => {
  // Check if the input contains only alphanumeric characters and does not exceed 10 characters
  return /^[A-Za-z0-9]{1,10}$/.test(username);
};

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [warning, setWarning] = useState<string>("");

  const handleLogin = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (validateUsername(username)) {
      if (username) {
        socket.emit("register", {
          username: username,
        });
        router.push({ pathname: "/home", query: { username: username } });
        socket.emit("get-all-users");
      }
    } else {
      // Show warning if the username does not meet the criteria
      setWarning(
        "Name must contain only alphabet and number, and not exceed 10 characters."
      );
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-blue-gray-100 w-screen h-screen justify-center dark:bg-slate-800">
      <div className="border relative border-blue-gray-200 bg-gradient-to-r from-blue-gray-100 to-blue-gray-200 rounded-xl flex flex-col justify-center items-center px-12 py-16">
        <div className="absolute top-4 right-3">
          <ThemeButton/>
        </div>
        <Image src="/logo.png" alt="" width={200} height={100}></Image>
        <h1 className="mt-5 font-bold text-4xl text-[#4a5568] dark:text-white">Running Sadly</h1>
        <form
          className="w-max mt-10 flex flex-col justify-center items-center space-y-12"
          onSubmit={handleLogin}
        >
          <input
            type="text"
            className="focus:outline-none w-80 h-16 rounded-2xl bg-blue-gray-50 pl-5 text-blue-gray-800 border-2 border-blue-gray-200 text-xl"
            placeholder="Username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="submit"
            className="w-18 text-lg font-bold flex items-center justify-center h-12 w-60 bg-[#3182ce] rounded-full ml-5 text-white
            dark:text-[#3182ce] dark:bg-slate-100"
            name="Go"
          >
            Let's Chat !
          </button>
        </form>
        {warning && <p className="mt-3 text-red-500">{warning}</p>}
      </div>
    </div>
  );
};
export default Login;
