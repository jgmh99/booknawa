import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
// import { config, firebaseConfig } from "../config/config.js"//추후 파이어베이스 키 외부 연결용

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



//입력값 검사

// if(signInEmail == null){
//     errMsg.innerHTML = '<p><span>아이디</span>를 입력해주세요</p>';
// }

//로그인버튼 눌렀을때 
// document.getElementById('signInButton').addEventListener('click', (e)=>{
//     e.preventDefault();
//     const errMsg = document.querySelector('#errMsg');
//     const signInEmail = document.getElementById('signInEmail').value;
//     const signInPassword = document.getElementById('signInPassword').value;
    

//     signInWithEmailAndPassword(auth, signInEmail, signInPassword)
//         .then((userCredential) => {
//             // 로그인 성공
//             const user = userCredential.user;
//             // 사용자 이메일 localStorage에 저장
//             localStorage.setItem('userEmail', user.email);
//             console.log(user);
//             window.location.href = '/';
//         })
//         .catch((error) => {
            
//             errMsg.innerHTML = '<p><span>아이디</span> 나 <span>비밀번호</span>를 확인해주세요</p>';
//             errMsg.style.display = 'block';
//         });
// });
document.getElementById('signInButton').addEventListener('click', (e) => {
    e.preventDefault();
    const errMsg = document.querySelector('#errMsg');
    const signInEmail = document.getElementById('signInEmail').value;
    const signInPassword = document.getElementById('signInPassword').value;
  
    // 이메일이 입력되지 않은 경우
    if (!signInEmail) {
        errMsg.innerHTML = '<p><span>이메일을</span> 입력해주세요</p>';
        errMsg.style.display = 'block';
        return;
    }
    else if(!signInPassword){
        errMsg.innerHTML = '<p><span>비밀번호를</span> 입력해주세요</p>';
        errMsg.style.display = 'block';
        return;
    }
  
    // 이메일과 비밀번호가 모두 입력된 경우
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
        errMsg.innerHTML = '<p><span>아이디</span> 나 <span>비밀번호</span>를 확인해주세요</p>';
        errMsg.style.display = 'block';
      });
  });
  