import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ErrorPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/');
  }, [router]);
};

export default ErrorPage;
