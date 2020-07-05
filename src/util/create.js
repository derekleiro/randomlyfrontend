const create = async (uid, message, token) =>{
    try {
        const response = await fetch(`http://localhost:5000/create`, {
            method: "POST",
            body: JSON.stringify({
                rawContent: message,
                uid: uid,
                token: token,
            }),
            headers: { "Content-Type": "application/json" },
        });

        const JSONresponse = await response.json();
        if (JSONresponse.sent) {
            window.history.back();
        } else {
            console.log("An error occurred");
        }
    } catch (e) {
        console.log(e);
    }
}

export default create;
