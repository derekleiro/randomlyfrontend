import firebase from "firebase/app";
import "firebase/auth";

const callGoogleSignIn = () => {
    let provider = new firebase.auth.GoogleAuthProvider();

    firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (result) => {
            if (result) {
                result.user.getIdToken(true)
                    .then(async (idToken) => {
                        const response = await fetch(`http://localhost:5000/login`, {
                            method: "POST",
                            body: JSON.stringify({ token: idToken, user: result.user }),
                            headers: { "Content-Type": "application/json" },
                        });

                        const JSONresponse = await response.json();
                        if (JSONresponse.success) {
                            localStorage.setItem(
                                "user",
                                JSON.stringify({
                                    photoURL: JSONresponse.user.photoURL,
                                    name: JSONresponse.user.name,
                                })
                            );
                            const date = new Date();
                            date.setTime(date.getTime() + 3000 * 24 * 60 * 60 * 1000);
                            const expires = "; expires=" + date.toGMTString();

                            document.cookie = `auth=${JSONresponse.token}; expires=${expires}; path=/;`;
                            window.location.replace("/");
                        } else {
                            console.log("An error occurred");
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                console.log("Error retrieving user info");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};

export default callGoogleSignIn;
