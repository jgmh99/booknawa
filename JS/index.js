document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    function searchBooks() {
        let query = searchInput.value.trim();
        if (!query) return;
        // 사용자 입력을 큰따옴표로 묶어 정확한 구문 검색을 유도
        query = `"${query}"`;
        window.location.href = `search.html?search=${encodeURIComponent(query)}`;
    }

    // 엔터 키 이벤트 리스너 추가
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchBooks();
        }
    });

    // 검색 버튼에도 searchBooks 함수를 연결합니다.
    searchButton.onclick = searchBooks;

    // 책 요소에 클릭 이벤트 리스너 추가하기
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
    // -------------------------
    // 책 정보를 동적으로 생성하고, 각 책에 고유 ID를 설정하는 부분에 data-book-id 속성 추가
function fetchSuggestRandomBooks() {
    const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
    const randomQuery = 'novel'; // 예시 쿼리, 필요에 따라 변경 가능
    fetch(`${apiUrl}${encodeURIComponent(randomQuery)}&maxResults=10`)
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
                        <p class="book_cate">${bookInfo.categories}</p>
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

    
    /** --------------------추천 책 캐러셀 JS-------------------- */
    let currentIndex = 0; // 현재 인덱스 초기화

    function showNextBook() {
    const books = document.querySelectorAll('#sec_today_sug > div');
    if (currentIndex < books.length - 3) { // 마지막에서 4번째 요소까지만 이동 가능
        currentIndex++;
        updateCarousel();
    }
    }

    function showPrevBook() {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
    }

    function updateCarousel() {
    const container = document.getElementById('sec_today_sug');
    container.style.transform = `translateX(-${currentIndex * 25}%)`; // 25%씩 이동
    }

    document.getElementById('prevButton').addEventListener('click', showPrevBook);
    document.getElementById('nextButton').addEventListener('click', showNextBook);
    
});