let currentIndex = {
    'sec_today_sug': 0,
    'sec_pub_rec': 0
    // 추가하고 싶은 sec_이름 추가하면 됨
};

function updateCarousel(containerId) {
    const container = document.getElementById(containerId);
    const index = currentIndex[containerId];
    container.style.transform = `translateX(-${index * 25}%)`; // 25%씩 이동
}

function showNextBook(containerId) {
    const books = document.querySelectorAll(`#${containerId} > div`);
    
    if (currentIndex[containerId] < books.length - 3) { // 마지막에서 3번째 요소까지만 이동 가능
        currentIndex[containerId]++;
        updateCarousel(containerId);
    }
}

function showPrevBook(containerId) {
    if (currentIndex[containerId] > 0) {
        currentIndex[containerId]--;
        updateCarousel(containerId);
    }
}

document.querySelectorAll('#prevButton').forEach(button => {
    button.addEventListener('click', () => showPrevBook(button.dataset.carousel));
});

document.querySelectorAll('#nextButton').forEach(button => {
    button.addEventListener('click', () => showNextBook(button.dataset.carousel));
});