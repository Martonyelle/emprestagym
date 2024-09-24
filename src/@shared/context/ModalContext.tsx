import React, { createContext, useState, ReactNode, FC } from "react";

interface ModalContextProps {
    openModal: <P>(Component: React.FC<P>, props: P) => void;
    closeModal: () => void;
}

export const ModalContext = createContext<ModalContextProps>({
    openModal: () => {},
    closeModal: () => {},
});

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [ModalComponent, setModalComponent] = useState<React.FC<any> | null>(null);
    const [modalProps, setModalProps] = useState<any>(null);

    const openModal = <P,>(Component: React.FC<P>, props: P) => {
        setModalComponent(() => Component);
        setModalProps(props);
    };

    const closeModal = () => {
        setModalComponent(null);
        setModalProps(null);
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {ModalComponent && (
                <ModalComponent
                    {...modalProps}
                    isOpen={true}
                    closeFn={closeModal}
                />
            )}
        </ModalContext.Provider>
    );
};
