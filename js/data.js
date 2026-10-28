// ===== BRANDING: edit these two values to change the site name and logo everywhere =====
// name: shown next to the logo and in the browser tab title.
// logo: path to an image inside this project, e.g. 'assets/images/logo.png' (PNG, JPG, WebP or SVG). Leave '' for the default ▲ mark.
const BRAND={name:'NVIDIA',logo:'assets/images/logo.png'};
// ===== end of branding =====
const CREDS={email:'iamtyler52@gmail.com',pass:'Tyler2244',name:'TYLER GEE'};
const INIT=150000000,TARGET=100000000,ASOF='October 28, 2026'; // integer cents
const DISC='Welcome to NVIDIA Investment';
const usd=c=>(c/100).toLocaleString('en-US',{style:'currency',currency:'USD'});
const esc=t=>String(t).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// Fixed monthly returns in basis points (deterministic). Oct 2026 is the balancing, partial month.
const BP=[420,-90,360,280,-50,440,350,260,-160,390,310,270,340,-60,410,330,280,-100,380,340,300];
const LEDGER=(()=>{let bal=INIT,g=0;const rows=[{date:'2025-01-02',type:'Initial Contribution',amt:INIT,bal,status:''}],months=[];
for(let i=0;i<22;i++){const y=2025+(i/12|0),m=i%12,open=i?bal:0,base=bal,last=i==21?28:new Date(y,m+1,0).getDate(),
gain=i<21?Math.round(base*BP[i]/10000):TARGET-g,key=`${y}-${String(m+1).padStart(2,'0')}`;
g+=gain;bal+=gain;
months.push({key,label:`${MN[m]} ${y}`,open,contrib:i?0:INIT,base,gain,close:bal,partial:i==21});
rows.push({date:`${key}-${String(last).padStart(2,'0')}`,type:gain<0?'Loss':'Profit',amt:gain,bal,status:i==21?'':''});}
if(bal!==INIT+TARGET||g!==TARGET)throw Error('Ledger does not reconcile');
return{rows,months}})();
const FINAL=LEDGER.rows.at(-1).bal;
const NOTES=[{id:1,t:'Welcome to your Portfolio',b:''},{id:2,t:'',b:''},{id:3,t:'',b:''},{id:4,t:'',b:''}];
const KEY='NVIDIA_v1',DEF={name:CREDS.name,theme:'dark',avatar:'',read:[],dep:[],wd:[]};
const S=()=>{try{return{...DEF,...JSON.parse(localStorage.getItem(KEY))}}catch(e){return{...DEF}}};
const save=s=>{try{localStorage.setItem(KEY,JSON.stringify(s));return true}catch(e){return false}};
const avail=()=>{const s=S();return FINAL+s.dep.filter(d=>d.status==='Deposit').reduce((a,d)=>a+d.am,0)-s.wd.reduce((a,d)=>a+d.am,0)};
const markInner=()=>{const src=BRAND.logo;return src?`<img class="logo" src="${esc(src)}" alt="">`:'▲'};
const mark=()=>`<span class="mark">${markInner()}</span>`;
const bname=()=>BRAND.name;
