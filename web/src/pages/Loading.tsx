import { FC, useState, useEffect } from 'react';

const Loading: FC = () => {
  // huge bodge but don't show loading spinner if loading page is
  // rendered briefly while waiting for state to load
  const [show, setShow] = useState<boolean>(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, 250);
    return () => clearTimeout(timeout);
  }, [show]);
  if (!show) return null;

  return (
    <section className={`flex flex-col justify-center items-center h-screen`}>
      <div
        className={`w-40 h-40 border-t-8 border-b-8 border rounded-full animate-spin`}
      >
        <span className={`sr-only`}>Loading...</span>
      </div>
      <h1 className={`text-lg text-center mt-5`}>Loading...</h1>
    </section>
  );
};

export default Loading;
