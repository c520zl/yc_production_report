import { ref } from 'vue';
import axios from 'axios';

export function useRequest(url, options = {}) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchData = async () => {
    loading.value = true;
    try {
      const response = await axios({ url, ...options });
      data.value = response.data;
      error.value = null;
    } catch (err) {
      error.value = err;
      data.value = null;
    } finally {
      loading.value = false;
    }
  };

  if (options.autoRun !== false) {
    fetchData();
  }

  return { data, loading, error, fetchData };
}