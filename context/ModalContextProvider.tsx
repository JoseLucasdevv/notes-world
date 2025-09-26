import { useState, createContext, ReactNode } from "react";

interface ModalContextType {
  isOpen: (id: string) => boolean;
  open: (id: string) => void;
  close: (id: string) => void;
  setModalColor: (id: string, color: string) => void;
  getModalColor: (id: string) => string;
}

const defaultValue: ModalContextType = {
  isOpen: () => false,
  open: () => {},
  close: () => {},
  setModalColor: () => {},
  getModalColor: () => "",
};

export const ModalContext = createContext<ModalContextType>(defaultValue);

interface ModalContextProps {
  children: ReactNode;
}

export const ModalContextProvider = ({ children }: ModalContextProps) => {
  const [modals, setModals] = useState<{ [key: string]: boolean }>({});
  const [modalColors, setModalColors] = useState<{ [key: string]: string }>({});

  const isOpen = (id: string) => !!modals[id];
  const open = (id: string) => setModals((prev) => ({ ...prev, [id]: true }));
  const close = (id: string) => setModals((prev) => ({ ...prev, [id]: false }));
  const setModalColor = (id: string, color: string) =>
    setModalColors((prev) => ({ ...prev, [id]: color }));
  const getModalColor = (id: string) => modalColors[id] || "";

  return (
    <ModalContext.Provider
      value={{ isOpen, open, close, setModalColor, getModalColor }}
    >
      {children}
    </ModalContext.Provider>
  );
};
