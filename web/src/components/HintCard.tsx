import { FC } from 'react';

interface HintCardProps {
  title: string;
  notes: string;
  authorName: string;
  price: number;
  link?: string;
}

const HintCard: FC<HintCardProps> = ({
  title,
  notes,
  authorName,
  price,
  link,
}) => {
  return (
    <div
      className={`block p-6 rounded-lg border shadow-md w-full overflow-hidden text-ellipsis`}
    >
      <div className={`flex flex-row justify-between`}>
        <h5 className={`mb-2 text-2xl font-bold`}>{title}</h5>
        <p className={`text-lg`}>£{price.toFixed(2)}</p>
      </div>
      <p className={`text-sm italic mb-2`}>Hint by {authorName}</p>
      <p className={`font-normal`}>{notes}</p>
      {link && (
        <a className={`text-blue-600 visited:text-purple-600`} href={link}>
          {link}
        </a>
      )}
    </div>
  );
};

export default HintCard;
