import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
// import { firebaseConfig } from "../config/config.js"//추후 파이어베이스 키 외부 연결용

const firebaseConfig = {
    apiKey: "AIzaSyCWKa54Jtzh5xTtKAYoXBxFr8vEfRwFHbQ",
    authDomain: "booknawa-2ac00.firebaseapp.com",
    databaseURL: "https://booknawa-2ac00-default-rtdb.firebaseio.com",
    projectId: "booknawa-2ac00",
    storageBucket: "booknawa-2ac00.appspot.com",
    messagingSenderId: "93348426977",
    appId: "1:93348426977:web:d5469afa3411fb01bcf3a0"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();

//로그인
document.getElementById('signInButton').addEventListener('click', (event)=>{
    event.preventDefault();
    const signInEmail = document.getElementById('signInEmail').value;
    const signInPassword = document.getElementById('signInPassword').value;

    signInWithEmailAndPassword(auth, signInEmail, signInPassword)
        .then((userCredential) => {
            // 로그인 성공
            const user = userCredential.user;
            // 사용자 이메일 localStorage에 저장
            localStorage.setItem('userEmail', user.email);
            console.log(user);
            window.location.href = '/';
        })
        .catch((error) => {
            console.log('로그인 실패');
            console.error(error.code, error.message);
        });
});