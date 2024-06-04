import React, { useState } from "react";
import "../styles/components/Tooltip.scss";

const Tooltip = (props) => {
    let timeout;
    const [active, setActive] = useState(false);

    const showTip = () => {
        timeout = setTimeout(() => {
            setActive(true);
        }, props.delay || 400);
    };

    const hideTip = () => {
        clearInterval(timeout);
        setActive(false);
    };

    return (
        <div className="Tooltip-Wrapper" onMouseEnter={showTip} onMouseLeave={hideTip}>
            {props.children}
            {active && (
                <div className={`Tip ${props.direction || "top"}`}>
                    <div>{props.content}</div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;