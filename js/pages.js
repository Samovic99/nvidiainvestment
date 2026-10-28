(()=>{if(!window.MAIN)return;
const M=MAIN,L=LEDGER,s0=S(),pg=document.body.dataset.page;
const cls=n=>n<0?'neg':'pos',sg=c=>(c>0?'+':'')+usd(c),pc=(a,b)=>(a/b*100).toFixed(2)+'%';
const opt=a=>a.map(t=>`<option>${t}</option>`).join('');
if(window.Chart){Chart.defaults.color='#8da08d';Chart.defaults.borderColor='rgba(141,160,141,.2)'}
const ch=(id,type,data,o={})=>window.Chart&&new Chart($(id),{type,data,options:{responsive:true,maintainAspectRatio:false,...o}});
const tbl=rows=>`<div class="tw"><table><thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Running balance</th><th>Status</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.date}</td><td>${r.type}</td><td class="${cls(r.amt)}">${r.type[0]==='I'?usd(r.amt):sg(r.amt)}</td><td>${usd(r.bal)}</td><td><span class="badge">${r.status}</span></td></tr>`).join('')||'<tr><td colspan="5">No entries match these filters. Clear a filter to see more.</td></tr>'}</tbody></table></div>`;
const kpi=a=>`<div class="grid">${a.map(([k,v,c])=>`<div class="card"><div class="k">${k}</div><div class="v ${c||''}">${v}</div></div>`).join('')}</div>`;
const lineD=()=>({labels:L.months.map(m=>m.label),datasets:[{label:'Balance',data:L.months.map(m=>m.close/100),borderColor:'#76b900',backgroundColor:'rgba(118,185,0,.15)',fill:true,tension:.3,pointRadius:2}]});
const mTick={ticks:{callback:v=>'$'+(v/1e6).toFixed(1)+'M'}};

const flow=k=>{const dep=k==='dep',T=dep?'Deposit':'Withdrawal',C=DEPOSIT_CONFIG,stat=dep?C.statuses.deposit:C.statuses.withdrawal;
M.innerHTML=`<h1> ${T}</h1><p class="note" role="note">${esc(C.notice)}</p>
<p>Available balance: <b>${usd(avail())}</b><br><span class="mut small">${dep?'Pending deposits do not change this balance. ':'Withdrawal requests reduce it immediately. '}Neither changes the historical performance ledger.</span></p>
<section class="grid two"><div class="card" id="st"></div><div class="card"><h2> History</h2><div id="hist"></div></div></section>`;
const hist=()=>{const a=S()[k];$('hist').innerHTML=a.length?`<div class="tw"><table><thead><tr><th>Date</th><th>Coin</th><th>Network</th><th>Amount</th><th>Status</th></tr></thead><tbody>${a.map(d=>`<tr><td>${d.date}</td><td>${d.co}</td><td>${esc(d.net||'—')}</td><td>${usd(d.am)}</td><td><span class="badge">${esc(d.status)}</span></td></tr>`).join('')}</tbody></table></div>`:'<p class="mut">No requests yet. Submit one using the form.</p>'};
const form=(d={})=>{
$('st').innerHTML=`<form id="fm" novalidate><h2>Details</h2>
<label for="co">Cryptocurrency</label><select id="co">${Object.entries(C.assets).map(([c,a])=>`<option value="${c}">${esc(a.label)}</option>`).join('')}</select>
<label for="nt">Network</label><select id="nt"></select>
<p class="k" style="margin:.75rem 0 .25rem">${dep?'Deposit':'Withdrawal'} address </p>
<p class="note" style="overflow-wrap:anywhere"><code>${esc(C.placeholderAddress)}</code><br><span class="small mut"></span></p>
<label for="am">Amount (USD)</label><input id="am" inputmode="decimal" value="${esc(d.v||'')}" aria-describedby="e"><p id="e" class="neg" role="alert"></p><button class="btn">Review ${T}</button></form>`;
const nets=()=>{$('nt').innerHTML=C.assets[$('co').value].networks.map(n=>`<option>${esc(n)}</option>`).join('')};
$('co').value=d.co||'BTC';nets();if(d.net)$('nt').value=d.net;$('co').onchange=nets;
$('fm').onsubmit=e=>{e.preventDefault();const co=$('co').value,net=$('nt').value,v=$('am').value,am=Math.round(Number(v)*100);let m='';
if(!(am>0))m='Enter an amount greater than $0.00.';
else if(am<C.minUsd*100)m='The minimum  amount is '+usd(C.minUsd*100)+'.';
else if(am>C.maxUsd*100)m='The maximum  amount is '+usd(C.maxUsd*100)+'.';
else if(!dep&&am>avail())m='This amount is more than your available  balance of '+usd(avail())+'.';
if(m)return $('e').textContent=m;review({co,net,am,v})}};
const review=d=>{$('st').innerHTML=`<h2>Review your  ${T}</h2><p>Coin: <b>${d.co}</b><br>Network: <b>${esc(d.net)}</b><br>Address: <b>${esc(C.placeholderAddress)}</b> (fictional)<br>Amount: <b>${usd(d.am)}</b></p><p class="note">Nothing is sent. Confirming only saves a  record in this browser.</p><div class="row"><button class="btn" id="ok">Confirm  ${T}</button><button class="btn alt" id="bk">Edit details</button></div>`;
$('bk').onclick=()=>form(d);
$('ok').onclick=()=>{const s=S(),r={id:Date.now(),date:new Date().toISOString().slice(0,10),co:d.co,net:d.net,am:d.am,status:stat};s[k].push(r);save(s);
$('st').innerHTML=`<h2 class="pos"> ${T} recorded</h2><p>Status: <span class="badge">${esc(r.status)}</span><br>${usd(r.am)} in ${r.co} on ${esc(r.net)}. This is a  record only: no funds were sent, and nothing was verified or confirmed on any blockchain.</p><button class="btn" id="nw">Start another</button>`;$('nw').onclick=()=>flow(k);hist()}};
form();hist()};

const P={
dashboard(){const profit=FINAL-INIT,last=L.months.slice(-6).reverse();
M.innerHTML=`<div><h1>Welcome, ${esc(s0.name)}</h1><p class="mut"> figures as of ${ASOF}. Investment start: January 2025.</p></div>
${kpi([[' balance',usd(FINAL)],['Initial investment',usd(INIT)],[' profit',usd(profit),'pos'],['Total growth',pc(profit,INIT),'pos']])}
<p class="mut small" style="margin:0">Available  balance, including separate  deposits and withdrawals: <b>${usd(avail())}</b></p>
<div class="row"><a class="btn" href="deposit.html">Deposit</a><a class="btn" href="withdraw.html">Withdraw</a><a class="btn alt" href="transactions.html">Transaction history</a><a class="btn alt" href="profile.html">Profile</a></div>
<section class="grid two"><div class="card"><h2>Monthly performance</h2><div class="chart"><canvas id="c1" role="img" aria-label="Line chart of  month-end balance"></canvas></div></div>
<div class="card"><h2>Portfolio allocation ()</h2><div class="chart"><canvas id="c2" role="img" aria-label="Doughnut chart of  allocation"></canvas></div></div></section>
<section class="grid two"><div class="card"><h2>Recent transactions</h2>${tbl(L.rows.slice(-5).reverse())}</div>
<div class="card"><h2>Monthly return summary</h2><ul class="list">${last.map(m=>`<li class="row" style="justify-content:space-between"><span>${m.label}${m.partial?' (to Oct 28)':''}</span><b class="${cls(m.gain)}">${pc(m.gain,m.base)} · ${sg(m.gain)}</b></li>`).join('')}</ul></div></section>
<section class="card"><h2>Notifications</h2><ul class="list">${NOTES.slice(0,3).map(n=>`<li><b>${n.t}</b><br><span class="mut">${n.b}</span></li>`).join('')}</ul><p><a href="notifications.html">View all notifications</a></p></section>`;
ch('c1','line',lineD(),{scales:{y:mTick},plugins:{legend:{display:false}}});
ch('c2','doughnut',{labels:['AI & semiconductors','Broad equities','Bonds','Cash'],datasets:[{data:[40,30,20,10],backgroundColor:['#76b900','#a2e32a','#3f6b00','#2c3a2c'],borderWidth:0}]},{plugins:{legend:{position:'bottom'}}})},

transactions(){let cur=[];const s=S();
M.innerHTML=`<h1>Transaction history</h1><form class="card grid" id="f" aria-label="Filters"><div><label for="q">Search</label><input id="q" type="search"></div>
<div><label for="ty">Type</label><select id="ty"><option value="">All</option>${opt([...new Set(L.rows.map(r=>r.type))])}</select></div>
<div><label for="stt">Status</label><select id="stt"><option value="">All</option>${opt([...new Set(L.rows.map(r=>r.status))])}</select></div>
<div><label for="d1">From</label><input id="d1" type="date"></div><div><label for="d2">To</label><input id="d2" type="date"></div></form>
<div class="row"><button class="btn" id="ex">Export CSV</button><span id="cnt" class="mut"></span></div><div class="card" id="out"></div>
<div class="card"><h2> deposit and withdrawal requests (recorded separately)</h2><p class="mut small">These are not part of the performance ledger above.</p>${tbl([...s.dep.map(d=>({date:d.date,type:' deposit '+d.co+(d.net?' · '+esc(d.net):''),amt:d.am,bal:0,status:d.status})),...s.wd.map(d=>({date:d.date,type:' withdrawal '+d.co+(d.net?' · '+esc(d.net):''),amt:-d.am,bal:0,status:d.status}))]).replace(/<td>\$0\.00<\/td>/g,'<td>—</td>')}</div>`;
const v=id=>$(id).value,f=()=>{const q=v('q').toLowerCase(),t=v('ty'),st=v('stt'),a=v('d1'),b=v('d2');
cur=L.rows.filter(r=>(!t||r.type===t)&&(!st||r.status===st)&&(!a||r.date>=a)&&(!b||r.date<=b)&&(!q||(r.date+r.type+r.status+usd(r.amt)).toLowerCase().includes(q)));
$('out').innerHTML=tbl(cur);$('cnt').textContent=cur.length+' of '+L.rows.length+' entries'};
$('f').oninput=f;$('f').onsubmit=e=>e.preventDefault();f();
$('ex').onclick=()=>csv('greenvest--transactions.csv',['Date','Type','Amount (USD)','Running balance (USD)','Status'],cur.map(r=>[r.date,r.type,(r.amt/100).toFixed(2),(r.bal/100).toFixed(2),r.status+' - ']))},

analytics(){const g=L.months,best=g.reduce((a,b)=>b.gain/b.base>a.gain/a.base?b:a),worst=g.reduce((a,b)=>b.gain/b.base<a.gain/a.base?b:a),avg=g.reduce((a,m)=>a+m.gain/m.base,0)/g.length*100;
M.innerHTML=`<h1>Portfolio analytics</h1>${kpi([['Best month',`${best.label} ${pc(best.gain,best.base)}`,'pos'],['Weakest month',`${worst.label} ${pc(worst.gain,worst.base)}`,cls(worst.gain)],['Average monthly return',avg.toFixed(2)+'%'],['Positive months',g.filter(m=>m.gain>0).length+' of '+g.length]])}
<section class="grid two"><div class="card"><h2>Monthly gain or loss</h2><div class="chart"><canvas id="c1" role="img" aria-label="Bar chart of  monthly gains and losses"></canvas></div></div>
<div class="card"><h2>Month-end balance</h2><div class="chart"><canvas id="c2" role="img" aria-label="Line chart of  month-end balance"></canvas></div></div></section>
<p class="mut small">The October 2026 figure covers October 1–28 only. All values are .</p>`;
ch('c1','bar',{labels:g.map(m=>m.label),datasets:[{label:'Gain/loss',data:g.map(m=>m.gain/100),backgroundColor:g.map(m=>m.gain<0?'#ff6b6b':'#76b900')}]},{plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>'$'+(v/1e3)+'k'}}}});
ch('c2','line',lineD(),{scales:{y:mTick},plugins:{legend:{display:false}}})},

deposit(){flow('dep')},withdraw(){flow('wd')},

statements(){M.innerHTML=`<h1>Monthly statements</h1><div><label for="mo">Month</label><select id="mo">${L.months.map((m,i)=>`<option value="${i}"${i==21?' selected':''}>${m.label}${m.partial?' (to Oct 28)':''}</option>`).join('')}</select></div><div id="sv" class="grid"></div>`;
const r=()=>{const m=L.months[$('mo').value],ent=L.rows.filter(x=>x.date.startsWith(m.key));
$('sv').style.display='block';$('sv').innerHTML=`<section class="card"><h2>${m.label} statement ()</h2>${kpi([['Opening balance',usd(m.open)],['Contribution',usd(m.contrib)],['Gain / loss',sg(m.gain),cls(m.gain)],['Closing balance',usd(m.close)]])}<p>Return on starting balance: <b class="${cls(m.gain)}">${pc(m.gain,m.base)}</b>${m.partial?' (partial month ending October 28, 2026)':''}</p>${tbl(ent)}<p><button class="btn" id="dl">Download CSV</button></p></section>`;
$('dl').onclick=()=>csv(`greenvest-statement-${m.key}.csv`,['Date','Type','Amount (USD)','Running balance (USD)','Status'],[['',`Opening balance ${m.label}`,'',(m.open/100).toFixed(2),''],...ent.map(x=>[x.date,x.type,(x.amt/100).toFixed(2),(x.bal/100).toFixed(2),x.status+' - ']),['',`Closing balance ${m.label}`,'',(m.close/100).toFixed(2),'']])};
$('mo').onchange=r;r()},

notifications(){const draw=()=>{const rd=S().read;M.innerHTML=`<h1>Notifications</h1><div><button class="btn alt" id="ma">Mark all as read</button></div><ul class="list">${NOTES.map(n=>`<li class="card ${rd.includes(n.id)?'':'unread'}"><b>${n.t}</b><p>${n.b}</p><button class="btn alt" data-id="${n.id}">Mark as ${rd.includes(n.id)?'unread':'read'}</button></li>`).join('')}</ul>`;
$('ma').onclick=()=>{const s=S();s.read=NOTES.map(n=>n.id);save(s);draw();updNB()};
M.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{const s=S(),i=+b.dataset.id;s.read=s.read.includes(i)?s.read.filter(x=>x!==i):[...s.read,i];save(s);draw();updNB()})};draw()},

profile(){M.innerHTML=`<h1>Profile and settings</h1><section class="grid two"><div class="card"><h2>Account</h2><p>Email: <b>${CREDS.email}</b></p>
${s0.avatar?`<img id="pv" class="avatar" style="width:96px;height:96px" src="${s0.avatar}" alt="Profile picture preview">`:`<img id="pv" class="avatar" style="width:96px;height:96px;display:none" alt="Profile picture preview">`}
<label for="av">Profile picture (PNG, JPEG or WebP, under 500 KB)</label><input id="av" type="file" accept="image/png,image/jpeg,image/webp">
<label for="nm">Display name</label><input id="nm" maxlength="40" value="${esc(s0.name)}"><label for="tm">Theme</label><select id="tm"><option value="dark">Dark</option><option value="light">Light</option></select>
<p id="msg" class="pos" role="status"></p><div class="row"><button class="btn" id="sv">Save settings</button><button class="btn alt" id="lo2">Log out</button></div></div>
<div class="card"><h2> data</h2><p class="mut">Everything here is stored in this browser with localStorage. It does not sync between devices and is not secure storage.</p><button class="btn alt" id="rs">Reset all  data</button></div></section>`;
$('tm').value=s0.theme;const msg=t=>$('msg').textContent=t;
$('av').onchange=e=>{const f=e.target.files[0];if(!f)return;
if(!/^image\/(png|jpeg|webp)$/.test(f.type))return msg('Choose a PNG, JPEG or WebP image.');
if(f.size>512000)return msg('Choose an image under 500 KB.');
const r=new FileReader();r.onload=()=>{$('pv').src=r.result;$('pv').style.display='';const s=S();s.avatar=r.result;msg(save(s)?'Picture saved in this browser.':'Preview only: browser storage is full.')};r.readAsDataURL(f)};
$('sv').onclick=()=>{const n=$('nm').value.trim();if(!n||n.length>40)return msg('Enter a display name of 1 to 40 characters.');const s=S();s.name=n;s.theme=$('tm').value;save(s);location.reload()};
$('lo2').onclick=()=>$('lo').click();
$('rs').onclick=()=>{if(confirm('Reset all  data? This clears requests, name, theme, picture and notification state.')){localStorage.removeItem(KEY);location.reload()}}}
};
P[pg]&&P[pg]();
})();
