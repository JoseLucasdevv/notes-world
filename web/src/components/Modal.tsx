import { useContext, useEffect, useRef, memo, useCallback } from "react";
import { ModalContext } from "../context/ModalContextProvider";
import { X } from "@phosphor-icons/react";

interface ModalProps {
  id: string;
  children: React.ReactNode;
}

const Modal = ({ id, children }: ModalProps) => {
  const { isOpen, close, getModalColor } = useContext(ModalContext);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen(id)) {
      document.body.style.overflow = "hidden";
      if (modalRef.current) {
        modalRef.current.style.display = "flex";
      }
    } else {
      document.body.style.overflow = "auto";
      if (modalRef.current) {
        modalRef.current.style.display = "none";
      }
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, id]);

  const handleClose = useCallback(() => {
    close(id);
  }, [close, id]);

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
      style={{ display: isOpen(id) ? "flex" : "none" }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-3xl rounded border-t-8 p-4 sm:p-8 md:p-12 lg:p-16"
        style={{ borderColor: getModalColor(id), backgroundColor: "white" }}
        onClick={handleContentClick}
      >
        <button onClick={handleClose} className="absolute right-4 top-4">
          <span className="sr-only">Fechar modal</span>
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default memo(Modal);
