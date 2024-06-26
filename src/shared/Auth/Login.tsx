"use client";

import styles from "@/src/utils/style";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { LOGIN_USER } from "@/src/graphql/actions/login.action";
import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { signIn } from "next-auth/react"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long!"),
});

type LoginSchema = z.infer<typeof formSchema>;

const Login = ({
  setActiveState,
  setOpen,
}: {
  setActiveState: (e: string) => void;
  setOpen: (e: boolean) => void;
}) => {
  const [Login, { loading }] = useMutation(LOGIN_USER);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });

  const [show, setShow] = useState(false);

  const onSubmit = async (data: LoginSchema) => {
    const loginData = {
      email: data.email,
      password: data.password,
    };
    const response = await Login({
      variables: loginData,
    });
    if (response.data.Login.user) {
      toast.success("Login Successful!");
      Cookies.set("refresh_token", response.data.Login.refreshToken);
      Cookies.set("access_token", response.data.Login.accessToken);
      setOpen(false);
      reset();
      window.location.reload();
    } else {
      toast.error(response.data.Login.error.message);
    }
  };

  return (
    <div>
      <br />
      <h1 className={`${styles.title}`}>Login with Culinary Tom</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={`${styles.label}`}>Enter your Email</label>
        <input
          type="email"
          {...register("email")}
          placeholder="example@gmail.com"
          className={`${styles.input}`}
        />
        {errors.email && (
          <span className="text-rose-500 block mt-1">
            {`${errors.email.message}`}
          </span>
        )}
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter your password
          </label>
          <input
            type="password"
            {...register("password")}
            placeholder="password!@#$%"
            className={`${styles.input}`}
          />
          {errors.password && (
            <span className="text-rose-500 block mt-1">
              {`${errors.password.message}`}
            </span>
          )}
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>
        <div className="w-full mt-5 relative mb-1 space-y-4">
          <span
            className={`${styles.label} py-2 text-amber-400 block text-right cursor-pointer hover:underline`}
            onClick={() => setActiveState("Forgot-Password")}
          >
            Forgot your password?
          </span>
          <input
            type="submit"
            value="Login"
            disabled={isSubmitting || loading}
            className={`${styles.button}`}
          />
          <br />
          <h5 className="text-center pt-4 font-Poppins text-[16px] text-white">
            Or join with
          </h5>
          <div className="flex items-center justify-center my-3">
            <FcGoogle size={30} className="cursor-pointer mr-2" onClick={() => signIn()}/>
          </div>
          <h5 className="text-center pt-4 font-Poppins text-[14px] text-white">
            Not have any account?
            <span
              className="text-emerald-400 pl-1 cursor-pointer"
              onClick={() => setActiveState("Signup")}
            >
              Sign up
            </span>
          </h5>
        </div>
      </form>
    </div>
  );
};

export default Login;
