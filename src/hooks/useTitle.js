import { useEffect } from 'react';

const useTitle = (title) => {
  useEffect(() => {
    if (title) {
      const prevTitle = document.title;
      document.title = `${title} - IUPM`;

      return () => {
        document.title = prevTitle;
      };
    }
  }, [title]);
};

export default useTitle;
