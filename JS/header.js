import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
document.addEventListener('DOMContentLoaded', (event) => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        // 사용자 이메일이 존재하면 헤더에 표시
        const welcomeText = document.querySelector('header nav ul li:first-child');
        welcomeText.textContent = `${userEmail}님 환영합니다.`;
    
        // 로그아웃 버튼을 위한 HTML 문자열 생성
        const logoutButtonHTML = `<button id="logoutButton">로그아웃</button>`;
    
        // 로그아웃 버튼이 들어갈 위치를 찾고, innerHTML을 사용해 버튼을 추가
        const logoutButtonContainer = document.querySelector('header nav ul li:nth-child(2)');
        logoutButtonContainer.innerHTML = logoutButtonHTML;
    
    }
    
    // Firebase Auth 인스턴스 가져오기
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

    document.getElementById('logoutButton').addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                // 로그아웃 성공 시 처리
                console.log('로그아웃 성공');
                localStorage.removeItem('userEmail'); // localStorage에서 사용자 이메일 제거
                window.location.href = 'index.html'; // 로그인 페이지로 리다이렉트
            })
            .catch((error) => {
                // 로그아웃 실패 시 처리
                console.error('로그아웃 실패', error);
            });
    });

});