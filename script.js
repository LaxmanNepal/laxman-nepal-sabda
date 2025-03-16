let currentQuoteIndex = 0;
let quotes = [];
let autoNextQuote;
const quoteTextElement = document.querySelector('.quote-text');
const quoteAuthorElement = document.querySelector('.quote-author');

function showQuote() {
    if (quotes.length === 0) return;
    const quote = quotes[currentQuoteIndex];
    if (quote && quote.quote && quote.author) {
        quoteTextElement.innerText = quote.quote;
        quoteAuthorElement.innerText = quote.author;
    }
}

function nextQuote() {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    showQuote();
}

function prevQuote() {
    currentQuoteIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
    showQuote();
}

function startAutoNextQuote() {
    autoNextQuote = setInterval(nextQuote, 8000);
}

function stopAutoNextQuote() {
    clearInterval(autoNextQuote);
}

function copyQuote() {
    const quote = quotes[currentQuoteIndex];
    const textToCopy = `"${quote.quote}" - ${quote.author}`;
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert('Quote copied to clipboard!');
        })
        .catch(error => console.error('Error copying quote:', error));
}

function downloadQuoteAsPNG() {
    const quoteContent = document.querySelector('.quote-content');

    function loadFonts() {
        return Promise.all([
            document.fonts.load('20px "Noto Sans Devanagari"'),
            document.fonts.load('20px "Noto Sans"')
        ]);
    }

    loadFonts().then(() => {
        document.fonts.ready.then(() => {
            html2canvas(quoteContent, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                logging: true
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'quote.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(error => console.error('Error generating canvas:', error));
        }).catch(error => console.error('Error with document.fonts.ready:', error));
    }).catch(error => console.error('Error loading fonts:', error));
}

function enterFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
}

document.querySelector('.next-quote').addEventListener('click', () => {
    nextQuote();
    stopAutoNextQuote();
});

document.querySelector('.prev-quote').addEventListener('click', () => {
    prevQuote();
    stopAutoNextQuote();
});

document.querySelector('.stop-quote').addEventListener('click', stopAutoNextQuote);
document.querySelector('.copy-quote').addEventListener('click', copyQuote);
document.querySelector('.download-quote').addEventListener('click', downloadQuoteAsPNG);
document.querySelector('.fullscreen-quote').addEventListener('click', enterFullscreen);

fetch('quotes.json')
    .then(response => response.json())
    .then(data => {
        quotes = data;
        currentQuoteIndex = Math.floor(Math.random() * quotes.length);
        showQuote();
        startAutoNextQuote();
    })
    .catch(error => console.error('Error fetching quotes:', error));


        

        const renderGreeting = () => {
            var prefix = "शुभ";
            var translations = {
                morning: "प्रभात",
                noon: "मध्यान्ह",
                evening: "सन्ध्या",
                night: "रात्री",
            };
            let trans;
            let hourNow = new Date().getHours();
            if (hourNow >= 1 && hourNow <= 12) trans = translations.morning;
            else if (hourNow > 12 && hourNow <= 16) trans = translations.noon;
            else if (hourNow > 16 && hourNow <= 19) trans = translations.evening;
            else if (hourNow > 19 && hourNow <= 24) trans = translations.night;

            document.getElementById("greeting").innerHTML = prefix + " " + trans;
        }

        renderGreeting();

       

        function convertEnglishDateToNepali(yy, mm, dd) {
            const bsDate = NepaliDateConverter.ConvertToNepali(yy, mm, dd);
            return [
                `${bsDate.year}-${bsDate.month}-${bsDate.day}`, // Nepali Date
                `${yy}-${mm}-${dd}` // English Date for reference
            ];
        }
        
        function updateNepaliDate() {
            const today = new Date();
            const nepaliDate = convertEnglishDateToNepali(today.getFullYear(), today.getMonth() + 1, today.getDate());
            document.getElementById('nepali-date').innerText = convertToNepaliCharacters(nepaliDate[0]); // Display Nepali Date
        }
        
        function convertToNepaliCharacters(dateString) {
            const englishToNepaliMap = {
                '0': '०',
                '1': '१',
                '2': '२',
                '3': '३',
                '4': '४',
                '5': '५',
                '6': '६',
                '7': '७',
                '8': '८',
                '9': '९'
            };
            return dateString.replace(/\d/g, digit => englishToNepaliMap[digit]);
        }
        function formatNepaliDate(nepaliDate) {
            const nepaliMonths = [
                'बैशाख', 'जेष्ठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत्र'
            ];
            const nepaliDays = [
                'आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'
            ];
        
            const nepaliYear = convertToNepaliCharacters(nepaliDate.year.toString());
            const nepaliMonth = nepaliMonths[nepaliDate.month - 1];
            const nepaliDay = convertToNepaliCharacters(nepaliDate.day.toString());
            const nepaliDayOfWeek = nepaliDays[nepaliDate.dayOfWeek];
        
            return `${nepaliDayOfWeek}, ${nepaliMonth} ${nepaliDay}, ${nepaliYear}`;
        }
        
        // Update date on page load
        window.onload = updateNepaliDate;

        function updateClock() {
            moment.locale('ne');
            var now = moment().tz("Asia/Kathmandu");
            
            var nhour = now.format('hh');
            var nmin = now.format('mm');
            var nsec = now.format('ss');
            var nampm = now.format('A');
            
            // Use template literals for cleaner HTML string construction
            var clockHTML = `
                <span id='nhour'>${nhour}</span>
                <span class='nmin'>:</span>
                <span id='min'>${nmin}</span>
                <span class='nsec'>:</span>
                <span id='sec'>${nsec}</span>
                <span id='nampm'> ${nampm}</span>
            `;
            
            document.getElementById('clock').innerHTML = clockHTML;
        }
        
        // Update clock every second
        setInterval(updateClock, 1000);
        
        // Initial call to display clock immediately
        updateClock();
        