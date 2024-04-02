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