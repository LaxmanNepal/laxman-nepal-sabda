let quotes=[];
let currentQuoteIndex=0;
let autoScrollTimer=null;
let favorites=new Set(JSON.parse(localStorage.getItem('sabda-favorites')||'[]'));
const scroller=document.getElementById('quote-scroller');
const toast=document.getElementById('toast');
const favoriteCount=document.getElementById('favorite-count');
let favoritesMode=false;
let toastTimer;

const nepaliDigits=n=>String(n).replace(/\d/g,d=>'०१२३४५६७८९'[d]);
function showToast(message){clearTimeout(toastTimer);toast.textContent=message;toast.classList.add('show');toastTimer=setTimeout(()=>toast.classList.remove('show'),1500)}
function saveFavorites(){localStorage.setItem('sabda-favorites',JSON.stringify([...favorites]));favoriteCount.textContent=favorites.size}
function quoteKey(q,i){return `${i}:${q.quote}`}
function isFavorite(q,i){return favorites.has(quoteKey(q,i))}
function renderQuotes(){
  scroller.innerHTML='';
  quotes.forEach((q,i)=>{
    const card=document.createElement('article');
    card.className='quote-card'+(i===currentQuoteIndex?' active ':'')+(isFavorite(q,i)?' favorite-card':'');
    card.dataset.index=i;
    card.innerHTML=`<button class="favorite-button ${isFavorite(q,i)?'active':''}" type="button" aria-label="मनपर्ने">♥</button><p class="quote-text"></p><p class="quote-author"></p><span class="copy-badge">डबल क्लिक गरेर कपी गर्नुहोस्</span>`;
    card.querySelector('.quote-text').textContent=q.quote||'';
    card.querySelector('.quote-author').textContent=q.author||'- लक्ष्मण नेपाल';
    card.querySelector('.favorite-button').addEventListener('click',e=>{e.stopPropagation();toggleFavorite(i)});
    card.addEventListener('dblclick',()=>copyQuote(i));
    scroller.appendChild(card);
  });
  observeCards();
  updateFavoriteCount();
  scrollToQuote(currentQuoteIndex,false);
}
function updateFavoriteCount(){favoriteCount.textContent=favorites.size}
function toggleFavorite(i){
  const key=quoteKey(quotes[i],i);
  if(favorites.has(key)){favorites.delete(key);showToast('मनपर्नेबाट हटाइयो')}else{favorites.add(key);showToast('मनपर्नेमा सुरक्षित भयो')}
  saveFavorites();
  const card=scroller.querySelector(`[data-index="${i}"]`);if(card)card.querySelector('.favorite-button').classList.toggle('active',favorites.has(key));
}
async function copyQuote(i=currentQuoteIndex){
  const q=quotes[i];if(!q)return;
  const text=`“${q.quote}” ${q.author||''}`;
  try{await navigator.clipboard.writeText(text);showToast('उद्धरण कपी भयो ✓')}catch{const area=document.createElement('textarea');area.value=text;document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();showToast('उद्धरण कपी भयो ✓')}
}
function scrollToQuote(i,smooth=true){
  if(!quotes.length)return;
  currentQuoteIndex=(i+quotes.length)%quotes.length;
  const card=scroller.querySelector(`[data-index="${currentQuoteIndex}"]`);if(card)card.scrollIntoView({behavior:smooth?'smooth':'auto',block:'center'});
  updateActiveCards();
}
function nextQuote(){scrollToQuote(currentQuoteIndex+1)}
function prevQuote(){scrollToQuote(currentQuoteIndex-1)}
function updateActiveCards(){scroller.querySelectorAll('.quote-card').forEach((c,i)=>c.classList.toggle('active',i===currentQuoteIndex))}
let observer;
function observeCards(){if(observer)observer.disconnect();observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting&&entry.intersectionRatio>.6){const i=Number(entry.target.dataset.index);currentQuoteIndex=i;updateActiveCards()}})},{root:scroller,threshold:.65});scroller.querySelectorAll('.quote-card').forEach(c=>observer.observe(c))}
function startAutoScroll(){clearInterval(autoScrollTimer);autoScrollTimer=setInterval(()=>{if(!favoritesMode)nextQuote()},6500)}
function downloadQuoteAsPNG(){
  const card=scroller.querySelector(`[data-index="${currentQuoteIndex}"]`);if(!card||typeof html2canvas==='undefined')return;
  html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#090909'}).then(canvas=>{const a=document.createElement('a');a.download=`laxman-nepal-sabda-${currentQuoteIndex+1}.png`;a.href=canvas.toDataURL('image/png');a.click();showToast('PNG तयार भयो')}).catch(()=>showToast('PNG बनाउन सकिएन'))
}
function enterFullscreen(){const el=document.documentElement;if(!document.fullscreenElement){(el.requestFullscreen||el.webkitRequestFullscreen)?.call(el)}else{document.exitFullscreen?.()}}
function toggleFavoritesMode(){favoritesMode=!favoritesMode;document.body.classList.toggle('favorites-mode',favoritesMode);const btn=document.getElementById('favorites-toggle');btn.setAttribute('aria-label',favoritesMode?'सबै उद्धरण':'मनपर्ने उद्धरणहरू');if(favoritesMode&&!favorites.size){showToast('अहिलेसम्म कुनै मनपर्ने छैन');favoritesMode=false;document.body.classList.remove('favorites-mode');return}showToast(favoritesMode?'मनपर्ने उद्धरणहरू':'सबै उद्धरण');if(favoritesMode){const first=[...quotes.keys()].find(i=>isFavorite(quotes[i],i));if(first!==undefined)scrollToQuote(first,false)}}

document.getElementById('next-quote').addEventListener('click',nextQuote);
document.getElementById('prev-quote').addEventListener('click',prevQuote);
document.getElementById('copy-quote').addEventListener('click',()=>copyQuote());
document.getElementById('download-quote').addEventListener('click',downloadQuoteAsPNG);
document.getElementById('fullscreen-quote').addEventListener('click',enterFullscreen);
document.getElementById('favorites-toggle').addEventListener('click',toggleFavoritesMode);

fetch('quotes.json').then(r=>r.json()).then(data=>{quotes=Array.isArray(data)?data:[];currentQuoteIndex=Math.floor(Math.random()*quotes.length);renderQuotes();startAutoScroll()}).catch(()=>showToast('उद्धरण लोड हुन सकेन'));

function renderGreeting(){const h=new Date().getHours();let t=h<=12?'प्रभात':h<=16?'मध्यान्ह':h<=19?'सन्ध्या':'रात्री';document.getElementById('greeting').textContent=`शुभ ${t}`}
function updateNepaliDate(){try{const d=new Date();const bs=NepaliDateConverter.ConvertToNepali(d.getFullYear(),d.getMonth()+1,d.getDate());const months=['बैशाख','जेष्ठ','आषाढ','श्रावण','भाद्र','आश्विन','कार्तिक','मंसिर','पुष','माघ','फाल्गुन','चैत्र'];document.getElementById('nepali-date').textContent=`${months[bs.month-1]} ${nepaliDigits(bs.day)}, ${nepaliDigits(bs.year)}`}catch{}}
function updateClock(){const now=moment().tz('Asia/Kathmandu');document.getElementById('clock').innerHTML=`${now.format('hh')}:${now.format('mm')}:${now.format('ss')}<span id="nampm">${now.format('A')}</span>`}
renderGreeting();updateNepaliDate();updateClock();setInterval(updateClock,1000);setInterval(updateNepaliDate,60000);saveFavorites();
