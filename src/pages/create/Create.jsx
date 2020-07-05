import React, { useState, useEffect } from "react";

import "./create.css";

import TopNav from "../../components/createfeed/TopNav";
import TextArea from "../../components/createfeed/TextArea/TextArea";

const Create = () => {
	const [fade, setFade] = useState(false);
	useEffect(() => {
		setTimeout(() => setFade(true), 200);
	}, []);

	return (
		<div id="page-create" style={{ opacity: fade ? 1 : 0 }}>
			<TopNav />
			<TextArea />
		</div>
	);
};

export default Create;
