import { useLayoutEffect, useRef, useCallback } from "react";

export const ScrollStackItem = ({ children, itemNumber }) => (
  <div
    className={`w-11/12 mx-auto h-11/12 p-6 rounded-2xl border-[#e4e4e7] border origin-top  bg-[#F5F5F5]  shadow-sm item item-${itemNumber}`}
  >
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = "",
  itemDistance = 0,
  itemScale = 0.005,
  itemStackDistance = 0,
  stackPosition = "0%",
  scaleEndPosition = "0%",
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 2,
  onStackComplete,
}) => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const stackCompletedRef = useRef(false);

  // Inverted progress for "scroll up" activation
  const calculateProgress = (scrollTop, start, end) => {
    if (scrollTop < start) return 1; // fully active above start
    if (scrollTop > end) return 0; // inactive past end
    return 1 - (scrollTop - start) / (end - start);
  };

  const parsePercentage = (value, containerHeight) => {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  };

  const updateCardTransforms = useCallback(() => {
    const section = sectionRef.current;
    if (!section || !cardsRef.current.length) return;

    const scrollTop = window.scrollY - section.offsetTop;
    const containerHeight = window.innerHeight;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(
      scaleEndPosition,
      containerHeight
    );
    const endElement = section.querySelector(".scroll-stack-end");
    const endElementTop = endElement
      ? endElement.offsetTop
      : section.scrollHeight;

    cardsRef.current.forEach((card, i) => {
      // invert index (last card enters first, first card ends up on top)
      const indexFromTop = cardsRef.current.length - 1 - i;

      const cardTop = card.offsetTop;
      const triggerStart =
        cardTop - stackPositionPx - itemStackDistance * indexFromTop;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = triggerStart;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(
        scrollTop,
        triggerStart,
        triggerEnd
      );
      const targetScale = baseScale + indexFromTop * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);

      // reverse rotation with inverted progress
      const rotation = rotationAmount
        ? indexFromTop * rotationAmount * (1 - scaleProgress)
        : 0;

      // blur logic (reversed order)
      let blur = 0;
      if (blurAmount) {
        let topCardIndex = cardsRef.current.length - 1;
        for (let j = cardsRef.current.length - 1; j >= 0; j--) {
          const jCardTop = cardsRef.current[j].offsetTop;
          const jTriggerStart =
            jCardTop -
            stackPositionPx -
            itemStackDistance * (cardsRef.current.length - 1 - j);
          if (scrollTop <= jTriggerStart) {
            topCardIndex = j;
          }
        }
        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      // translate upward instead of downward
      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      if (isPinned) {
        translateY = -(
          scrollTop -
          cardTop +
          stackPositionPx +
          itemStackDistance * indexFromTop
        );
      } else if (scrollTop > pinEnd) {
        translateY = -(
          pinEnd -
          cardTop +
          stackPositionPx +
          itemStackDistance * indexFromTop
        );
      }

      card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotation}deg)`;
      card.style.filter = blur > 0 ? `blur(${blur}px)` : "";

      // detect stack completion (still uses first card, but inverted condition)
      if (i === 0) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
  ]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = Array.from(section.querySelectorAll(".scroll-stack-card"));
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
    });

    const onScroll = () => updateCardTransforms();
    window.addEventListener("scroll", onScroll, { passive: true });

    updateCardTransforms();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cardsRef.current = [];
      lastTransformsRef.current.clear();
    };
  }, [itemDistance, updateCardTransforms]);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full min-h-screen ${className}`}
    >
      <div className="scroll-stack-inner">
        {children}
        {/* <div className="scroll-stack-end w-full h-px" /> */}
      </div>
    </section>
  );
};

export default ScrollStack;
