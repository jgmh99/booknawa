검색시 api
https://www.googleapis.com/books/v1/volumes?q={검색어}

책 누르면 상세정보 띄우는 api
https://www.googleapis.com/books/v1/volumes/{id값} <!--id값 예시 : _0JqDwAAQBAJ--># booknawa

-주색-
borderColor : #ebebeb

-font-

font-family: "Dongle", sans-serif;
font-weight: 900;
font-style: normal;

font-family: "Song Myung", serif;
font-weight: 400;
font-style: normal;

-------
2024.03.24
google books api 관리를 위해서 npm install dotenv 라이브러리 설치
github .env 올라가는거 방지 위해서 .gitignore 에 .env추가


--------------------------
api키를 추가해야지 정확한 카테고리가 나옴
예시 : https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=AIzaSyBQHuGBIi0jR-oH7Yf9KgPSRUcqcULbkHg


장르별 검색 : https://www.googleapis.com/books/v1/volumes?q=subject:${장르}
-종류-
intitle: 제목에 이 키워드 다음에 오는 텍스트가 있는 결과를 반환합니다.
inauthor: 이 키워드 뒤에 오는 텍스트가 작성자에 있는 결과를 반환합니다.
inpublisher: 이 키워드 다음에 오는 텍스트가 게시자에 있는 경우의 결과를 반환합니다.
subject:: 이 키워드 다음에 오는 텍스트가 볼륨의 카테고리 목록에 나열된 결과를 반환합니다.
isbn:: 이 키워드 다음에 오는 텍스트가 ISBN 숫자인 결과를 반환합니다.
lccn: 이 키워드 다음에 오는 텍스트가 미국 의회 도서관 제어 번호인 결과를 반환합니다.
oclc:: 이 키워드 뒤에 있는 텍스트가 온라인 컴퓨터 라이브러리 센터 번호인 결과를 반환합니다.

--------------------------
3/31 최근 본 책 최대 10개 까지 쿠키에 저장
4/02 검색페이지 api수정
4/05 info.html ui 제작
4/06 google api -> 알라딘 api로 교체 시작
4/07 알라딘 api로 교체중 cors만남
    -> https://cors-anywhere.herokuapp.com/{api주소}
        ->저 친구가 알아서 중간에 HTTP응답 헤더에 Acccess-Control-Allow-Origin 세팅해준다고 하여 사용₩

4/20 글 100자평 작성 기능 만들어보기
