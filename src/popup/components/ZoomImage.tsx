import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import '../styles/components/ZoomImage.scss';

const ZoomImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img src={src} alt={alt} className={className} onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }} />
      {isOpen && ReactDOM.createPortal(
        <ZoomImageModal src={src} alt={alt} setIsOpen={setIsOpen} />,
        document.body
      )}
    </>
  )
}

const ZoomImageModal = ({ src, alt, setIsOpen }: { src: string; alt: string; setIsOpen: (open: boolean) => void }) => {
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.750);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setScale(1);
    }, 10);
  }, []);

  const close = () => {
    setBackgroundOpacity(0);
    setScale(0);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  }

  return (
    <div className="zoom-image-background" style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})` }} onClick={(e) => { close(); e.stopPropagation(); }} >
      <div className="zoom-image-container" style={{ transform: `scale(${scale})` }} onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} />
        <div className="title">
          <p>{alt}</p>
        </div>
      </div>
    </div>
  )
}

export default ZoomImage;
