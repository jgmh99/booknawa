document.addEventListener('DOMContentLoaded', function() {
    // URL에서 책의 ID 값을 추출하는 함수
    function getBookIdFromUrl() {
        const queryParams = new URLSearchParams(window.location.search);
        return queryParams.get('id');
    }

    // 책의 상세 정보를 가져와서 페이지에 표시하는 함수
    function displayBookInfo(bookId) {
        const apiKey = "AIzaSyBQHuGBIi0jR-oH7Yf9KgPSRUcqcULbkHg"
        const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;

        // const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const bookInfo = data;
                
                // 책의 상세 정보를 표시할 HTML 구성
                const bookDetailsHtml = `
                    <h1>제목 : ${bookInfo.volumeInfo.title}</h1>
                    <p>저자 : ${bookInfo.volumeInfo.authors ? bookInfo.volumeInfo.authors.join(', ') : '저자 정보 없음'}</p>
                    <p>발매일 : ${bookInfo.volumeInfo.publishedDate}</p>
                    <p>설명 : ${bookInfo.volumeInfo.description ? bookInfo.volumeInfo.description : '설명 없음'}</p>
                    <p>페이지 수 : ${bookInfo.volumeInfo.pageCount}</p>
                    <p>ISBN : ${bookInfo.volumeInfo.industryIdentifiers.map(identifier => identifier.identifier).join(', ')}</p>
                    <p>카테고리 : ${bookInfo.volumeInfo.categories ? bookInfo.volumeInfo.categories.join(', ') : '카테고리 정보 없음'}</p>
                    <p>언어 : ${bookInfo.volumeInfo.language}</p>
                    <p>출판사 : ${bookInfo.volumeInfo.publisher}</p>

                    ${bookInfo.saleInfo.saleability === 'FOR_SALE' ? `
                        <p>타입 : ${bookInfo.saleInfo.isEbook ? 'E-Book' : 'E-Book 미지원'}</p>
                        <p>가격 : ${bookInfo.saleInfo.listPrice.amount}원</p>
                        <p>할인 가격 : ${bookInfo.saleInfo.retailPrice.amount}원</p>
                        ` : ''}
                        <img src="${bookInfo.volumeInfo.imageLinks ? bookInfo.volumeInfo.imageLinks.thumbnail : '../IMG/Not_FOR_SALE.png'}" alt="${bookInfo.volumeInfo.title}" loading="lazy">
                `;

                // 페이지에 책의 상세 정보를 표시
                document.getElementById('results').innerHTML = bookDetailsHtml;
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('results').innerHTML = '책 정보를 가져오는 중 오류가 발생했습니다.';
            });
    }

    const bookId = getBookIdFromUrl();
    if(bookId) {
        displayBookInfo(bookId);
    } else {
        document.getElementById('results').innerHTML = '유효한 책 ID가 URL에 없습니다.';
    }
});
