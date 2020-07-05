import React from "react";

import "./ad.css";

const Ad = props => {
	return (
		<div className="ad-container">
            <div className="ad-picture-small">
                <img src={props.smallImage} alt={props.title} />
            </div>
            <div className="ad-content">
                <span className="ad-title">{props.title}</span>
                <span style={{margin: `0 5px`}} dangerouslySetInnerHTML={{ __html: `&#8226;`}}></span>
                <span className="sponsered-tag">
                    sponsored
                </span>

                <div className="ad-description">
                    {props.desc}
                </div>
                {
                    props.bigImage ? <div className="ad-picture-big">
                    <img src={props.bigImage} alt={props.title} />
                    </div> : null
                }
                
                <div className="ad-call-to-action">
                    {props.adCallText}
                </div>
            </div>
		</div>
	);
};

export default Ad;
