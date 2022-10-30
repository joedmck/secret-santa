import { FC, MouseEventHandler } from 'react';

interface TopBarButtonProps {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}
interface TopBarProps {
  leftButton?: TopBarButtonProps;
  rightButton?: TopBarButtonProps;
}

const Button: FC<TopBarButtonProps> = ({ text, onClick }) => {
  return (
    <button
      className={`px-10 py-2 rounded border hover:bg-gray-100 dark:hover:bg-neutral-700`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const TopBar: FC<TopBarProps> = ({ leftButton, rightButton }) => {
  let justifyClassName = '';
  if (leftButton && rightButton) justifyClassName = 'justify-between';
  else if (leftButton) justifyClassName = 'justify-start';
  else if (rightButton) justifyClassName = 'justify-end';

  return (
    <div className={`flex flex-row w-full ${justifyClassName}`}>
      {leftButton && <Button {...leftButton} />}
      {rightButton && <Button {...rightButton} />}
    </div>
  );
};

export default TopBar;
