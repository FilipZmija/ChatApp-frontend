import { RefObject, useCallback, useLayoutEffect, useState } from "react";

export const useScrollBottom = (
  element: RefObject<HTMLDivElement>,
  getData: () => Promise<void> | void,
  conditions: boolean
) => {
  const [distanceBottom, setDistanceBottom] = useState(0);
  const ref = element.current;
  const scrollListener = useCallback(async () => {
    if (ref) {
      let bottom = ref.scrollHeight - ref.clientHeight;
      console.log(ref.scrollTop > bottom - distanceBottom, conditions);

      if (!distanceBottom) {
        setDistanceBottom(Math.round(bottom * 0.1));
      }
      if (ref.scrollTop > bottom - distanceBottom && conditions) {
        await getData();
      }
    }
  }, [distanceBottom, getData, setDistanceBottom, conditions, ref]);

  useLayoutEffect(() => {
    if (ref) {
      ref.addEventListener("scroll", scrollListener);
      return () => {
        ref.removeEventListener("scroll", scrollListener);
      };
    }
  }, [scrollListener, ref]);
};
