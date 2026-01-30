import { useToast } from '../../context/ToastContext';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div key={toast.id} className={`p-4 rounded shadow-lg ${getToastClass(toast.type)}`}>
          {toast.message}
          <button onClick={() => removeToast(toast.id)} className="ml-4 text-lg font-bold">×</button>
        </div>
      ))}
    </div>
  );
};

const getToastClass = (type) => {
  switch(type) {
    case 'success': return 'bg-green-500 text-white';
    case 'error': return 'bg-red-500 text-white';
    case 'warning': return 'bg-yellow-500 text-black';
    default: return 'bg-blue-500 text-white';
  }
};

export default ToastContainer;
