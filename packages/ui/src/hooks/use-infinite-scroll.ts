import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  // messages.status in apps\widget\modules\widget\ui\screens\widget-chat-screen.tsx
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  loadSize?: number;
  observerEnable?: boolean;
}

export function useInfiniteScroll({
  status,
  loadMore,
  loadSize = 10,
  observerEnable = true,
}: UseInfiniteScrollProps) {
  const topElementRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(loadSize);
    }
  }, [status, loadMore, loadSize]);

  useEffect(() => {
    const topElement = topElementRef.current;
    if (!topElement || !observerEnable) return;

    const observer = new IntersectionObserver(
      ([entries]) => {
        if (entries?.isIntersecting) {
          handleLoadMore();
        }
      }, { threshold: 0.1 }
    );
    observer.observe(topElement);

    return () => {
      observer.disconnect();
    };

  }, [handleLoadMore, observerEnable]);

  return {
    topElementRef,
    handleLoadMore,
    canLoadMore: status === "CanLoadMore",
    isLoadingMore: status === "LoadingMore",
    isLoadingFirstPage: status === "LoadingFirstPage",
    isExhausted: status === "Exhausted",
  };
}