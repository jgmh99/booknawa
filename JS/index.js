// import { detailCategory } from './commonJs/detailCategory.mjs';
document.addEventListener('DOMContentLoaded', function() {
    const detailCategory = [
            "Adventure Fiction",
            "Allegorical Novel",
            "American Classics",
            "Biography & Autobiography",
            "Children's Novel",
            "Comics & Graphic Novels v Crime Novel",
            "Dystopian Fiction",
            "Essay",
            "Fantasy Fiction",
            "Fantasy Romance",
            "Gothic Fiction",
            "High Fantasy",
            "Historical Fiction",
            "Juvenile Fiction",
            "Magic Realism",
            "Manga",
            "Mystery",
            "Novel",
            "Political Fiction",
            "Romance",
            "Romance Novel",
            "Romantic Tragedy",
            "Satire",
            "Science Fiction",
    ];
    
    /** 쿠키생성하고 저장하는 wwwwww */
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    
    function addRecentBookIdToCookie(bookId) {
        let recentBookIds = getRecentBookIdsFromCookie();
        
        // 최대 6개까지 유지
        if (recentBookIds.length >= 6) {
            recentBookIds.pop(); // 가장 오래된 항목 제거
        }
        recentBookIds.unshift(bookId); // 새로운 항목을 배열 맨 앞에 추가
        setCookie('recentBookIds', JSON.stringify(recentBookIds), 7); // 7일 동안 유효
    }
    function getRecentBookIdsFromCookie() {
        const recentBookIdsCookie = getCookie('recentBookIds');
        if (recentBookIdsCookie) {
            return JSON.parse(recentBookIdsCookie);
        } else {
            return [];
        }
    }
    function displayRecentViewedBooks() {
        const recentBookIds = getRecentBookIdsFromCookie();
        const recentViewContainer = document.getElementById('recent_view');
        console.log('쿠키에 저장된 책 목록 bookid: ' + recentBookIds);
    
        // 책 ID 배열이 비어있는지 확인
        if (!recentBookIds || recentBookIds.length === 0) {
            // 최근에 본 책이 없다는 메시지 표시
            recentViewContainer.innerHTML = `
                <div class="notRecrntViewBook">
                    <p>최근에 보신 상품이 없어요!</p>
                    <p>찾고계신 책을 찾으러 가볼까요??</p>
                </div>
            `;
            return; // 함수 종료
        }
    
        recentBookIds.forEach((bookId) => {
            const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    const bookInfo = data.volumeInfo;
    
                    // 책 이미지와 제목, 'X' 버튼을 포함하는 div 요소 생성
                    const bookDiv = document.createElement('div');
                    bookDiv.id = 'recent_book'; // id 대신 className 사용
                    bookDiv.innerHTML = `
                        <a href="info.html?id=${bookId}" target="blank">
                            <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.smallThumbnail : '../IMG/Not_FOR_SALE.png'}" alt="${bookInfo.title}">
                            <p>${bookInfo.title}</p>
                        </a>
                        <button class="deleteBookBtn" data-bookid="${bookId}"> ✖️</button> 
                    `;
    
                    // 생성한 div 요소를 recentViewContainer에 추가
                    recentViewContainer.appendChild(bookDiv);
                })
                .catch(error => console.error('Error:', error));
        });
    }
    displayRecentViewedBooks();
    
    // 쿠키에서 특정 책의 ID를 삭제하는 함수
    function deleteBookFromCookie(bookId) {
        let recentBookIds = getRecentBookIdsFromCookie();
        recentBookIds = recentBookIds.filter(id => id !== bookId);
        setCookie('recentBookIds', JSON.stringify(recentBookIds), 7); // 변경된 배열로 쿠키 업데이트
    }
    
    // 'X' 버튼 클릭 이벤트 처리
    document.addEventListener('click', function(event) {
        if (event.target.className === 'deleteBookBtn') {
            const bookId = event.target.getAttribute('data-bookid');
            // confirm 대화 상자를 통한 삭제 확인
            const isConfirmed = confirm('선택한 상품을 삭제하시겠습니까?');
            if (isConfirmed) {
                deleteBookFromCookie(bookId);
                alert('선택한 상품이 삭제 되었어요!');
                location.reload(); // 페이지 새로고침
            }
        }
    });
    
    
    /** 쿠키생성하고 저장해서 최근봉 상품에 출력하는 wwww */

    // 쿠키 전체 삭제 기능
    function deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    }

    window.onload = function() {
        const cookieValue = getCookie('recentBookIds');
        console.log('페이지 로드시 쿠키 확인',cookieValue);
        if (cookieValue) {
            document.getElementById('deleteCookieBtn').style.display = 'inline-block'; // 쿠키가 있을 때만 버튼 표시
        }
    };

    document.getElementById('deleteCookieBtn').addEventListener('click', function() {
        const isConfirmed = confirm('정말 삭제 하시겠습니까?');
        if (isConfirmed) {
            deleteCookie('recentBookIds'); // 쿠키 삭제
            alert('최근 본 상품들이 삭제 되었어요!');
            location.reload(); // 페이지 새로고침
        }
    });
    // -------------------------

    // 책 정보를 동적으로 생성하고, 각 책에 고유 ID를 설정하는 부분에 data-book-id 속성 추가
    function fetchSuggestRandomBooks() {
        /** 쿠키에 최근 본 책 10개 저장하는 코드 section 끝*/
        function addClickEventToBooks() {
            const booksContainer = document.getElementById('sec_today_sug');
            booksContainer.addEventListener('click', function(event) {
                const clickedBook = event.target.closest('#suggestBook');
                if (clickedBook) {
                    const bookId = clickedBook.dataset.bookId;
                    window.location.href = `info.html?id=${bookId}`;
                    // 쿠키 배열에 최근 본 상품 ID 저장
                    addRecentBookIdToCookie(bookId);
                }
            });
        }
        // 카테고리 배열에서 랜덤한 요소를 선택하는 함수
        function getRandomElement(arr) {
            const randomIndex = Math.floor(Math.random() * arr.length);
            return arr[randomIndex];
        }
        // 랜덤 카테고리 선택
        const randomCategory = getRandomElement(detailCategory);
        const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=';

        fetch(`${apiUrl}${encodeURIComponent(randomCategory)}&maxResults=10`)
            .then(response => response.json())
            .then(data => {
                const books = data.items;
                const booksContainer = document.getElementById('sec_today_sug');
                //booksContainer.innerHTML = ''; // 기존 내용을 비움.

                books.forEach(book => {
                    const bookInfo = book.volumeInfo;

                    const bookElement = document.createElement('div');
                    bookElement.id = 'suggestBook';
                    bookElement.setAttribute('data-book-id', book.id); // 책의 고유 ID를 data-book-id 속성으로 설정

                    bookElement.innerHTML = `
                        <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.smallThumbnail : '../IMG/Not_FOR_SALE.png'}" alt="${bookInfo.title}">
                        <div id="book_info">
                            <p class="book_cate">${bookInfo.categories ? bookInfo.categories: '분류 미지정'}</p>
                            <p class="book_title">${bookInfo.title}</b>
                            <p class="book_authors">${bookInfo.authors}</p>
                        </div>
                    `;
                    booksContainer.appendChild(bookElement);
                        /*가격출력 할때 type에러 발생
                        <p>가격 : ${bookPrice.listPrice?.amount}원</p>
                        <p>할인 가격 : ${bookPrice.retailPrice?.amount}원</p>
                        옵셔널 체이닝 ? 연산자를 사용하여 객체의 속성에 접근할 때, 
                        해당 객체나 속성이 undefined 또는 null이면 오류를 발생시키지 않고 undefined를 반환시켜서 
                        가격 출력하게 했음
                        */
                    });
                    addClickEventToBooks();
                })
                .catch(error => console.error('Error:', error));
    }
    fetchSuggestRandomBooks(); // 페이지 로드 시 랜덤 책 정보 가져오기 실행


    /** "publishedDate" 날짜 최근 순으로 뽑기 */
    function fetchPublishedDateRecentBooks() {
        const booksContainer = document.getElementById('sec_pub_rec'); // 여기에서 정의
    
        function addClickEventToBooks() {
            // 이제 booksContainer는 접근 가능
            booksContainer.addEventListener('click', function(event) {
                const clickedBook = event.target.closest('#suggestBook');
                if (clickedBook) {
                    const bookId = clickedBook.dataset.bookId;
                    window.location.href = `info.html?id=${bookId}`;
                    addRecentBookIdToCookie(bookId);
                }
            });
        }
        function addRecentBookIdToCookie(bookId) {
            let recentBookIds = getRecentBookIdsFromCookie();
            // 최대 10개까지 유지
            if (recentBookIds.length >= 6) {
                recentBookIds.pop(); // 가장 오래된 항목 제거
            }
            recentBookIds.unshift(bookId); // 새로운 항목을 배열 맨 앞에 추가
            setCookie('recentBookIds', JSON.stringify(recentBookIds), 7); // 7일 동안 유효
        }
        function getRecentBookIdsFromCookie() {
            const recentBookIdsCookie = getCookie('recentBookIds');
            if (recentBookIdsCookie) {
                return JSON.parse(recentBookIdsCookie);
            } else {
                return [];
            }
        }
        // -------------------------------------------------------------------------------------------------------
        function getRandomElement(arr) {
            const randomIndex = Math.floor(Math.random() * arr.length);
            return arr[randomIndex];
        }
    
        const randomCategory = getRandomElement(Object.keys(detailCategory));
        const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
        //const api_key = 'AIzaSyBQHuGBIi0jR-oH7Yf9KgPSRUcqcULbkHg';
        //fetch(`${apiUrl}${encodeURIComponent(randomCategory)}&orderBy=newest&key=${api_key}&maxResults=10`)
        fetch(`${apiUrl}${encodeURIComponent(randomCategory)}&orderBy=newest&&maxResults=10`)
            .then(response => response.json())
            .then(data => {
                const books = data.items;
    
                books.forEach(book => {
                    const bookInfo = book.volumeInfo;
    
                    const bookElement = document.createElement('div');
                    bookElement.id = 'suggestBook';
                    bookElement.setAttribute('data-book-id', book.id);
    
                    bookElement.innerHTML = `
                        <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.smallThumbnail : '../IMG/Not_FOR_SALE.png'}" alt="${bookInfo.title}">
                        <div id="book_info">
                            <p class="book_cate">${bookInfo.categories ? bookInfo.categories : '분류 미지정'}</p>
                            <p class="book_title">${bookInfo.title}</p>
                            <p class="book_authors">${bookInfo.authors}</p>
                        </div>
                    `;
                    booksContainer.appendChild(bookElement);
                });
                addClickEventToBooks();
            })
            .catch(error => console.error('Error:', error));
    }
    fetchPublishedDateRecentBooks();
    
});