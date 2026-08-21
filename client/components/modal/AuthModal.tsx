"use client";

import CustomModal from "../shared/CustomModal";
import LoginForm from "../form/LoginForm";
import SignupForm from "../form/SignupForm";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openLoginModal, openSignupModal } from "@/redux/features/ui/uiSlice";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();

  const { authMode } = useAppSelector((state) => state.ui);
  const toggleMode = () => {
    if (authMode === "login") {
      dispatch(openSignupModal());
    } else {
      dispatch(openLoginModal());
    }
  };

  const title =
    authMode === "login" ? "Login to your account" : "Create new account";

  return (
    <CustomModal title={title} isOpen={isOpen} onClose={onClose}>
      {authMode === "login" ? (
        <LoginForm mode={authMode} toggleMode={toggleMode} />
      ) : (
        <SignupForm mode={authMode} toggleMode={toggleMode} />
      )}
    </CustomModal>
  );
}
