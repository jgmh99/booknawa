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
    
    // -------------------------
    // 책 정보를 동적으로 생성하고, 각 책에 고유 ID를 설정하는 부분에 data-book-id 속성 추가
    function fetchSuggestRandomBooks() {
        // 책 요소에 클릭 이벤트 리스너 추가하기
        /**
        function addClickEventToBooks() {
            const booksContainer = document.getElementById('sec_today_sug');
            booksContainer.addEventListener('click', function(event) {
                // 클릭된 요소에서 가장 가까운 suggestBook div를 찾음
                const clickedBook = event.target.closest('#suggestBook');
                if (clickedBook) {
                    // data-book-id 속성을 사용하여 책의 ID를 가져옴
                    const bookId = clickedBook.dataset.bookId;
                    // 책의 ID를 사용하여 info.html 페이지로 이동, 쿼리 파라미터로 bookId를 전달
                    window.location.href = `info.html?id=${bookId}`;
                }
            });
        }
        쿠키 생성 한걸로 최근 본 상품에 저장 할려고 아래 코드로 수정 하였음
        */
        
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
        function displayRecentViewedBooks() {
            const recentBookIds = getRecentBookIdsFromCookie();
            const recentViewContainer = document.getElementById('recent_view');
            // recentViewContainer.innerHTML = '최근 본 상품: ';
            recentBookIds.forEach((bookId, index) => {
                if (index > 0) {
                    recentViewContainer.innerHTML += ', ';
                }
                recentViewContainer.innerHTML += bookId;
            });
        }
        
        // 페이지 로드 시 최근 본 책 ID 목록 표시
        window.onload = function() {
            displayRecentViewedBooks();
        }
        /** 쿠키에 최근 본 책 10개 저장하는 코드 section 끝 */

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
        function displayRecentViewedBooks() {
            const recentBookIds = getRecentBookIdsFromCookie();
            const recentViewContainer = document.getElementById('recent_view');
            console.log('쿠키에 저장된 책 목록 bookid: ' + recentBookIds);
        
            // 초기 텍스트 설정
            // recentViewContainer.innerHTML = '최근 본 상품: ';
            
            recentBookIds.forEach((bookId) => {
                // const apiKey = "AIzaSyBQHuGBIi0jR-oH7Yf9KgPSRUcqcULbkHg"
                // const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;
                const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        // const bookTitle = data.volumeInfo.title; // 책 제목
                        // const bookImage = data.volumeInfo.imageLinks.thumbnail; // 책 이미지 URL
                        const bookInfo = data.volumeInfo
        
                        // 책 이미지와 제목을 상하로 나누어 표시하기 위한 div 요소 생성
                        const bookDiv = document.createElement('div');
                        bookDiv.id = 'recent_book';
                        bookDiv.innerHTML = `
                            <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.smallThumbnail : '../IMG/Not_FOR_SALE.png'}" alt="${bookInfo.title}">
                            
                            <p>${bookInfo.title}</p>
                        `;
                        /** 클릭시 info.html로 bookid 보내서 정보 출력하기 */
                        // 첫 번째 책이 아닌 경우, 구분자 추가
                        // if (index > 0) {
                        //     const separator = document.createElement('hr');
                        //     recentViewContainer.appendChild(separator);
                        // }
        
                        // 생성한 div 요소를 recentViewContainer에 추가
                        recentViewContainer.appendChild(bookDiv);
                    })
                    .catch(error => console.error('Error:', error));
            });
        
        }
        // 페이지 로드 시 최근 본 책 ID 목록 표시
        window.onload = function() {
            displayRecentViewedBooks();
        }
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
    
    
    /** -------------------- 책 캐러셀 JS-------------------- */
    // let currentIndex = {
    //     'sec_today_sug': 0,
    //     'sec_pub_rec': 0
    //     // 추가하고 싶은 sec_이름 추가하면 됨
    // };
    
    // function updateCarousel(containerId) {
    //     const container = document.getElementById(containerId);
    //     const index = currentIndex[containerId];
    //     container.style.transform = `translateX(-${index * 25}%)`; // 25%씩 이동
    // }
    
    // function showNextBook(containerId) {
    //     const books = document.querySelectorAll(`#${containerId} > div`);
        
    //     if (currentIndex[containerId] < books.length - 3) { // 마지막에서 3번째 요소까지만 이동 가능
    //         currentIndex[containerId]++;
    //         updateCarousel(containerId);
    //     }
    // }
    
    // function showPrevBook(containerId) {
    //     if (currentIndex[containerId] > 0) {
    //         currentIndex[containerId]--;
    //         updateCarousel(containerId);
    //     }
    // }
    
    // document.querySelectorAll('#prevButton').forEach(button => {
    //     button.addEventListener('click', () => showPrevBook(button.dataset.carousel));
    // });
    
    // document.querySelectorAll('#nextButton').forEach(button => {
    //     button.addEventListener('click', () => showNextBook(button.dataset.carousel));
    // });
    
});