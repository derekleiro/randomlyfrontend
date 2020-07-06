import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import autosize from "autosize";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

import emoji_face from "../../../../assets/icons/emoji.png";
import keyboard from "../../../../assets/icons/keyboard.png";

import "./textbar.css";

const TextBar = (props) => {
	const [c, setC] = useState(false);
	const [count, setCount] = useState(0);
	const [remainingCount, setRemainingCount] = useState(50);

	const [Text, setText] = useState("");
	const [postUnsent, setState] = useState(true);

	const [openPicker, setPicker] = useState(false);
	const [numberOfLineBreaks, setNumberOfLineBreaks] = useState(0)

	const openPickerHandler = () => {
		if (openPicker) {
			setPicker(false);
			props.pickerOpened(false);
		} else {
			setPicker(true);
			props.pickerOpened(true);
		}
	};

	const addEmoji = (emoji) =>{
		setText(Text + emoji.native)
	}

	const textCount = (e) => {
		setC(false);
		setCount(e.target.value.length);
		setText(e.target.value);

		let numberOfColumns = e.target.cols;

		setNumberOfLineBreaks((e.target.value.match(/\n/g) || []).length);
		const characterCount = e.target.value.length + numberOfLineBreaks;

		if (characterCount > numberOfColumns) {
			props.lineBreaks(parseInt(characterCount / numberOfColumns) + 1);
		} else {
			props.lineBreaks(numberOfLineBreaks);
		}

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
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					props.sentMessage({
						uid: user.uid,
						message: Text,
						timestamp: Date.now(),
					});
					props.lineBreaks(numberOfLineBreaks);

					user.getIdToken(true).then(async (token) => {
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
					});
				}
			});
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<>
			<div
				className="comment-bar"
				style={{ bottom: openPicker ? "300px" : "0" }}
			>
				<img
					src={openPicker ? keyboard : emoji_face}
					alt="Emojis"
					id="emoji"
					onClick={openPickerHandler}
				></img>
				<textarea
					ref={(c) => textarea(c)}
					value={Text}
					onChange={textCount}
					placeholder="Say hi.."
					style={{
						maxHeight: c ? "42px" : "200px",
						padding: "10px 60px 10px 40px",
					}}
				></textarea>
				{count > 0 && count < 501 && postUnsent && Text.trim() !== "" ? (
					<span onClick={sendText} className="send-comment-text">
						SEND
					</span>
				) : (
					<span style={{ opacity: 0.6 }} className="send-comment-text">
						SEND
					</span>
				)}
				{count > 450 && count < 501 ? (
					<span className="comment-text-limit">{remainingCount}</span>
				) : null}
				{count > 500 ? (
					<span style={{ color: "#fc0060" }} className="comment-text-limit">
						{remainingCount}
					</span>
				) : null}
			</div>
			<div id="emoji-picker" style={{ display: openPicker ? "flex" : "none" }}>
				<Picker
					style={{
						width: "100%",
						height: "300px",
						background: "#fafafa",
						fontFamily: "Poppins",
						fontSize: "14px",
						lineHeight: "1.8em",
						border: "0",
						outline: "0",
						position: "fixed",
						bottom: "0"
					}}
					theme="light"
					sheetSize={64}
					set="apple"
					showPreview={false}
					onSelect={addEmoji}
					autoFocus={true}
				/>
			</div>
		</>
	);
};

export default TextBar;
