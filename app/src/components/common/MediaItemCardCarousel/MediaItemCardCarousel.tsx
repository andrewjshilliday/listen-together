import React, { useEffect, createRef } from 'react';
import { Box } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { MediaItemCard } from '../../common';
import styled from 'styled-components';
import arrow from '../../../assets/images/arrow.svg';

interface MediaItemCardCarouselProps {
  items: MusicKit.MediaItem[],
  title?: string
}

const MediaItemCardCarousel: React.FC<MediaItemCardCarouselProps> = ({ items, title }) => {
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
    <CarouselContainer>
      {title && <h2>{title}</h2>}
      <MediaItemsContainer id={`items-${items[0].id}-${items[items.length-1].id}`}>
        <LeftIcon ref={leftIconRef} onClick={() => scroll(false)}></LeftIcon>
        <MediaItemCollection ref={rowRef}>
          {items.every((item: MusicKit.MediaItem) => item.attributes) ?
            items.map((item: MusicKit.MediaItem) => (
              <MediaItemCard key={item.id} item={item}></MediaItemCard>
            ))
            :
            Array.from(new Array(3)).map((_, i) => (
              <Box key={i} width="16.667%" style={{ margin: '0 10px', borderRadius: '0.5em' }}>
                <Skeleton variant="rect" width="100%" height={180} style={{ marginBottom: 4, borderRadius: '0.5em' }} />
                <Skeleton variant="rect" width="100%" height={20} style={{ marginBottom: 4, borderRadius: '0.5em' }} />
                <Skeleton variant="rect" width="100%" height={20} style={{ borderRadius: '0.5em' }} />
              </Box>
            ))
          }
        </MediaItemCollection>
        <RightIcon ref={rightIconRef} onClick={() => scroll(true)}></RightIcon>
      </MediaItemsContainer>
    </CarouselContainer>
  );
}

export default MediaItemCardCarousel;


const CarouselContainer = styled.div`
  h2 {
    margin-left: 45px;
    margin-bottom: 10px;
  }
`;
const MediaItemsContainer = styled.div`
  display: flex;
  width: 100%;
`;
const LeftIcon = styled.div`
  display: inline-block;
  width: 35px;

  &::before {
    content: '';
    width: 25px;
    height: 56px;
    position: relative;
    top: 30%;
    float: left;
    background-color: var(--on-background);
    mask: url(${arrow}) no-repeat center;
  }

  &:hover {
    cursor: pointer;
    &::before { background-color: var(--primary); }
  }
`;
const RightIcon = styled(LeftIcon)`
  &::before {
    float: right;
    transform: rotate(180deg);
  }
`;
const MediaItemCollection = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  overflow: hidden;
  scroll-behavior: smooth;
  width: calc(100% - 10px);
  margin: 0;
  padding-bottom: 15px;
`;