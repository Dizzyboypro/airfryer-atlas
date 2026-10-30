import { useEffect, useRef } from "react";

/**
 * Прокручивает горизонтальную ленту колёсиком при наведении. На краях
 * отдаёт событие странице, чтобы обычный вертикальный скролл не ломался.
 */
export function useHorizontalWheel<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const maxScroll = element.scrollWidth - element.clientWidth;
      if (maxScroll <= 0) return;

      if (event.deltaY < 0 && element.scrollLeft <= 0) return;
      if (event.deltaY > 0 && element.scrollLeft >= maxScroll - 1) return;

      event.preventDefault();
      element.scrollLeft = Math.min(
        maxScroll,
        Math.max(0, element.scrollLeft + event.deltaY),
      );
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, []);

  return ref;
}
