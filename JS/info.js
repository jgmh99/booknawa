import config from "../config/config.js";
document.addEventListener('DOMContentLoaded', function() {
    // const API_KEY = config.API_KEY
    // URL에서 책의 ID 값을 추출하는 함수
    function getBookIdFromUrl() {
        const queryParams = new URLSearchParams(window.location.search);
        return queryParams.get('id');
    }

    // 책의 상세 정보를 가져와서 페이지에 표시하는 함수
    function displayBookInfo(bookId) {
        // const apiKey = "AIzaSyBQHuGBIi0jR-oH7Yf9KgPSRUcqcULbkHg"
        // const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;

        const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
        // AIzaSyBQHuGBIi0jR-oH7Yf9KgPSRUcqcULbkHg 추후 키 연결

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const bookInfo = data;
                const bookPreviewLink = data.volumeInfo.previewLink;
                let countbook = 1;

                // 책의 상세 정보를 표시할 HTML 구성
                const bookDetailsHtml = `
                    <div id="book_title_sec">
                        <p>${bookInfo.volumeInfo.title}</p>
                        <div class="book_title_sec_bottom">
                            <span>${bookInfo.volumeInfo.authors ? bookInfo.volumeInfo.authors.join(', ') : '저자 정보 없음'}</span>
                            <span> · </span>
                            <span>${bookInfo.volumeInfo.publisher}</span>
                            <span> · </span>
                            <span>${bookInfo.volumeInfo.publishedDate}</span>
                        </div>
                    </div>
                    
                    <hr>

                    <div id="book_info_sec">
                        <div id="book_cover_img_sec">
                            <img src="${bookInfo.volumeInfo.imageLinks ? bookInfo.volumeInfo.imageLinks.thumbnail : '../IMG/Not_FOR_SALE.png'}" alt="${bookInfo.volumeInfo.title}" loading="lazy">

                            <!-- <button id="preview_btn">미리보기</button> -->
                            <a href="${bookPreviewLink}" target="blank">미리보기</a>
                        </div>
                        ${bookInfo.saleInfo.saleability === 'FOR_SALE' ? `
                            <div class="forsale">

                                <div id="forsale_info_sec">
                                    <p><span>타입 : </span> <span>${bookInfo.volumeInfo.printType ? 'BOOK' : '종이책'}</span></p>
                                    <p><span>정가 : </span> <span>${bookInfo.saleInfo.listPrice.amount.toLocaleString()}원</span></p>
                                    <p><span>판매가 : </span> <span class="retail_price">${bookInfo.saleInfo.retailPrice.amount.toLocaleString()}원</span></p>
                                    <p><span>배송료 : </span> 무료</p>
                                    <p><span>전자책 : </span> <span class="ebook_tf">${bookInfo.saleInfo.isEbook ? '○' : '✕'}</span></p>
                                    

                                    <div id="calc_price">
                                        <span id="total_count_txt"> 수량 : </span><span id='total_count'>${countbook}</span>
                                        <button id="plus_btn">+</button>
                                        <button id="minus_btn">-</button>
                                    </div>
                                    
                                    <div id="total_price">
                                        <span>총 가격 : </span><span id="price_value"></span>
                                    </div>
                                </div>
                                
                                <div id="purchase_sec">
                                    <button>장바구니</button>
                                    <button>바로구매</button>
                                    <button>선물하기</button>
                                    <button>보관함 +</button>
                                </div>

                            </div>` : ''
                        }
                    </div>
                    <hr>
                    <div id="book_basicInfo">
                        <div class="book_left">
                            <p>기본정보</p>
                        </div>
                        <div class="book_right">
                            <div class="book_right_p_sec flex_box">
                                <div class="first_flex_box">
                                    <div class="lang">
                                        <p>언어</p>
                                        <span>${bookInfo.volumeInfo.language}</span>
                                    </div>
                                    <div class="page">
                                        <p>페이지 수</p> 
                                        <span>${bookInfo.volumeInfo.pageCount}</span>
                                    </div>
                                    <div class="isbn">
                                        <p>ISBN</p>
                                        <span>${bookInfo.volumeInfo.industryIdentifiers.map(identifier => identifier.identifier).join(', ')}</span>
                                    </div>
                                    <div class="classification">
                                        <p>주제 분류</p>
                                        <span>${bookInfo.volumeInfo.categories ? bookInfo.volumeInfo.categories : '카테고리 정보 없음'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="book_introduction">
                        <div class="book_left">
                            <p>책 소개</p>
                        </div>
                        <div class="book_right">
                            <div class="book_right_p_sec">
                                <p>${bookInfo.volumeInfo.description ? bookInfo.volumeInfo.description : '설명 없음'}</p>
                            </div>
                        </div>
                        
                    </div>
                `;
                // 페이지에 책의 상세 정보를 표시
                document.getElementById('results').innerHTML = bookDetailsHtml;

                const total_count = document.getElementById('total_count');
                const total_price = document.getElementById('price_value'); // 총 가격을 표시할 요소
                const plus_btn = document.getElementById('plus_btn');
                const minus_btn = document.getElementById('minus_btn');
                const unitPrice = bookInfo.saleInfo.retailPrice.amount; // 단가

                // 총 가격을 계산하고 업데이트하는 함수
                function updateTotalPrice() {
                    const totalPrice = unitPrice * countbook;
                    const totalPriceAmount = totalPrice.toLocaleString();
                    total_price.textContent = `${totalPriceAmount}원`; // 총 가격 업데이트
                }

                // 초기 총 가격 설정
                updateTotalPrice();

                // "plus_btn" 버튼에 클릭 이벤트 리스너를 추가합니다.
                plus_btn.addEventListener('click', () => {
                    countbook += 1;
                    total_count.textContent = countbook;
                    updateTotalPrice(); // 총 가격 업데이트
                });

                // "minus_btn" 버튼에 클릭 이벤트 리스너를 추가합니다.
                minus_btn.addEventListener('click', () => {
                    if (countbook > 1) {
                        countbook -= 1;
                        total_count.textContent = countbook;
                        updateTotalPrice(); // 총 가격 업데이트
                    }
                });
                
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