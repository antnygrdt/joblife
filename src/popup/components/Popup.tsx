import React, { useEffect, useState, ReactNode } from "react";

interface PopupProps {
  header: string | ReactNode;
  setOpen: (open: boolean) => void;
  body: ReactNode;
  containerStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  instant?: boolean;
}

const Popup = (props: PopupProps) => {
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.750);
  const [scale, setScale] = useState(props.instant ? 1 : 0);

  useEffect(() => {
    setTimeout(() => {
      setScale(1);
    }, 10);
  }, []);

  const close = () => {
    setBackgroundOpacity(0);
    setScale(0);
    setTimeout(() => {
      props.setOpen(false);
    }, 300);
  }

  return (
    <div className="popupBackground" style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})` }} onClick={() => close()}>
      <div className="container" style={{ ...props.containerStyle, transform: `scale(${scale})` }} onClick={(e) => e.stopPropagation()}>
        <div className='header' style={props.headerStyle}>
          {typeof props.header === 'string' ? <h1>{props.header}</h1> : props.header}
          <div className="closeBtn">
            <img onClick={() => close()} src="/assets/icones/cross.png" alt="Croix" />
          </div>
        </div>
        {React.isValidElement(props.body) ? React.cloneElement(props.body as React.ReactElement<any>, {
          className: `body ${(props.body as React.ReactElement<any>).props?.className || ''}`
        }) : <div className="body">{props.body}</div>}
      </div>
    </div>
  );
};

export default Popup;