// Mengambil elemen tombol hamburger dan navbar links
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navbarLinks = document.getElementById('navbarLinks');

// Fungsi untuk toggle tampilan navbar
hamburgerBtn.addEventListener('click', () => {
    navbarLinks.classList.toggle('show');
});


// Motivasi

const quotes = [
    "Kegagalan adalah awal dari kesuksesan.",
    "Tetaplah berusaha meskipun sulit.",
    "Kamu lebih kuat dari yang kamu kira.",
    "Jangan takut gagal, takutlah untuk tidak mencoba.",
    "Hari ini sulit, besok akan lebih baik."
];

let currentIndex = 0;
const quoteElement = document.querySelector(".quote-text");

// Fungsi untuk update kutipan dengan animasi
function updateQuote(index) {
    quoteElement.classList.remove("active"); // Hilangkan teks lama dengan animasi keluar

    setTimeout(() => {
        quoteElement.textContent = quotes[index]; // Ganti teks baru
        quoteElement.classList.add("active"); // Tambahkan animasi masuk
    }, 500); // Tunggu 500ms supaya transisi lebih halus
}

// Fungsi untuk geser otomatis setiap 10 detik
function startAutoSlide() {
    return setInterval(() => {
        currentIndex = (currentIndex + 1) % quotes.length;
        updateQuote(currentIndex);
    }, 10000);
}

// Event Listener tombol kiri
document.querySelector(".fa-chevron-left").addEventListener("click", function() {
    currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    updateQuote(currentIndex);
    resetAutoSlide();
});

// Event Listener tombol kanan
document.querySelector(".fa-chevron-right").addEventListener("click", function() {
    currentIndex = (currentIndex + 1) % quotes.length;
    updateQuote(currentIndex);
    resetAutoSlide();
});

// Reset auto slide saat user klik tombol manual
function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = startAutoSlide();
}

// Set quote pertama kali
updateQuote(currentIndex);

// Mulai auto slide
let autoSlide = startAutoSlide();
