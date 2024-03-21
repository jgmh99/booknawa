document.addEventListener('DOMContentLoaded', function() {
    const resultsDiv = document.getElementById('results');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const pagesSpan = document.getElementById('pages');
    
    let currentIndex = 0;
    let totalItems = 0;

    function getSearchQuery() {
        const params = new URLSearchParams(window.location.search);
        return params.get('search');
    }

    function searchBooks() {
        const query = getSearchQuery();
        if (!query) {
            resultsDiv.innerHTML = '검색어가 제공되지 않았습니다.';
            return;
        }

        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${currentIndex}&maxResults=10`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                totalItems = data.totalItems;
                displayResults(data);
                updatePagination();
            })
            .catch(error => {
                console.error('Error:', error);
                resultsDiv.innerHTML = '검색 중 오류가 발생했습니다.';
            });
    }

    function displayResults(data) {
        if (data.totalItems === 0) {
            resultsDiv.innerHTML = '검색 결과가 없습니다.';
            return;
        }

        const books = data.items.map(item => {
            const bookInfo = item.volumeInfo;
            const bookId = item.id;
            return `<a href="info.html?id=${bookId}">
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

    function updatePagination() {
        pagesSpan.innerHTML = '';
        const totalPages = Math.ceil(totalItems / 10);
        const currentPage = Math.floor(currentIndex / 10) + 1;

        let startPage = Math.max(1, currentPage - 4);
        let endPage = Math.min(totalPages, currentPage + 5);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('a');
            pageButton.innerText = i;
            pageButton.onclick = function() {
                currentIndex = (i - 1) * 10;
                searchBooks();
            };
            if (i === currentPage) {
                pageButton.style.fontWeight = 'bold';
            }
            pagesSpan.appendChild(pageButton);
        }

        prevButton.style.display = currentPage > 1 ? 'inline' : 'none';
        nextButton.style.display = currentPage < totalPages ? 'inline' : 'none';

        prevButton.onclick = function() {
            if (currentIndex >= 10) {
                currentIndex -= 10;
                searchBooks();
            }
        };

        nextButton.onclick = function() {
            if (currentIndex + 10 < totalItems) {
                currentIndex += 10;
                searchBooks();
            }
        };
    }

    searchBooks();
});
