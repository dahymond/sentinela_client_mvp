"use client";

import "react-toastify/dist/ReactToastify.css";
import "../../globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider() {

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000}/>
    </>
  );
}