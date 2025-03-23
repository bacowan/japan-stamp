import { PropsWithChildren, useRef } from "react";

interface ModalParams {
    closeModal: () => void
}

export default function Modal({ children, closeModal }: PropsWithChildren<ModalParams>) {
    const backgroundRef = useRef<HTMLDivElement>(null);

    function onBackgroundClick(e: React.MouseEvent<HTMLDivElement>) {
        if (backgroundRef !== null && e.target === backgroundRef.current) {
            closeModal();
        }
    }

    return <div className="fixed z-1 top-[0] left-[0] w-full h-full overflow-auto bg-black/40 pt-[150px] flex flex-col items-center"
            onClick={onBackgroundClick} ref={backgroundRef}>
        <div className="bg-background dark:bg-darkBackground">
            {children}
        </div>
    </div>
}