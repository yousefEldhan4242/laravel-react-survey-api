import { useStateContext } from '../contexts/ContextProvider';

const Toast = () => {
    const { toast,isErrorToast } = useStateContext();
    return (
        <>
            {toast.show && (
                <div className={`w-[300px] fixed right-4 bottom-4 z-50 rounded px-3 py-2 text-white animate-fade-in-down ${isErrorToast ? " bg-red-500" : "bg-emerald-500"}`}>
                    {toast.message}
                </div>
            )}
        </>
    );
};

export default Toast;
