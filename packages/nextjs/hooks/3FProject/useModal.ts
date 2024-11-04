import { useRef } from "react";

export const useModal = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  return {
    modalRef,
    openModal,
    closeModal,
  };
};
