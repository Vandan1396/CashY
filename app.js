const KEY="cashv_v3_expenses", BKEY="cashv_v3_budget", PKEY="cashv_v3_profile";
let expenses=JSON.parse(localStorage.getItem(KEY)||"[]");
let budget=Number(localStorage.getItem(BKEY)||20000);
let profile=JSON.parse(localStorage.getItem(PKEY)||JSON.stringify({name:"Vandan Parekh",age:"",gender:"",phone:"",email:"",city:""}));

const $=id=>document.getElementById(id);
const COLORS=["#54c85a","#2d78dc","#a04bd0","#ed9d2c","#e95b7d","#58b7b0","#d9c25b","#8d9294"];
const ICONS={"Food & Dining":"☕","Transport":"▰","Shopping":"▣","Bills & Utilities":"⌁","Health":"✚","Entertainment":"♪","Home":"⌂","Others":"•"};
const money=n=>"₹"+Number(n||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
const money0=n=>"₹"+Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:0});

function monthKey(d=new Date()){return d.toISOString().slice(0,7)}
function currentMonthExpenses(){return expenses.filter(x=>x.date?.slice(0,7)===monthKey())}
function save(){localStorage.setItem(KEY,JSON.stringify(expenses));render()}
function fmtDate(s){if(!s)return "";return new Date(s+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
function toast(msg){$("toast").textContent=msg;$("toast").classList.remove("hidden");setTimeout(()=>$("toast").classList.add("hidden"),1800)}

function switchScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===id));
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.screen===id));
  $("addExpenseBtn").style.display=id==="homeScreen"?"flex":"none";
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>switchScreen(b.dataset.screen));
$("menuBtn").onclick=()=>toast("CashV menu is ready for future settings.");
$("notifyBtn").onclick=()=>toast("No new alerts.");
$("profileBack").onclick=()=>switchScreen("homeScreen");
$("viewAllBtn").onclick=()=>switchScreen("analyticsScreen");

function render(){
  const now=new Date(), h=now.getHours();
  $("dayPart").textContent=h<12?"Morning":h<17?"Afternoon":"Evening";
  $("greetName").textContent=(profile.name||"there").split(" ")[0];
  const m=currentMonthExpenses(), total=m.reduce((s,x)=>s+x.amount,0);
  const today=new Date().toISOString().slice(0,10), todayTotal=expenses.filter(x=>x.date===today).reduce((s,x)=>s+x.amount,0);
  $("balanceValue").textContent=money(Math.max(0,budget-total));
  $("monthExpenseValue").textContent=money(total);
  $("donutTotal").textContent=money0(total);
  $("monthLabel").textContent=new Date().toLocaleDateString("en-IN",{month:"long",year:"numeric"});
  renderCategories(m);renderTransactions(m);renderBudget(total);renderAnalytics(m);renderProfile();
  drawDonut(m);
}

function groupCategories(items){
  const out={};items.forEach(x=>out[x.category]=(out[x.category]||0)+x.amount);return Object.entries(out).sort((a,b)=>b[1]-a[1]);
}
function renderCategories(m){
  const rows=groupCategories(m), total=m.reduce((s,x)=>s+x.amount,0);
  $("categoryList").innerHTML=rows.length?rows.map(([name,val],i)=>`<div class="category-row"><i class="dot" style="background:${COLORS[i%COLORS.length]}"></i><span>${name}</span><b>${money0(val)}</b></div>`).join(""):`<div class="category-row"><i class="dot" style="background:#596463"></i><span>No expenses yet</span><b>₹0</b></div>`;
}
function renderTransactions(m){
  const list=[...m].sort((a,b)=>b.created-a.created).slice(0,5);
  $("transactionList").innerHTML=list.length?list.map(x=>`<div class="transaction"><div class="transaction-icon">${ICONS[x.category]||"•"}</div><div class="transaction-main"><b>${escapeHtml(x.note||x.category)}</b><small>${escapeHtml(x.category)}</small></div><div class="transaction-amount">−${money0(x.amount)}<small>${fmtDate(x.date)}</small></div></div>`).join(""):`<div class="transaction"><div class="transaction-icon">＋</div><div class="transaction-main"><b>No transactions yet</b><small>Tap Add expense to start</small></div></div>`;
}
function renderBudget(total){
  $("budgetValue").textContent=money0(budget);
  const pct=budget?Math.min(100,total/budget*100):0;
  $("budgetPercent").textContent=Math.round(pct)+"%";
  $("budgetProgress").style.width=pct+"%";
  $("spentLabel").textContent=money0(total)+" spent";
  $("leftLabel").textContent=money0(Math.max(0,budget-total))+" left";
}
function renderAnalytics(m){
  const rows=groupCategories(m),total=m.reduce((s,x)=>s+x.amount,0);
  $("analyticsRows").innerHTML=rows.length?rows.map(([name,val],i)=>`<div class="summary-row"><i class="dot" style="background:${COLORS[i%COLORS.length]}"></i><span>${name}</span><b>${money0(val)} · ${total?Math.round(val/total*100):0}%</b></div>`).join(""):"<p style='color:#98a3a2;font-size:12px'>No spending data yet.</p>";
  const top=rows[0];
  $("insightText").textContent=top?`Your largest category this month is ${top[0]} at ${money0(top[1])}. Keep an eye on it to stay within your ${money0(budget)} budget.`:"Add expenses and CashV will show useful spending patterns.";
  drawTrend();
}
function renderProfile(){
  const p=profile,name=p.name||"Your Name",initial=(name.trim()[0]||"V").toUpperCase();
  $("profileName").textContent=name;$("profileAvatar").textContent=initial;
  const fields=[["♙","Name",p.name||"Not set"],["▣","Age",p.age||"Not set"],["⚥","Gender",p.gender||"Not set"],["⌕","Phone",p.phone||"Not set"],["✉","Email",p.email||"Not set"],["⌖","City",p.city||"Not set"]];
  $("profileList").innerHTML=fields.map((f,i)=>`<div class="profile-row"><div class="row-icon">${f[0]}</div><div><small>${f[1]}</small><b>${escapeHtml(f[2])}</b></div><button class="edit-mini" data-field="${i}">✎</button></div>`).join("");
  document.querySelectorAll(".edit-mini").forEach(b=>b.onclick=openProfile);
}
function drawDonut(items){
  const c=$("donutChart"),ctx=c.getContext("2d"),d=devicePixelRatio||1;
  c.width=220*d;c.height=220*d;ctx.clearRect(0,0,c.width,c.height);ctx.scale(d,d);
  const data=groupCategories(items),total=data.reduce((s,x)=>s+x[1],0),cx=110,cy=110,r=78,inner=52;
  if(!total){ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle="#273234";ctx.lineWidth=26;ctx.stroke();return}
  let a=-Math.PI/2;data.forEach(([n,v],i)=>{const da=v/total*Math.PI*2;ctx.beginPath();ctx.arc(cx,cy,r,a,a+da-.035);ctx.strokeStyle=COLORS[i%COLORS.length];ctx.lineWidth=26;ctx.lineCap="butt";ctx.stroke();a+=da});
  ctx.beginPath();ctx.arc(cx,cy,inner,0,Math.PI*2);ctx.fillStyle="#11191c";ctx.fill();
}
function drawTrend(){
  const c=$("trendChart"),ctx=c.getContext("2d"),rect=c.getBoundingClientRect(),d=devicePixelRatio||1,w=Math.max(300,rect.width),h=240;
  c.width=w*d;c.height=h*d;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);
  const days=[];for(let i=6;i>=0;i--){const dt=new Date();dt.setDate(dt.getDate()-i);days.push(dt.toISOString().slice(0,10))}
  const vals=days.map(day=>expenses.filter(x=>x.date===day).reduce((s,x)=>s+x.amount,0)),max=Math.max(...vals,100);
  ctx.strokeStyle="#263437";ctx.lineWidth=1;for(let i=0;i<4;i++){const y=25+i*48;ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(w-10,y);ctx.stroke()}
  const pts=vals.map((v,i)=>({x:35+i*(w-55)/6,y:200-(v/max)*150}));
  ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle="#54c85a";ctx.lineWidth=3;ctx.stroke();
  pts.forEach((p,i)=>{ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle="#54c85a";ctx.fill();ctx.fillStyle="#98a3a2";ctx.font="10px Inter, sans-serif";ctx.fillText(new Date(days[i]+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short"}),p.x-14,222)});
}
function openProfile(){
  const p=profile;
  $("nameInput").value=p.name||"";$("ageInput").value=p.age||"";$("genderInput").value=p.gender||"";
  $("phoneInput").value=p.phone||"";$("emailInput").value=p.email||"";$("cityInput").value=p.city||"";
  $("profileModal").classList.remove("hidden");
}
$("profileEdit").onclick=openProfile;
$("addExpenseBtn").onclick=()=>{$("dateInput").value=new Date().toISOString().slice(0,10);$("expenseModal").classList.remove("hidden");$("amountInput").focus()};
$("changeBudgetBtn").onclick=()=>{$("budgetInput").value=budget;$("budgetModal").classList.remove("hidden")};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).classList.add("hidden"));
$("saveExpense").onclick=()=>{
  const amount=Number($("amountInput").value);if(!amount||amount<0){toast("Enter a valid amount.");return}
  expenses.push({amount,category:$("categoryInput").value,method:$("methodInput").value,date:$("dateInput").value,note:$("noteInput").value.trim(),created:Date.now()});
  save();$("expenseModal").classList.add("hidden");$("amountInput").value="";$("noteInput").value="";toast("Expense added");
};
$("saveProfile").onclick=()=>{
  profile={name:$("nameInput").value.trim(),age:$("ageInput").value.trim(),gender:$("genderInput").value,phone:$("phoneInput").value.trim(),email:$("emailInput").value.trim(),city:$("cityInput").value.trim()};
  localStorage.setItem(PKEY,JSON.stringify(profile));$("profileModal").classList.add("hidden");render();toast("Profile updated");
};
$("saveBudget").onclick=()=>{budget=Number($("budgetInput").value)||0;localStorage.setItem(BKEY,budget);$("budgetModal").classList.add("hidden");render();toast("Budget updated")};
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
render();
window.addEventListener("resize",()=>{drawTrend();drawDonut(currentMonthExpenses())});
