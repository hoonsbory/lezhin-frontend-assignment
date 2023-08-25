import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface IntersectionObserverProps {
  entry?: IntersectionObserverEntry;
  setTarget: Dispatch<SetStateAction<Element | undefined>>;
}

const useIntersectionObserver = ({
  threshold = 0.5,
  root = null,
  rootMargin = '0%',
}: IntersectionObserverInit): IntersectionObserverProps => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [target, setTarget] = useState<Element>();

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => setEntry(entry);

  useEffect(() => {
    if (!target) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(target);

    return () => {
      console.log('unmount');
      observer.disconnect();
    };
  }, [target]);

  return {
    entry,
    setTarget,
  };
};

export default useIntersectionObserver;
