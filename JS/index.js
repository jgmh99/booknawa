document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('results');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const pagesSpan = document.getElementById('pages');

    let currentIndex = 0;
    let totalItems = 0;

    searchButton.addEventListener('click', function() {
        currentIndex = 0;
        searchBooks();
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            currentIndex = 0;
            searchBooks();
        }
    });

    prevButton.addEventListener('click', function() {
        if (currentIndex >= 10) {
            currentIndex -= 10;
            searchBooks();
        }
    });

    nextButton.addEventListener('click', function() {
        currentIndex += 10;
        searchBooks();
    });

    
    function searchBooks() {
        let query = searchInput.value.trim();
        if (!query) return; 
        
        // 사용자 입력을 큰따옴표로 묶어 정확한 구문 검색을 유도
        query = `"${query}"`;
    
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${currentIndex}&maxResults=10`;
    
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayResults(data);
                // 나머지 코드는 이전 예제와 동일
            })
            .catch(error => {
                console.error('Error:', error);
                resultsDiv.innerHTML = '검색 중 오류가 발생했습니다.';
            });
    }

    function updatePagination() {
        pagesSpan.innerHTML = ''; // 페이지 번호 초기화
        const totalPages = Math.ceil(totalItems / 10);
        const currentPage = Math.floor(currentIndex / 10) + 1;

        // 시작 페이지 번호와 끝 페이지 번호 계산
        let startPage = Math.max(1, currentPage - 4);
        let endPage = Math.min(totalPages, currentPage + 5);

        // 페이지 번호들을 동적으로 생성
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('a');
            pageButton.innerText = i;
            pageButton.onclick = function() {
                currentIndex = (i - 1) * 10;
                searchBooks();
            };
            if (i === currentPage) {
                pageButton.style.fontWeight = 'bold'; // 현재 페이지 스타일 강조
            }
            pagesSpan.appendChild(pageButton);
        }

        // 이전/다음 버튼의 표시 여부 결정
        prevButton.style.display = currentPage > 1 ? 'inline' : 'none';
        nextButton.style.display = currentPage < totalPages ? 'inline' : 'none';
    }

    function displayResults(data) {
        if (data.totalItems === 0) {
            resultsDiv.innerHTML = '검색 결과가 없습니다.';
            return;
        }
    
        const books = data.items.map(item => {
            const bookInfo = item.volumeInfo;
            const bookId = item.id;
            // 책마다의 상세 페이지로 이동할 수 있는 링크를 생성합니다. 
            // 이 때, 책의 ID 값을 URL 파라미터로 넘겨주도록 설정합니다.
            return `<a href="info.html?id=${bookId}" target="_blank">
                        <div>
                            <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : '../IMG/Not_FOR_SALE.png'}" alt="${bookInfo.title}">
                            <h3>${bookInfo.title}</h3>
                            <p>${bookInfo.authors ? bookInfo.authors.join(', ') : '저자 정보 없음'}</p>
                            <p>${bookInfo.publishedDate}</p>
                            <p>${bookId}</p>
                        </div>
                    </a>`;
        }).join('');
    
        resultsDiv.innerHTML = books;
    }
    
});
