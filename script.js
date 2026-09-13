const menu=document.querySelector('.menu'), nav=document.querySelector('#navlinks');
menu?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('#navlinks a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelectorAll('.nav-toplink').forEach(btn=>btn.addEventListener('click',e=>{
  e.stopPropagation();
  const item=btn.closest('.nav-item'), isOpen=item.classList.contains('open');
  document.querySelectorAll('.nav-item.open').forEach(i=>{i.classList.remove('open');i.querySelector('.nav-toplink').setAttribute('aria-expanded','false')});
  if(!isOpen){item.classList.add('open');btn.setAttribute('aria-expanded','true')}
}));
document.addEventListener('click',()=>document.querySelectorAll('.nav-item.open').forEach(i=>{i.classList.remove('open');i.querySelector('.nav-toplink').setAttribute('aria-expanded','false')}));
document.getElementById('year').textContent=new Date().getFullYear();
const lightbox=document.getElementById('lightbox'), lbimg=document.getElementById('lightbox-img');
document.querySelectorAll('.gallery button, .activity-photos button').forEach(btn=>btn.addEventListener('click',()=>{
  lbimg.src=btn.dataset.full; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false');
}));
function closeBox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lbimg.src='';}
document.querySelector('.close').addEventListener('click',closeBox);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeBox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBox()});
