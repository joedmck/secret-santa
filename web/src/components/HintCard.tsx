import { firebaseFirestore } from '@/firebase-instance';
import { deleteDoc, doc } from 'firebase/firestore';
import { FC } from 'react';

interface HintCardProps {
  hintId: string;
  title: string;
  notes: string;
  authorName: string;
  price: number;
  link?: string;
  showDelete: boolean;
}

const HintCard: FC<HintCardProps> = ({
  hintId,
  title,
  notes,
  authorName,
  price,
  link,
  showDelete,
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
      {showDelete === true && (
        <div className={`flex flex-row justify-end mt-1`}>
          <button
            className={`px-10 py-2 rounded border hover:bg-gray-100 dark:hover:bg-neutral-700`}
            onClick={_ => deleteDoc(doc(firebaseFirestore, 'hints', hintId))}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default HintCard;
