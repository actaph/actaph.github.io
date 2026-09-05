const menu=document.querySelector('.menu'), nav=document.querySelector('#navlinks');
menu?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('#navlinks a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();
const lightbox=document.getElementById('lightbox'), lbimg=document.getElementById('lightbox-img');
document.querySelectorAll('.gallery button').forEach(btn=>btn.addEventListener('click',()=>{
  lbimg.src=btn.dataset.full; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false');
}));
function closeBox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lbimg.src='';}
document.querySelector('.close').addEventListener('click',closeBox);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeBox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBox()});
