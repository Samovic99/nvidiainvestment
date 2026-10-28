const $=id=>document.getElementById(id);
function csv(name,head,rows){const q=v=>`"${String(v).replace(/"/g,'""')}"`;
const t=[q(DISC),head.map(q).join(','),...rows.map(r=>r.map(q).join(','))].join('\n');
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
window.updNB=()=>{const n=NOTES.filter(x=>!S().read.includes(x.id)).length,b=$('nb');if(b){b.textContent=n;b.hidden=!n}};
(()=>{const pg=document.body.dataset.page,s=S(),app=$('app'),ok=sessionStorage.getItem('gv')==='1';
document.documentElement.dataset.theme=s.theme;document.title=document.title.replace('NVIDIA',bname());
if(pg==='index'?ok:!ok)return location.replace(ok?'dashboard.html':'index.html');
const ban=`<div class="banner" id="bn" role="note">${DISC}</div>`;
const bh=()=>document.documentElement.style.setProperty('--bh',$('bn').offsetHeight+'px');
if(pg==='index'){
app.innerHTML=`${ban}<div class="login"><form class="card" id="lf" novalidate><div class="brand">${mark()} <span class="bname">${esc(bname())}</span></div><h1>Portfolio</h1><p class="mut"></p>
<label for="em">Email</label><input id="em" type="email" autocomplete="username"><label for="pw">Password</label><input id="pw" type="password" autocomplete="current-password">
<p id="err" class="neg" role="alert"></p><button class="btn" style="width:100%">Log in</button>
<p class="mut small"></p></form></div>`;
bh();addEventListener('resize',bh);
$('lf').onsubmit=e=>{e.preventDefault();if($('em').value.trim().toLowerCase()===CREDS.email&&$('pw').value===CREDS.pass){sessionStorage.setItem('gv','1');location.href='dashboard.html'}else $('err').textContent=''};
return}
const PAGES=[['dashboard','Dashboard','▦'],['transactions','Transactions','⇄'],['analytics','Analytics','◔'],['deposit','Deposit','↓'],['withdraw','Withdraw','↑'],['statements','Statements','▤'],['notifications','Notifications','●'],['profile','Profile','◉']];
const av=s.avatar?`<img class="avatar" src="${s.avatar}" alt="Profile picture">`:`<span class="avatar" aria-hidden="true">${esc(s.name[0]||'?')}</span>`;
app.innerHTML=`${ban}<div class="shell"><nav class="side" id="nav" aria-label="Main"><div class="brand">${mark()} <span class="bname">${esc(bname())}</span></div>${PAGES.map(([k,t,i])=>`<a href="${k}.html"${k===pg?' aria-current="page"':''}><span aria-hidden="true">${i}</span>${t}${k==='notifications'?' <span class="badge" id="nb" hidden></span>':''}</a>`).join('')}<button class="btn alt" id="th">Switch theme</button><button class="btn alt" id="lo">Log out</button></nav>
<div class="content"><header class="top"><button class="btn alt" id="menu" aria-label="Open menu" aria-expanded="false" aria-controls="nav">☰</button><span class="brand" style="margin:0">${mark()} <span class="bname">${esc(bname())}</span></span><a class="who" href="profile.html">${av}<span>${esc(s.name)}</span></a></header><main id="main" tabindex="-1"></main>
<footer>${DISC}<br></footer></div></div>`;
window.MAIN=$('main');bh();addEventListener('resize',bh);updNB();
const nav=$('nav'),mb=$('menu'),close=()=>{nav.classList.remove('open');mb.setAttribute('aria-expanded','false')};
mb.onclick=()=>{mb.setAttribute('aria-expanded',nav.classList.toggle('open'))};
nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});addEventListener('keydown',e=>{if(e.key==='Escape')close()});
$('th').onclick=()=>{const x=S();x.theme=x.theme==='dark'?'light':'dark';save(x);document.documentElement.dataset.theme=x.theme;location.reload()};
$('lo').onclick=()=>{sessionStorage.removeItem('gv');location.href='index.html'};
})();
