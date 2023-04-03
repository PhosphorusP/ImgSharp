import { SyncOutlined } from "@ant-design/icons";
import React, { memo, useRef } from "react";
import { useSelector } from "react-redux";
import { Mousewheel } from "swiper";
import "swiper/css";
import "swiper/css/mousewheel";
import { Swiper, SwiperSlide } from "swiper/react";
import { selectImg } from "../../store/action";

type ItemProps = {
  img: Img;
  selectedImg: string;
};

const thumbSize = "40px";

const _ThumbGalleryItemRender: React.FC<ItemProps> = ({
  img,
  selectedImg,
}: ItemProps) => {
  return (
    <abbr
      title={img.rawImageObj ? img.fileInfo!.name : undefined}
      children={
        <div
          style={{
            width: thumbSize,
            height: thumbSize,
            backgroundImage: img.thumb ? `url(${img.thumb.src})` : undefined,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            transitionDuration: ".25s",
            opacity: img.id == selectedImg ? 1 : 0.3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      }
    />
  );
};

const eq = function (prevProps: any, nextProps: any) {
  let selectedPrev = false,
    selectedNext = false;
  if (prevProps.img.id && nextProps.img.id) {
    selectedPrev = prevProps.img.id == prevProps.selectedImg;
    selectedNext = nextProps.img.id == nextProps.selectedImg;
    if (!((selectedPrev && selectedNext) || (!selectedPrev && !selectedNext)))
      return false;
  }
  if (prevProps.img.thumb != nextProps.img.thumb) return false;
  return true;
};

const _ThumbGalleryItem = memo(_ThumbGalleryItemRender, eq);

const ThumbGallery: React.FC = () => {
  const imgs = useSelector((state: any) => state.reducer.imgs);
  const selectedImg = useSelector((state: any) => state.reducer.selectedImg);
  const selectedImgIndex = useSelector(
    (state: any) => state.reducer.selectedImgIndex
  );
  const swiper = useRef(null);
  const toImport = imgs.filter((i: Img) => !i.rawImageObj).length;
  if (toImport > 0)
    return (
      <>
        <SyncOutlined style={{ marginRight: "4px" }} spin />
        <span style={{ transform: "scale(0.8) translate(-4px, -8px)" }}>
          {toImport}
        </span>
      </>
    );
  if (swiper.current && (swiper.current as any).swiper) {
    if (selectedImgIndex >= 0)
      ((swiper.current as any).swiper as any).slideTo(selectedImgIndex);
  }
  return (
    <Swiper
      modules={[Mousewheel]}
      mousewheel={{ eventsTarget: "#preview-area" }}
      spaceBetween={0}
      slidesPerView="auto"
      centeredSlides
      preventInteractionOnTransition
      onSlideChange={(s: any) => {
        selectImg(s.activeIndex);
      }}
      ref={swiper}
      style={{ flex: 1 }}
    >
      {imgs.map((i: Img, index: any) => (
        <SwiperSlide
          style={{ width: thumbSize, height: thumbSize }}
          key={i.id as any}
          onClick={() => {
            selectImg(index);
          }}
        >
          <_ThumbGalleryItem img={i} selectedImg={selectedImg} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
export default ThumbGallery;
