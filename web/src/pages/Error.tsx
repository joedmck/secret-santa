import { FC } from 'react';

const Error: FC = () => {
  return (
    <section
      className={`v-screen h-screen flex flex-col items-center justify-center`}
    >
      <h1 className={`text-3xl`}>An Error Occurred</h1>
      <p className={`text-5xl mt-5`}>:(</p>
    </section>
  );
};

export default Error;
