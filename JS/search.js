import config from "../config/config.js";
const { API_KEY } = config;

console.log(API_KEY);



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
            //alert 으로 변경할것!!!!!!!!!!!!!!!!!!!!!
            resultsDiv.innerHTML = '검색어가 제공되지 않았습니다.';
            return;
        }

        // const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${currentIndex}&orderBy=newest&&maxResults=10`;
        
        //const apiUrl =  `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${API_KEY}&Query=파이썬&QueryType=Title&MaxResults=10&start=1&SearchTarget=Book`;
        const apiUrl = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=ttbjegal123421914001&Query=파이썬&QueryType=Title&MaxResults=10&start=1&SearchTarget=Book&output=js`

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
            //const bookslistprice = item.saleInfo.listPrice; 
            // .amount뒤에 .toLocaleString()붙이면 할인률 계산할때 NaN나오기 떄문에 return하는 곳에서 ${booksretailprice.toLocaleString()}이런식으로 수정하였음
            const bookslistprice = item.saleInfo.listPrice ? item.saleInfo.listPrice.amount : '가격 정보 없음'; //원래 가격
            const booksretailprice = item.saleInfo.retailPrice ? item.saleInfo.retailPrice.amount : '가격 정보 없음'; //할인 가격
            console.log(bookInfo + ':' + bookslistprice);

            // 판매중 판매 안하는지 판별하는 용도
            const saleinfo = item.saleInfo.saleability;
            //const displayStyle = saleinfo === 'FOR_SALE' ? 'block' : 'none';
            const displayStyle = saleinfo === 'FOR_SALE' && bookslistprice !== 0 ? 'block' : 'none';
            console.log('판매중임? :' + saleinfo);

            // 할인율 계산 함수 호출
            const discountText = calculateDiscountPercentage(bookslistprice, booksretailprice);

            return `<div id="book">
                        <div id="book_thumbnail">
                            <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : '../IMG/Not_FOR_SALE.png'}" alt="${bookInfo.title}">
                            <div id="book_thumbnail_btn">
                                <span id="blankTab_btn">
                                    <a href="info.html?id=${bookId}" target="blank"><p style="color: gray;">새창보기</p></a>
                                </span>
                                <span id="previewTab_btn">
                                    <a href="${bookInfo.previewLink}" target="blank"><p style="color: gray;">미리보기</p></a>
                                </span>
                            </div>
                        </div>
                        
                        <div id="book_thumbnail_info">
                            <div id="book_thumbnail_info_title">
                                <p>
                                    <a href="info.html?id=${bookId}"><p>${bookInfo.title}</p></a>
                                </p>
                            </div>

                            <div id="book_thumbnail_info_author">
                                <span>${bookInfo.authors ? bookInfo.authors.join(', ') : '저자 정보 없음'}</span> · <span>${bookInfo.publisher}</span> · <span>${bookInfo.publishedDate ? bookInfo.publishedDate : '정보 없음'}</span> · <span> P.${bookInfo.pageCount} </span>
                            </div>
                            <div id="book_thumbnail_info_cate">
                                <p>${bookInfo.categories}</p>
                            </div>
                            <div id="book_thumbnail_info_price" class="thumbnail_price" style="display: ${displayStyle};">
                                <p>${discountText}</p><b>${booksretailprice.toLocaleString()}원</b><p>${bookslistprice.toLocaleString()}원</p>
                            </div>

                            <div id="desc">
                                <p>${bookInfo.description}</p>
                            </div>
                            
                            <!-- <h6>${bookId}</h6> -->

                            <div id="goto_view">
                                <a href="info.html?id=${bookId}">책 보러가기</a>
                            </div>
                        </div>
                    </div>`;
        }).join('');

        resultsDiv.innerHTML = books;

        //할인율 계산 함수
        function calculateDiscountPercentage(listPrice, retailPrice) {
            if (listPrice === '가격 정보 없음' || retailPrice === '가격 정보 없음') {
                return '할인 정보 없음';
            }
        
            const discountAmount = listPrice - retailPrice;
            const discountPercentage = Math.round((discountAmount / listPrice) * 100);
        
            return `${discountPercentage}%`;
        }
    }
    /**페이지 네이션 구현 하ㅏ */
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
                pageButton.style.backgroundColor = 'lightgray';
                pageButton.style.color = 'white';
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

