import { clsx, type ClassValue } from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const baseServerURL = `http://127.0.0.1:8000`; //localhost
export const baseServerURL = `https://sentinela-eqan.onrender.com`; //live

// export const baseClientURL = `http://127.0.0.1:3000`; //localhost
export const baseClientURL = `https://sentinelamvp.netlify.app`; //live

export const useToast = () => {
  return function (type: "error" | "success", message: string) {
    const custom_styling = {
      fontSize: "0.8rem",
      minHeight: "20px", // Reduce height
      lineHeight: "1.1", // Reduce spacing between lines
      padding: "8px 12px", // Adjust padding
    };

    return type === "error"
      ? toast.error(message, {
          style: custom_styling,
          className: "error-background",
          progressClassName: "error-progress-bar",
          autoClose: 5000,
        })
      : toast.success(message, {
          style: custom_styling,
          className: "success-background",
          progressClassName: "success-progress-bar",
          autoClose: 5000,
        });
  };
};

export function isValidDateString(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export type sanctionsType =
  | "eu_fsf"
  | "us_ofac_sdn"
  | "fr_tresor_gels_avoir"
  | "gb_hmt_sanctions"
  | "un_sc_sanctions";

export const readableSanctionString = (sanction: sanctionsType) => {
  const mapping = {
    eu_fsf: "Eu FSF List",
    us_ofac_sdn: "US OFAC SDN",
    fr_tresor_gels_avoir: "France Tresor List",
    gb_hmt_sanctions: "Great Britain HTM Sanction",
    un_sc_sanctions: "UN SC Sanctions",
  };

  return mapping[sanction];
};
