"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import Modal from "../../components/ui/modal";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = observer(
  ({ children }) => {
    const [theme, setTheme] = useState<Theme>("light");
    const [isInitialized, setIsInitialized] = useState(false);
    const [showBirthdayModal, setShowBirthdayModal] = useState(false);
    const { userStore } = useStore();
    const { user } = userStore;

    useEffect(() => {
      console.log("Birthday effect run", user?.birthday);
      if (user?.birthday) {
        const birthday = new Date(user.birthday);
        const today = new Date();

        if (
          birthday.getMonth() === today.getMonth() &&
          birthday.getDate() === today.getDate()
        ) {
          const shownKey = `birthday-modal-shown-${today.getFullYear()}-${
            today.getMonth() + 1
          }-${today.getDate()}`;
          if (!localStorage.getItem(shownKey)) {
            setShowBirthdayModal(true);
            localStorage.setItem(shownKey, "true");
          }

          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("birthday-modal-shown-") && key !== shownKey) {
              localStorage.removeItem(key);
            }
          });
        }
      }
    }, [user?.birthday]);

    useEffect(() => {
      // This code will only run on the client side
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      const initialTheme = savedTheme || "light"; // Default to light theme

      setTheme(initialTheme);
      setIsInitialized(true);
    }, []);

    useEffect(() => {
      if (isInitialized) {
        localStorage.setItem("theme", theme);
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        
      }
    }, [theme, isInitialized]);

    const toggleTheme = () => {
      setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    useEffect(() => {
      console.log("ThemeProvider mounted");
      return () => {
        console.log("ThemeProvider unmounted");
      };
    }, []);

    // Modal component (có thể thay bằng Modal của thư viện UI)
    const BirthdayModal = () =>
      showBirthdayModal ? (
        <Modal
          isOpen={showBirthdayModal}
          onClose={() => setShowBirthdayModal(false)}
          className="max-w-xl py-10 px-14"
        >
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold">🎉 Chúc mừng sinh nhật! 🎂</h2>
            <p className="text-lg">Thân ái từ IT.</p>
          </div>
        </Modal>
      ) : null;

    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
        <BirthdayModal />
      </ThemeContext.Provider>
    );
  }
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
