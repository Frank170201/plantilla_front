import {toast} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const useNoti = () => {
  const notify = (message, type = 'success', options = {}) => {
    toast[type](message, {...options, clearOnUrlChange: false});
  }
  return {notify}
}

export default useNoti
