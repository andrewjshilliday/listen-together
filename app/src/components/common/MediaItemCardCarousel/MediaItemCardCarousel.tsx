import React, { useEffect, createRef } from 'react';
import { MediaItemCard } from '../../common';
import './MediaItemCardCarousel.scss';

interface MediaItemCardCarouselProps {
  items: Array<any>
}

const MediaItemCardCarousel: React.FC<MediaItemCardCarouselProps> = ({ items }) => {
  const rowRef = createRef<HTMLDivElement>();
  const leftIconRef = createRef<HTMLDivElement>();
  const rightIconRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (leftDisabled()) {
      leftIconRef.current!.classList.add('disabled');
    }
    if (rightDisabled()) {
      rightIconRef.current!.classList.add('disabled');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftIconRef, rightIconRef])

  const scroll = (right: boolean) => {
    if (right) {
      rightIconRef.current!.classList.add('disabled');
      leftIconRef.current!.classList.remove('disabled');
      rowRef.current!.scrollLeft += rowRef.current!.offsetWidth;
    } else {
      leftIconRef.current!.classList.add('disabled');
      rightIconRef.current!.classList.remove('disabled');
      rowRef.current!.scrollLeft -= rowRef.current!.offsetWidth;
    }

    setTimeout(() => {
      if (right && !rightDisabled()) {
        rightIconRef.current!.classList.remove('disabled');
      } else if (!right && !leftDisabled()) {
        leftIconRef.current!.classList.remove('disabled');
      }
    }, 600);
  }

  const leftDisabled = () => {
    return rowRef.current!.scrollLeft === 0;
  }

  const rightDisabled = () => {
    return (rowRef.current!.lastChild as HTMLElement).offsetLeft < rowRef.current!.scrollLeft + rowRef.current!.offsetWidth;
  }

  return (
    <div className="media-item-group-container" id={`items-${items[0].id}-${items[items.length-1].id}`}>
      <div className="left" ref={leftIconRef} onClick={() => scroll(false)}></div>
      <div className="media-item-group" ref={rowRef}>
        {items.map((item: any) => (
          <MediaItemCard key={item.id} item={item}></MediaItemCard>
        ))}
      </div>
      <div className="right" ref={rightIconRef} onClick={() => scroll(true)}></div>
    </div>
  );
}

export default MediaItemCardCarousel;
