import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import autosize from "autosize";

const TextBar = (props) => {
	const [c, setC] = useState(false);
	const [count, setCount] = useState(0);
	const [remainingCount, setRemainingCount] = useState(50);

	const [Text, setText] = useState("");
	const [postUnsent, setState] = useState(true);

	const textCount = (e) => {
		setC(false);
		setCount(e.target.value.length);
		setText(e.target.value);

		if (e.target.value.length > 270) {
			setRemainingCount(500 - e.target.value.length);
		}
	};

	const textarea = (c) => {
		if (c) {
			c.focus();
			autosize(c);
		}
	};

	const sendText = () => {
		setState(true);
		setText("");
		setC(true);
		setCount(0);

		

		try {
			firebase.auth().onAuthStateChanged(user =>{
				if(user){
					props.sentMessage({
						uid: user.uid,
						message: Text,
						timestamp: Date.now(),
					});

					user.getIdToken(true).then(async token =>{
						const reponse = await fetch(`http://localhost:5000/messenger`, {
							method: "POST",
							body: JSON.stringify({
								message: Text,
								uid: user.uid,
								r_uid: props.r_uid,
								token: token,
							}),
							headers: { "Content-Type": "application/json" },
						});
					})
				}
			})
			
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<div id="comment-bar">
			<textarea
				ref={(c) => textarea(c)}
				value={Text}
				onChange={textCount}
				placeholder="Say hi.."
				style={{ maxHeight: c ? "42px" : "200px" }}
			></textarea>
			{count > 0 && count < 501 && postUnsent && Text.trim() !== "" ? (
				<span onClick={sendText} id="send-comment-text">
					SEND
				</span>
			) : (
				<span style={{ opacity: 0.6 }} id="send-comment-text">
					SEND
				</span>
			)}
			{count > 450 && count < 501 ? (
				<span id="comment-text-limit">{remainingCount}</span>
			) : null}
			{count > 500 ? (
				<span style={{ color: "#fc0060" }} id="comment-text-limit">
					{remainingCount}
				</span>
			) : null}
		</div>
	);
};

export default TextBar;
