// =============================================
// VARIABLES GLOBALES
// =============================================
let mapAdmin, mapClient, clientMarker;
let mapInitialized = false;
const TOURS_LAT = 47.3941, TOURS_LNG = 0.6848;
window.currentUser = null;
window.currentDriver = null;
window.pendingDriverSignup = null;
window.etaInt = null;
let currentDeliveryDriver = null;

const avatarsStandard = [
  "https://api.dicebear.com/7.x/notionists/svg?seed=Mimi",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Toby",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Coco",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Loki",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Buster"
];
const avatarsPremium = [
  "https://api.dicebear.com/7.x/micah/svg?seed=King&backgroundColor=000000",
  "https://api.dicebear.com/7.x/micah/svg?seed=Queen&backgroundColor=b91c1c",
  "https://api.dicebear.com/7.x/micah/svg?seed=Jack&backgroundColor=1d4ed8"
];

let reglages = {
  theme:"dark", adminTheme:"dark", isPremium:false, cagnotte:0, cagnotteSpent:0,
  historiqueCommandes:[], moisCoussinGratuit:null,
  caTotal:0, totalOrders:0, users:[], driverApplications:[],
  promoCodeStr:"FREROT", promoValue:5, promoConfig:{code:"FREROT", percent:20, target:"all", active:true}, adminActionLog:[],
  welcomeText:"On vous livre un vrai lit, tout de suite.", taxeNuit:false, weatherSurge:false,
  avatarUrl:avatarsStandard[0],
  prixSolo:20, ruptureSolo:false, prixDuo:35, ruptureDuo:false,
  prixGonflable:10, ruptureGonflable:false, prixBebe:25, ruptureBebe:false,
  options:{
    opt1:{active:true,name:"☁️ Coussin",price:5,desc:"Oreiller ergonomique hyper moelleux."},
    opt2:{active:true,name:"✨ Draps propres",price:8,desc:"Parure complète lavée et repassée."},
    opt3:{active:true,name:"🧸 Grosse Couette",price:12,desc:"Couette épaisse et bien chaude."},
    opt4:{active:true,name:"🛠️ Installation",price:5,desc:"Le coursier gonfle et prépare le lit."},
    opt5:{active:true,name:"🤫 Pack Nuit",price:5,desc:"Masque de nuit et boules Quies."}
  },
  referrals:[], referralClaimed:false, savedCards:[]
};

let cart=[], selectedMattress=null, promoActive=false;
let currentCagnotteDeduction=0, currentTip=0, cartDistance=0.5;
let drivers=[], fakeUsers=[];
let botInterval=null, currentClientRating=0;
window.currentOpenDriverId=null; window.currentOpenUserId=null;
let pendingPaymentCallback=null, currentPaymentAmount=0;
let logoutInProgress=false;
const APP_VERSION='V25 stabilité';
const APP_STORAGE_KEY='lagoUberV20_session';
const LEGACY_STORAGE_KEY='lagoUberV20';
const CLIENT_TABS=['home','orders','profile'];
const CARD_DESIGNS=[
  {id:'classic',name:'Bleu Lago',desc:'Le design Lago classique, simple et propre.'},
  {id:'aurora',name:'Aurora',desc:'Turquoise premium avec reflet lumineux.'},
  {id:'obsidian',name:'Obsidian',desc:'Noir graphite ultra sobre.'},
  {id:'sunset',name:'Sunset',desc:'Dégradé chaud orange et rose.'},
  {id:'frost',name:'Frozen Glass',desc:'Version glacée translucide façon Lago+.'},
  {id:'ruby',name:'Ruby Pulse',desc:'Rouge rubis avec accents profonds.'},
  {id:'emerald',name:'Emerald',desc:'Vert intense inspiré des pierres précieuses.'},
  {id:'amethyst',name:'Amethyst',desc:'Violet premium avec halo doux.'},
  {id:'titanium',name:'Titanium',desc:'Métallique gris moderne et net.'},
  {id:'cobalt',name:'Cobalt',desc:'Bleu électrique très marqué.'},
  {id:'rosegold',name:'Rose Gold',desc:'Rose premium avec finition dorée.'},
  {id:'midnight',name:'Midnight',desc:'Bleu nuit sombre et élégant.'},
  {id:'coral',name:'Coral Bloom',desc:'Corail lumineux et solaire.'},
  {id:'ocean',name:'Deep Ocean',desc:'Bleus marins en couches profondes.'},
  {id:'forest',name:'Forest',desc:'Vert forêt sobre avec relief sombre.'},
  {id:'plasma',name:'Plasma',desc:'Dégradé néon rose-violet très vif.'},
  {id:'goldleaf',name:'Gold Leaf',desc:'Or satiné façon carte prestige.'},
  {id:'lavender',name:'Lavender',desc:'Lavande pastel très douce.'},
  {id:'mint',name:'Mint',desc:'Menthe claire fraîche et légère.'},
  {id:'cherry',name:'Cherry Pop',desc:'Rouge cerise très franc.'},
  {id:'sandstorm',name:'Sandstorm',desc:'Sable doré avec contraste chaud.'},
  {id:'polar',name:'Polar Night',desc:'Bleu polaire et noir givré.'},
  {id:'ember',name:'Ember',desc:'Braises rouge-orange lumineuses.'},
  {id:'lagoon',name:'Lagoon',desc:'Lagon turquoise et vert d’eau.'},
  {id:'velvet',name:'Velvet Plum',desc:'Prune velours luxueuse.'},
  {id:'onyxred',name:'Onyx Red',desc:'Noir intense traversé de rouge.'},
  {id:'starlight',name:'Starlight',desc:'Bleu nuit parsemé d’éclats lumineux.'},
  {id:'citrus',name:'Citrus',desc:'Jaune agrume énergique.'},
  {id:'indigo',name:'Indigo',desc:'Bleu-violet profond et net.'},
  {id:'skyline',name:'Skyline',desc:'Bleu ciel moderne avec lignes urbaines.'},
  {id:'graphite',name:'Graphite',desc:'Graphite mat discret et premium.'},
  {id:'pearl',name:'Pearl',desc:'Blanc nacré raffiné.'},
  {id:'neonwave',name:'Neon Wave',desc:'Rubans néon bleus et roses.'},
  {id:'moka',name:'Moka',desc:'Brun moka avec reflet caramel.'},
  {id:'glacier',name:'Glacier',desc:'Blanc glacé bleu très propre.'},
  {id:'sakura',name:'Sakura',desc:'Rose tendre inspiré des pétales.'},
  {id:'copper',name:'Copper',desc:'Cuivre chaleureux légèrement brillant.'},
  {id:'matrix',name:'Matrix',desc:'Vert techno sur fond sombre.'},
  {id:'royal',name:'Royal Blue',desc:'Bleu royal avec relief chic.'},
  {id:'bubblegum',name:'Bubblegum',desc:'Rose pop plein d’énergie.'},
  {id:'volt',name:'Volt',desc:'Jaune électrique futuriste.'},
  {id:'dune',name:'Dune',desc:'Beige désert adouci.'},
  {id:'eclipse',name:'Eclipse',desc:'Noir et halo lunaire.'},
  {id:'monaco',name:'Monaco Red',desc:'Rouge sport chic.'},
  {id:'pixel',name:'Pixel Grid',desc:'Motif numérique discret et moderne.'},
  {id:'tropical',name:'Tropical',desc:'Dégradé exotique vert-bleu-jaune.'},
  {id:'crimson',name:'Crimson',desc:'Rouge bordeaux profond.'},
  {id:'smoke',name:'Smoke',desc:'Gris fumée moderne et minimal.'},
  {id:'prism',name:'Prism',desc:'Reflets multicolores premium.'},
  {id:'arctic',name:'Arctic Blue',desc:'Bleu arctique lumineux et net.'}
];
let currentCardDesign='classic';
let editingSavedCardIndex=-1;
let currentClientTab='home';
let deliveryInProgress=false;
let deliveryMiniVisible=false;
let deliveryFinishTimer=null;
let deliveryStageTimer=null;
let lastCATrendBase=null;
let lastOrderSummary=null;
let clientNavDragActive=false;
let clientNavDragIndex=0;


const DRIVER_INITIAL_COLORS=['#007aff','#34c759','#ff9500','#ff3b30','#af52de','#5856d6','#ff2d55','#00c7be','#8e8e93','#bf5af2','#30d158','#ffd60a'];
const DRIVER_INITIAL_LETTERS='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
function driverInitialColor(letter){
  let code=(letter||'L').toUpperCase().charCodeAt(0)-65;
  return DRIVER_INITIAL_COLORS[Math.max(0,code)%DRIVER_INITIAL_COLORS.length];
}
function driverInitialAvatar(letter){
  letter=(letter||'L').toUpperCase().replace(/[^A-Z]/g,'').charAt(0)||'L';
  const color=driverInitialColor(letter);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#0b1220"/></linearGradient></defs><rect width="120" height="120" rx="60" fill="url(#g)"/><text x="60" y="74" text-anchor="middle" font-size="52" font-family="Arial, sans-serif" font-weight="900" fill="white">${letter}</text></svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
function getDriverInitialFromName(name){ return (name||'L').trim().toUpperCase().replace(/[^A-Z]/g,'').charAt(0)||'L'; }
const DEFAULT_DRIVER_PHOTO=driverInitialAvatar('L');

// État carte paiement
let selectedSavedCardIndex=-1;
let showingNewCardForm=true;

// =============================================
// INIT DOM
// =============================================
document.addEventListener("DOMContentLoaded", function() {
  initAvatarsUI();
  initCardInputListeners();
  initLiquidGlassNav();
  renderCardDesignPicker();
  startSimpleIntro();
});

setInterval(() => {
  let el = document.getElementById('viewerCount');
  if(el) el.innerText = Math.floor(Math.random()*(130-45+1))+45;
}, 3500);

// =============================================
// LISTENERS CARTE BANCAIRE
// =============================================
function initCardInputListeners() {
  let numEl = document.getElementById('cardNumber');
  let holderEl = document.getElementById('cardHolder');
  let expiryEl = document.getElementById('cardExpiry');
  let cvvEl = document.getElementById('cardCVV');

  numEl.addEventListener('input', function() {
    let raw = this.value.replace(/\D/g,'').substring(0,16);
    let groups = [];
    for(let i=0;i<raw.length;i+=4) groups.push(raw.substring(i,i+4));
    this.value = groups.join(' ');
    updatePaymentCardPreview();
  });

  holderEl.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
    updatePaymentCardPreview();
  });

  expiryEl.addEventListener('keydown', function(e) {
    if(e.key==='Backspace') return;
    if(!/\d/.test(e.key)&&e.key!=='Tab'&&e.key!=='ArrowLeft'&&e.key!=='ArrowRight') e.preventDefault();
  });

  expiryEl.addEventListener('input', function() {
    let raw = this.value.replace(/\D/g,'').substring(0,4);
    this.value = raw.length>=3 ? raw.substring(0,2)+'/'+raw.substring(2) : raw;
    updatePaymentCardPreview();
  });

  cvvEl.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g,'').substring(0,3);
    updatePaymentCardPreview();
  });

  [numEl, holderEl, expiryEl].forEach(el=>el.addEventListener('focus', ()=>setPaymentCardFace('front')));
  cvvEl.addEventListener('focus', ()=>setPaymentCardFace('back'));
}

// =============================================
// CARTES SAUVEGARDÉES DANS LE PANNEAU PAIEMENT

// =============================================
// CARTES SAUVEGARDÉES DANS LE PANNEAU PAIEMENT
// =============================================
function renderSavedCardsInPayment() {
  let zone = document.getElementById('savedCardsPayZone');
  let list = document.getElementById('savedCardsPayList');
  if(!reglages.savedCards||reglages.savedCards.length===0) {
    zone.style.display='none';
    showNewCardForm(true);
    updatePaymentCardPreview();
    return;
  }
  zone.style.display='block';
  list.innerHTML = reglages.savedCards.map((c,i) => `
    <div class="saved-card-select-item ${selectedSavedCardIndex===i?'selected-card':''}" onclick="selectSavedCard(${i})">
      ${savedCardMiniHtml(c).replace('<div class="saved-card-mini',`<div onclick="openSavedCardDesignPicker(${i},event)" title="Changer le design" class="saved-card-mini`)}
      <div class="saved-card-info">
        <div class="saved-card-name">${c.type} •••• ${c.last4}</div>
        <div class="saved-card-sub">${c.holder} — Exp. ${c.expiry}${c.design?` • ${getCardDesignName(c.design)}`:''}</div>
      </div>
      ${selectedSavedCardIndex===i?'<div class="saved-card-check">✓</div>':''}
    </div>`).join('');
  if(selectedSavedCardIndex>=0) showNewCardForm(false);
  else showNewCardForm(true);
  updatePaymentCardPreview();
}

window.selectSavedCard = function(index) {
  selectedSavedCardIndex = selectedSavedCardIndex===index ? -1 : index;
  showNewCardForm(selectedSavedCardIndex<0);
  if(selectedSavedCardIndex>=0 && reglages.savedCards[selectedSavedCardIndex]?.design){
    currentCardDesign = normalizeCardDesignId(reglages.savedCards[selectedSavedCardIndex].design);
  }
  renderSavedCardsInPayment();
};

function showNewCardForm(show) {
  document.getElementById('newCardForm').style.display = show?'block':'none';
  let toggle = document.getElementById('toggleNewCardBtn');
  if(reglages.savedCards&&reglages.savedCards.length>0) {
    toggle.innerText = show?'✕ Annuler nouvelle carte':'➕ Utiliser une nouvelle carte';
  }
  showingNewCardForm = show;
  if(show && window.currentUser && window.currentUser.role!=='admin') currentCardDesign = window.currentUser.selectedCardDesign || currentCardDesign || 'classic';
  updatePaymentCardPreview();
}

window.toggleNewCardForm = function() {
  if(showingNewCardForm) {
    selectedSavedCardIndex = reglages.savedCards.length>0?0:-1;
    showNewCardForm(false);
  } else {
    selectedSavedCardIndex = -1;
    showNewCardForm(true);
  }
  renderSavedCardsInPayment();
};

// =============================================
// CARTE 3D & DESIGNS
// =============================================
function getCardDesignName(id){
  let d=CARD_DESIGNS.find(x=>x.id===id);
  return d?d.name:'Bleu Lago';
}
function normalizeCardDesignId(id){
  return CARD_DESIGNS.some(d=>d.id===id) ? id : 'classic';
}
function savedCardMiniHtml(card){
  let design=normalizeCardDesignId(card&&card.design);
  let last4=(card&&card.last4)?card.last4:'0000';
  return `<div class="saved-card-mini ${design}"><span>•••• ${last4}</span></div>`;
}
function getCurrentCardType(rawNumber){
  let num=(rawNumber||'').replace(/\D/g,'');
  if(num.startsWith('4')) return 'Visa';
  if(num.startsWith('5')) return 'Mastercard';
  if(num.startsWith('3')) return 'Amex';
  return 'CB';
}
function applyCardDesignClass(designId){
  let scene=document.getElementById('cardDisplayScene');
  if(!scene) return;
  scene.className='card-display card-scene card-design-'+normalizeCardDesignId(designId);
}
function getPreviewCardData(){
  if(selectedSavedCardIndex>=0 && reglages.savedCards && reglages.savedCards[selectedSavedCardIndex]){
    let c=reglages.savedCards[selectedSavedCardIndex];
    return {
      number:`•••• •••• •••• ${c.last4}`,
      holder:c.holder || 'VOTRE NOM',
      expiry:c.expiry || 'MM/AA',
      cvv:'•••',
      last4:c.last4 || '0000',
      type:c.type || 'CB',
      design:normalizeCardDesignId(c.design || currentCardDesign)
    };
  }
  let raw=(document.getElementById('cardNumber')?.value || '').replace(/\D/g,'').substring(0,16);
  let padded=raw.padEnd(16,'•');
  let dg=[];
  for(let i=0;i<padded.length;i+=4) dg.push(padded.substring(i,i+4));
  let holder=(document.getElementById('cardHolder')?.value || '').trim().toUpperCase() || 'VOTRE NOM';
  let expiry=(document.getElementById('cardExpiry')?.value || '').trim() || 'MM/AA';
  let cvv=(document.getElementById('cardCVV')?.value || '').trim();
  return {
    number:dg.join(' '),
    holder,
    expiry,
    cvv: cvv ? cvv.padEnd(3,'•') : '•••',
    last4: raw ? raw.slice(-4).padStart(4,'0') : '0000',
    type: getCurrentCardType(raw),
    design: currentCardDesign || 'classic'
  };
}
function updatePaymentCardPreview(){
  let data=getPreviewCardData();
  currentCardDesign=normalizeCardDesignId(data.design || currentCardDesign);
  applyCardDesignClass(currentCardDesign);
  let n=document.getElementById('cardNumberDisplay'); if(n) n.innerText=data.number;
  let h=document.getElementById('cardHolderDisplay'); if(h) h.innerText=data.holder;
  let ex=document.getElementById('cardExpiryDisplay'); if(ex) ex.innerText=data.expiry;
  let cvv=document.getElementById('cardCvvDisplay'); if(cvv) cvv.innerText=data.cvv;
  let l4=document.getElementById('cardLast4Display'); if(l4) l4.innerText=data.last4;
  let brand=document.getElementById('cardBrandDisplay'); if(brand) brand.innerText=data.type;
  let backType=document.getElementById('cardBackTypeDisplay'); if(backType) backType.innerText=data.type;
  let btn=document.getElementById('cardDesignBtn'); if(btn) btn.style.display=reglages.isPremium?'flex':'none';
}
function setPaymentCardFace(face){
  let card=document.getElementById('paymentCard3D');
  if(!card) return;
  card.classList.toggle('is-flipped', face==='back');
}
window.togglePaymentCardFlip=function(e){
  if(e && e.target && e.target.closest && e.target.closest('.card-display-controls')) return;
  let card=document.getElementById('paymentCard3D');
  if(!card) return;
  card.classList.toggle('is-flipped');
};
window.openCardDesignPicker=function(e){
  if(e) e.stopPropagation();
  editingSavedCardIndex=-1;
  if(!reglages.isPremium) return alert('Les designs de carte sont réservés aux membres Lago+ 👑');
  renderCardDesignPicker();
  document.getElementById('cardDesignModal').classList.add('show');
};
window.openSavedCardDesignPicker=function(index,e){
  if(e) e.stopPropagation();
  if(!reglages.isPremium) return alert('Les designs de carte sont réservés aux membres Lago+ 👑');
  editingSavedCardIndex=index;
  if(reglages.savedCards&&reglages.savedCards[index]) currentCardDesign=normalizeCardDesignId(reglages.savedCards[index].design);
  renderCardDesignPicker();
  document.getElementById('cardDesignModal').classList.add('show');
};
window.closeCardDesignPicker=function(){
  editingSavedCardIndex=-1;
  document.getElementById('cardDesignModal').classList.remove('show');
};
window.selectCardDesign=function(id){
  let design=normalizeCardDesignId(id);
  if(editingSavedCardIndex>=0 && reglages.savedCards && reglages.savedCards[editingSavedCardIndex]){
    reglages.savedCards[editingSavedCardIndex].design=design;
    renderSavedCards();
  } else {
    currentCardDesign=design;
    if(window.currentUser && window.currentUser.role!=='admin') window.currentUser.selectedCardDesign=design;
    updatePaymentCardPreview();
  }
  renderCardDesignPicker();
  saveAll();
  closeCardDesignPicker();
};

function getCardDesignCategory(id){
  const light=['frost','lavender','mint','goldleaf','pearl','glacier','sakura','dune','citrus','volt'];
  const dark=['obsidian','midnight','polar','onyxred','graphite','matrix','eclipse','smoke','starlight'];
  const premium=['rosegold','goldleaf','prism','titanium','royal','frost','glacier','pearl','amethyst','velvet'];
  const fun=['plasma','neonwave','pixel','bubblegum','tropical','citrus','sakura','volt','coral','sunset'];
  if(light.includes(id)) return 'clair';
  if(dark.includes(id)) return 'sombre';
  if(premium.includes(id)) return 'premium';
  if(fun.includes(id)) return 'fun';
  return 'classique';
}
let currentCardDesignCategory='all';
window.filterCardDesignCategory=function(cat){ currentCardDesignCategory=cat||'all'; renderCardDesignPicker(); };
function renderCardDesignPicker(){
  let list=document.getElementById('cardDesignList');
  if(!list) return;
  let selected=(editingSavedCardIndex>=0&&reglages.savedCards&&reglages.savedCards[editingSavedCardIndex])?normalizeCardDesignId(reglages.savedCards[editingSavedCardIndex].design):currentCardDesign;
  let cats=[['all','Tous'],['classique','Classiques'],['premium','Premium'],['sombre','Sombres'],['clair','Clairs'],['fun','Fun']];
  let filtered=CARD_DESIGNS.filter(d=>currentCardDesignCategory==='all'||getCardDesignCategory(d.id)===currentCardDesignCategory);
  list.innerHTML=`<div class="card-category-row">${cats.map(c=>`<button class="card-cat-btn ${currentCardDesignCategory===c[0]?'active':''}" onclick="filterCardDesignCategory('${c[0]}')">${c[1]}</button>`).join('')}</div>`+
    filtered.map(d=>`<div class="card-design-item ${selected===d.id?'selected':''}" onclick="selectCardDesign('${d.id}')"><div class="card-design-preview ${d.id}"></div><div class="card-design-copy"><strong>${d.name}</strong><span>${d.desc}</span></div>${selected===d.id?'<div class="card-design-check">✓</div>':''}</div>`).join('');
  renderClientStats();
}

document.addEventListener('click', function(e){
  let modal=document.getElementById('cardDesignModal');
  if(modal && e.target===modal) closeCardDesignPicker();
});

window.openLagoPlusModal=function(){
  if(!reglages.isPremium) return;
  let bal=document.getElementById('lagoPlusBalance');
  if(bal) bal.innerText=(reglages.cagnotte||0).toFixed(2);
  let stats=document.getElementById('lagoPlusStats');
  if(stats){
    let orders=(reglages.historiqueCommandes||[]).length;
    let saved=Math.round(((reglages.historiqueCommandes||[]).reduce((a,c)=>a+(Number(c.prix)||0),0)*0.15)*100)/100;
    stats.innerHTML=`<div><strong>${orders}</strong><span>commandes</span></div><div><strong>${saved.toFixed(2)}€</strong><span>économies estimées</span></div><div><strong>${(reglages.cagnotteSpent||0).toFixed(2)}€</strong><span>cagnotte utilisée</span></div>`;
  }
  document.getElementById('lagoPlusModal').classList.add('active');
};
window.closeLagoPlusModal=function(){ document.getElementById('lagoPlusModal').classList.remove('active'); };

function promoTargetLabel(t){ return t==='all'?'Tous les matelas':t; }
function promoUsageLabel(){
  normalizePromoConfig();
  let limit=Number(reglages.promoConfig.usageLimit||999);
  let used=Number(reglages.promoConfig.usageCount||0);
  if(limit>=999) return 'Illimité';
  return `${Math.max(0,limit-used)}/${limit} utilisations restantes`;
}
function syncPromoAdminUI(){
  normalizePromoConfig();
if(!Array.isArray(reglages.adminActionLog)) reglages.adminActionLog=[];
  let code=document.getElementById('adminPromoCodeStr'); if(code) code.value=reglages.promoConfig.code;
  let val=document.getElementById('adminPromoValue'); if(val) val.value=reglages.promoConfig.percent;
  let prev=document.getElementById('adminPromoPreview');
  if(prev) prev.innerText=`${reglages.promoConfig.active?'✅':'⛔'} ${reglages.promoConfig.code} • -${reglages.promoConfig.percent}% • ${promoTargetLabel(reglages.promoConfig.target)} • ${promoUsageLabel()}`;
}
window.openPromoBuilder=function(){
  normalizePromoConfig();
  document.getElementById('promoBuilderCode').value=reglages.promoConfig.code;
  let pct=String(reglages.promoConfig.percent);
  let select=document.getElementById('promoBuilderValue');
  let has=[...select.options].some(o=>o.value===pct);
  select.value=has?pct:'custom';
  document.getElementById('promoBuilderCustom').style.display=has?'none':'block';
  document.getElementById('promoBuilderCustom').value=has?'':reglages.promoConfig.percent;
  document.getElementById('promoBuilderTarget').value=reglages.promoConfig.target;
  let usageSel=document.getElementById('promoBuilderUsage');
  if(usageSel){
    let lim=String(reglages.promoConfig.usageLimit||999);
    let usageHas=[...usageSel.options].some(o=>o.value===lim);
    usageSel.value=usageHas?lim:'custom';
    let custom=document.getElementById('promoBuilderUsageCustom');
    custom.style.display=usageHas?'none':'block';
    custom.value=usageHas?'':(reglages.promoConfig.usageLimit||1);
  }
  document.getElementById('promoBuilderActive').value=String(reglages.promoConfig.active);
  document.getElementById('promoBuilderModal').classList.add('active');
};
window.closePromoBuilder=function(){ document.getElementById('promoBuilderModal').classList.remove('active'); };
window.togglePromoCustom=function(){ document.getElementById('promoBuilderCustom').style.display=document.getElementById('promoBuilderValue').value==='custom'?'block':'none'; };
window.togglePromoUsageCustom=function(){ let el=document.getElementById('promoBuilderUsageCustom'); if(el) el.style.display=document.getElementById('promoBuilderUsage').value==='custom'?'block':'none'; };
window.savePromoBuilder=function(){
  let code=(document.getElementById('promoBuilderCode').value||'FREROT').trim().toUpperCase();
  let raw=document.getElementById('promoBuilderValue').value;
  let percent=raw==='custom'?Number(document.getElementById('promoBuilderCustom').value):Number(raw);
  let usageRaw=document.getElementById('promoBuilderUsage')?document.getElementById('promoBuilderUsage').value:'999';
  let usageLimit=usageRaw==='custom'?Number(document.getElementById('promoBuilderUsageCustom').value):Number(usageRaw);
  percent=Math.max(1,Math.min(100,percent||20));
  usageLimit=Math.max(1,Math.min(999,usageLimit||1));
  reglages.promoConfig={code,percent,target:document.getElementById('promoBuilderTarget').value,active:document.getElementById('promoBuilderActive').value==='true',usageLimit,usageCount:0};
  reglages.promoCodeStr=code; reglages.promoValue=percent;
  addAdminActionLog(`Promo ${code} sauvegardée`,0);
  syncPromoAdminUI(); closePromoBuilder(); saveAll(); updateCart();
};
function registerPromoUsageIfNeeded(){
  if(!promoActive || !reglages.promoConfig || !reglages.promoConfig.active) return;
  if(computePromoDiscount()<=0) return;
  normalizePromoConfig();
  reglages.promoConfig.usageCount=(Number(reglages.promoConfig.usageCount)||0)+1;
  if(reglages.promoConfig.usageLimit<999 && reglages.promoConfig.usageCount>reglages.promoConfig.usageLimit) reglages.promoConfig.usageCount=reglages.promoConfig.usageLimit;
  syncPromoAdminUI();
}
function computePromoDiscount(){
  if(!promoActive || !reglages.promoConfig || !reglages.promoConfig.active) return 0;
  let target=reglages.promoConfig.target||'all';
  let base=0;
  cart.forEach(c=>{ if(target==='all'||c.name===target){ let bp=(c.basePrice!=null)?Number(c.basePrice):(Number(c.price||0)-((c.options||[]).reduce((a,o)=>a+Number(o.price||0),0))); base+=Math.max(0,bp)*Number(c.qty||1); } });
  if(base<=0) return 0;
  return Math.round(base*(Number(reglages.promoConfig.percent)||0)/100*100)/100;
}


// =============================================
// NAV GLASS DRAG
// =============================================
function updateClientNavIndicator(){
  let nav=document.getElementById('clientNav');
  if(!nav) return;
  let buttons=[...nav.querySelectorAll('.navBtn')];
  let idx=buttons.findIndex(b=>b.classList.contains('active'));
  if(idx<0) idx=0;
  clientNavDragIndex=idx;
  let indicator=document.getElementById('clientNavIndicator');
  if(indicator) indicator.style.transform=`translateX(${idx*100}%)`;
}
function applyClientTabByIndex(index){
  let nav=document.getElementById('clientNav');
  if(!nav) return;
  let buttons=[...nav.querySelectorAll('.navBtn')];
  index=Math.max(0,Math.min(buttons.length-1,index));
  if(CLIENT_TABS[index]!==currentClientTab){
    switchClientTab(CLIENT_TABS[index], buttons[index]);
  } else {
    buttons.forEach((b,i)=>b.classList.toggle('active',i===index));
    updateClientNavIndicator();
  }
}
function getClientNavIndexFromX(x){
  let nav=document.getElementById('clientNav');
  if(!nav) return 0;
  let rect=nav.getBoundingClientRect();
  let rel=Math.min(rect.width-1, Math.max(0, x-rect.left));
  return Math.max(0, Math.min(2, Math.floor((rel/rect.width)*3)));
}
function initLiquidGlassNav(){
  let nav=document.getElementById('clientNav');
  if(!nav) return;
  updateClientNavIndicator();
  nav.addEventListener('pointerdown', e=>{
    if(reglages.theme!=='glass') return;
    clientNavDragActive=true;
    nav.classList.add('dragging');
    applyClientTabByIndex(getClientNavIndexFromX(e.clientX));
  });
  window.addEventListener('pointermove', e=>{
    if(!clientNavDragActive || reglages.theme!=='glass') return;
    applyClientTabByIndex(getClientNavIndexFromX(e.clientX));
  });
  window.addEventListener('pointerup', ()=>{
    if(!clientNavDragActive) return;
    clientNavDragActive=false;
    nav.classList.remove('dragging');
    updateClientNavIndicator();
  });
};


// =============================================
// DONNÉES FAKE

// =============================================
// DONNÉES FAKE
// =============================================
function initFakeData() {
  const prenoms=["Karim","Mouloud","Cédric","Yanis","Mamadou","Sofiane","Lucas","Enzo","Hugo","Idriss","Thomas","Marie","Léa","Sarah","Antoine","Julien"];
  const emails=["gmail.com","yahoo.fr","hotmail.com","outlook.fr"];
  const bios=["Aime rouler vite et la drill.","Toujours à l'heure, sourire en prime.","Ancien pilote de karting.","Connaît Tours comme sa poche.","Le boss de la livraison de nuit.","Pro du créneau en 2 secondes.","Ne dort jamais."];
  for(let i=0;i<150;i++){
    let name=prenoms[Math.floor(Math.random()*prenoms.length)].toLowerCase();
    let isFakeVip=i<5;
    let ava=isFakeVip?avatarsPremium[Math.floor(Math.random()*avatarsPremium.length)]:avatarsStandard[Math.floor(Math.random()*avatarsStandard.length)];
    fakeUsers.push({id:i,email:`${name}${Math.floor(Math.random()*99)}@${emails[Math.floor(Math.random()*emails.length)]}`,password:"123",isVip:isFakeVip,vipSource:isFakeVip?'purchased':null,orders:0,signupDate:`0${Math.floor(Math.random()*9)+1}/01/2026`,banni:false,historique:[],theme:"dark",avatarUrl:ava,cagnotte:0,cagnotteSpent:0,moisCoussinGratuit:null,referrals:[],referralClaimed:false,savedCards:[],selectedCardDesign:'classic'});
  }
  fakeUsers.push({id:999,email:"client@gmail.com",password:"123",isVip:false,vipSource:null,orders:0,signupDate:"12/01/2026",banni:false,historique:[],theme:"dark",avatarUrl:avatarsStandard[0],cagnotte:0,cagnotteSpent:0,moisCoussinGratuit:null,referrals:[],referralClaimed:false,savedCards:[],selectedCardDesign:'classic'});
  for(let i=0;i<100;i++){
    let isActive=i<30;
    drivers.push({id:i,name:prenoms[i%prenoms.length]+" "+String.fromCharCode(65+(i%26))+".",bio:bios[i%bios.length],rating:isActive?5.0:0,votes:isActive?1:0,isPro:false,fired:false,photo:`https://randomuser.me/api/portraits/men/${(i%99)+1}.jpg`,hireDate:isActive?"01/01/2026":null,totalOrders:0,status:isActive?"En attente":"Non recruté",tips:0,earnings:0,comments:[],lat:TOURS_LAT-0.02+Math.random()*0.04,lng:TOURS_LNG-0.03+Math.random()*0.06});
  }
  reglages.caTotal=2500; reglages.totalOrders=85;
}

function initDefaultDrivers() {
  const prenoms=["Karim","Mouloud","Cédric","Yanis","Mamadou","Sofiane","Lucas","Enzo","Hugo","Idriss","Thomas","Marie","Léa","Sarah","Antoine","Julien"];
  const bios=["Aime rouler vite et la drill.","Toujours à l'heure, sourire en prime.","Ancien pilote de karting.","Connaît Tours comme sa poche.","Le boss de la livraison de nuit.","Pro du créneau en 2 secondes.","Ne dort jamais."];
  drivers=[];
  for(let i=0;i<100;i++){
    let isActive=i<30;
    drivers.push({id:i,name:prenoms[i%prenoms.length]+" "+String.fromCharCode(65+(i%26))+".",bio:bios[i%bios.length],rating:isActive?5.0:0,votes:isActive?1:0,isPro:false,fired:false,photo:`https://randomuser.me/api/portraits/men/${(i%99)+1}.jpg`,hireDate:isActive?"01/01/2026":null,totalOrders:0,status:isActive?"En attente":"Non recruté",tips:0,earnings:0,comments:[],lat:TOURS_LAT-0.02+Math.random()*0.04,lng:TOURS_LNG-0.03+Math.random()*0.06});
  }
}


function buildFakeDriverForm(d){
  const vehicles=['Voiture','Scooter','Vélo','À pied'];
  const avail=['Soir','Week-end','Tous les jours','Après les cours','Vacances seulement'];
  const areas=['Centre-ville','Autour de Tours','Petits trajets','Longs trajets','Peu importe'];
  const exp=['Débutant motivé','Déjà livreur','Habitué des trajets en ville','Ancien coursier'];
  let idx=(d.id||0);
  let parts=(d.name||'Candidat Lago').split(' ');
  return {
    id:'fake-'+idx,
    email:d.email||`candidat${idx}@lago.fake`,
    photo:d.photo||driverInitialAvatar(parts[0]?.charAt(0)||'L'),
    firstName:parts[0]||'Candidat',
    lastName:parts[1]||'Lago',
    age:18+(idx%19),
    city:['Tours','Joué-lès-Tours','Saint-Cyr','La Riche','Chambray'][idx%5],
    phone:`07 ${String(10+idx%80)} ${String(20+idx%70)} ${String(30+idx%60)} ${String(40+idx%50)}`,
    experience:exp[idx%exp.length],
    vehicle:vehicles[idx%vehicles.length],
    availability:avail[idx%avail.length],
    area:areas[idx%areas.length],
    heavy:['Oui, sans problème','Oui, avec aide si besoin','Plutôt les petits lits'][idx%3],
    motivation:d.bio||'Je suis motivé, ponctuel et disponible pour livrer les clients Lago rapidement.',
    notes:'Profil disponible pour recrutement.',
    createdAt:'Simulation'
  };
}
function ensureDriverDataConsistency(){
  if(!Array.isArray(reglages.driverApplications)) reglages.driverApplications=[];
  drivers.forEach((d,i)=>{
    if(!d.photo) d.photo=driverInitialAvatar((d.name||'L').charAt(0));
    if(!d.email) d.email=`driver${d.id||i}@lago.fake`;
    if(!d.password) d.password='123';
    if(!d.status) d.status=i<12?'En attente':'Non recruté';
    if(!d.fakeForm) d.fakeForm=buildFakeDriverForm(d);
  });
}

try {
  try{ localStorage.removeItem(LEGACY_STORAGE_KEY); }catch(_e){}
  let save=sessionStorage.getItem(APP_STORAGE_KEY);
  if(save){
    reglages=JSON.parse(save);
    if(!reglages.savedCards) reglages.savedCards=[];
    if(reglages.users&&reglages.users.length>0) fakeUsers=reglages.users;
    else { initFakeData(); reglages.users=fakeUsers; }
    if(Array.isArray(reglages.drivers)&&reglages.drivers.length>0) drivers=reglages.drivers;
    else if(drivers.length===0) initDefaultDrivers();
  } else { initFakeData(); reglages.users=fakeUsers; reglages.drivers=drivers; }
} catch(e) { initFakeData(); reglages.users=fakeUsers; reglages.drivers=drivers; }
if(drivers.length===0) initDefaultDrivers();
reglages.drivers=drivers;
if(!Array.isArray(reglages.driverApplications)) reglages.driverApplications=[];
if(typeof reglages.driverRecruitmentClosed!=='boolean') reglages.driverRecruitmentClosed=false;
ensureDriverDataConsistency();

function normalizeUsersCards() {
  if(Array.isArray(reglages.savedCards)) reglages.savedCards.forEach(c=>{ if(!c.design) c.design='classic'; c.design=normalizeCardDesignId(c.design); });
  if(!Array.isArray(fakeUsers)) return;
  fakeUsers.forEach(u=>{
    if(!Array.isArray(u.savedCards)) u.savedCards=[];
    u.savedCards.forEach(c=>{ if(!c.design) c.design='classic'; c.design=normalizeCardDesignId(c.design); });
    if(!u.selectedCardDesign) u.selectedCardDesign='classic';
  });
}
normalizeUsersCards();
function normalizePromoConfig(){
  if(!reglages.promoConfig){
    reglages.promoConfig={code:reglages.promoCodeStr||"FREROT",percent:20,target:"all",active:true,usageLimit:999,usageCount:0};
  }
  reglages.promoConfig.code=(reglages.promoConfig.code||reglages.promoCodeStr||"FREROT").toUpperCase();
  reglages.promoConfig.percent=Math.max(1,Math.min(100,Number(reglages.promoConfig.percent)||20));
  reglages.promoConfig.target=reglages.promoConfig.target||"all";
  reglages.promoConfig.active=reglages.promoConfig.active!==false;
  reglages.promoConfig.usageLimit=Math.max(1,Math.min(999,Number(reglages.promoConfig.usageLimit)||999));
  reglages.promoConfig.usageCount=Math.max(0,Number(reglages.promoConfig.usageCount)||0);
  reglages.promoCodeStr=reglages.promoConfig.code;
  reglages.promoValue=reglages.promoConfig.percent;
}
normalizePromoConfig();
function normalizeAllData(){
  normalizeUsersCards();
  normalizePromoConfig();
  ensureDriverDataConsistency();
  if(!Array.isArray(reglages.historiqueCommandes)) reglages.historiqueCommandes=[];
  if(!Array.isArray(reglages.adminActionLog)) reglages.adminActionLog=[];
  if(!Array.isArray(reglages.driverApplications)) reglages.driverApplications=[];
  reglages.theme=reglages.theme||'dark';
  reglages.avatarUrl=reglages.avatarUrl||avatarsStandard[0];
  return true;
}
normalizeAllData();

function saveAll() {
  if(window.currentUser&&window.currentUser.role!=="admin") {
    let u=fakeUsers.find(x=>x.email===window.currentUser.email);
    if(u){u.isVip=reglages.isPremium;u.theme=reglages.theme;u.cagnotte=reglages.cagnotte;u.historique=reglages.historiqueCommandes;u.avatarUrl=reglages.avatarUrl;u.referrals=reglages.referrals;u.referralClaimed=reglages.referralClaimed;u.cagnotteSpent=reglages.cagnotteSpent;u.savedCards=Array.isArray(reglages.savedCards)?reglages.savedCards:[];u.selectedCardDesign=currentCardDesign||'classic';}
  }
  reglages.selectedCardDesign=currentCardDesign||'classic';
  reglages.users=fakeUsers;
  reglages.drivers=drivers;
  sessionStorage.setItem(APP_STORAGE_KEY,JSON.stringify(reglages));
}

// =============================================
// ===== FIX #1 : DÉCONNEXION =================
// logOut() est appelé en onclick direct sur les deux boutons
// Elle remet tout à zéro et affiche l'écran de connexion

function cleanupDeliveryTimers(){
  if(deliveryStageTimer){ clearTimeout(deliveryStageTimer); deliveryStageTimer=null; }
  if(deliveryFinishTimer){ clearTimeout(deliveryFinishTimer); deliveryFinishTimer=null; }
  if(window.etaInt){ clearInterval(window.etaInt); window.etaInt=null; }
}
function resetUiState(){
  cleanupDeliveryTimers();
  deliveryInProgress=false; deliveryMiniVisible=false;
  hideDeliveryMiniBubble();
  ['paymentOverlay','processingOverlay','paySuccessOverlay','gpsModal','debugModal','cardDesignModal','lagoPlusModal','orderSummaryModal','driverRecruitmentModal','driverCandidateModal'].forEach(id=>{
    let el=document.getElementById(id);
    if(el){ el.classList.remove('show','active'); if(id==='gpsModal') el.style.display='none'; }
  });
  pendingPaymentCallback=null; selectedSavedCardIndex=-1; showingNewCardForm=true;
}
// =============================================
window.logOut = function(force=false) {
  if(logoutInProgress) return;
  logoutInProgress=true;
  try {
    stopBot();
    if(!force) saveAll();
    resetUiState();
    if(mapInitialized && mapAdmin) { try{ mapAdmin.remove(); }catch(_e){} mapAdmin=null; mapInitialized=false; }
    if(mapClient) { try{ mapClient.remove(); }catch(_e){} mapClient=null; }

    window.currentUser=null;
    window.currentDriver=null;
    currentDeliveryDriver=null;
    pendingPaymentCallback=null;
    selectedSavedCardIndex=-1;
    showingNewCardForm=true;
    currentCardDesign='classic';
    cart=[]; selectedMattress=null; promoActive=false; currentTip=0; currentClientRating=0; currentCagnotteDeduction=0;

    document.body.className='';
    ['paymentOverlay','processingOverlay','paySuccessOverlay','gpsModal','debugModal'].forEach(id=>{
      let el=document.getElementById(id);
      if(el){ el.classList.remove('show','active'); if(id==='gpsModal') el.style.display='none'; }
    });

    let client=document.getElementById('clientApp'); if(client) client.style.display='none';
    let admin=document.getElementById('adminApp'); if(admin) admin.style.display='none';
    let driverApp=document.getElementById('driverApp'); if(driverApp) driverApp.style.display='none';

    let email=document.getElementById('loginEmail'); if(email) email.value='';
    let pass=document.getElementById('loginPassword'); if(pass) pass.value='';

    let nav=document.getElementById('clientNav'); if(nav) nav.style.display='flex';
    if(client){
      client.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
      let home=document.getElementById('home'); if(home) home.classList.add('active');
      client.querySelectorAll('.navBtn').forEach((b,i)=>b.classList.toggle('active',i===0));
    }
    if(admin){
      admin.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
      let st=document.getElementById('admSettings'); if(st) st.classList.add('active');
      admin.querySelectorAll('.navBtn').forEach((b,i)=>b.classList.toggle('active',i===0));
    }
    currentClientTab='home';
    updateClientNavIndicator();

    let auth=document.getElementById('authScreen');
    if(auth){
      auth.style.opacity='0';
      auth.style.display='flex';
      setTimeout(()=>{ auth.style.opacity='1'; logoutInProgress=false; },60);
    } else logoutInProgress=false;
  } catch(err) {
    console.error('Erreur logout', err);
    logoutInProgress=false;
    location.reload();
  }
};

window.forceAdminLogout=function(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  window.logOut(true);
  return false;
};



function addAdminActionLog(label, amount=0){
  if(!Array.isArray(reglages.adminActionLog)) reglages.adminActionLog=[];
  let now=new Date();
  let hh=String(now.getHours()).padStart(2,'0');
  let mm=String(now.getMinutes()).padStart(2,'0');
  reglages.adminActionLog.unshift({time:`${hh}:${mm}`,label,amount:Number(amount)||0});
  reglages.adminActionLog=reglages.adminActionLog.slice(0,12);
  renderDebugActionLog();
}
function renderDebugActionLog(){
  let box=document.getElementById('debugActionLog');
  if(!box) return;
  let log=Array.isArray(reglages.adminActionLog)?reglages.adminActionLog:[];
  if(log.length===0){ box.innerHTML='<div class="debug-log-empty">Aucune action patron pour le moment.</div>'; return; }
  box.innerHTML=log.map(a=>{
    let cls=a.amount<0?'loss':(a.amount>0?'gain':'neutral');
    let sign=a.amount>0?`↗ +${a.amount.toFixed(2)} €`:(a.amount<0?`↘ ${a.amount.toFixed(2)} €`:'•');
    return `<div class="debug-log-row ${cls}"><span>${a.time} — ${a.label}</span><strong>${sign}</strong></div>`;
  }).join('');
}

// =============================================
// DEBUG DISCRET PATRON
// =============================================
window.openDebugPanel=function(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  debugRefreshStatus();
  document.getElementById('debugModal').classList.add('active');
};
window.closeDebugPanel=function(){ document.getElementById('debugModal').classList.remove('active'); };
window.debugRefreshStatus=function(){
  let el=document.getElementById('debugStatus'); if(!el) return;
  let user=window.currentUser?window.currentUser.email:(window.currentDriver?window.currentDriver.email:'aucun');
  let cards=Array.isArray(reglages.savedCards)?reglages.savedCards.length:0;
  let promo=reglages.promoConfig?`${reglages.promoConfig.code} • ${reglages.promoConfig.usageLimit>=999?'∞':Math.max(0,reglages.promoConfig.usageLimit-reglages.promoConfig.usageCount)} restantes`:'aucune';
  let candidates=(drivers||[]).filter(d=>d.status==='Non recruté').length;
  el.innerHTML=`<b>Version :</b> ${APP_VERSION}<br><b>Utilisateur :</b> ${user}<br><b>Lago+ :</b> ${reglages.isPremium?'oui':'non'}<br><b>Thème :</b> ${reglages.theme}<br><b>Panier :</b> ${cart.length} élément(s)<br><b>Paiement :</b> ${pendingPaymentCallback?'en attente':'repos'}<br><b>Livraison :</b> ${deliveryInProgress?'en cours':'aucune'}<br><b>Promo :</b> ${promo}<br><b>Cartes session :</b> ${cards}<br><b>Recrutements :</b> ${candidates} candidat(s)<br><b>Livreurs :</b> ${drivers.filter(d=>!d.fired&&d.status!=="Non recruté").length} actifs`;
  renderDebugActionLog();
};
window.debugClearCart=function(){
  if(!confirm('Vider le panier de test ?')) return;
  cart=[]; selectedMattress=null; promoActive=false; currentTip=0; currentCagnotteDeduction=0;
  document.querySelectorAll('.mattress,.option,.tip-btn').forEach(el=>el.classList.remove('selected'));
  updateCart(); debugRefreshStatus();
};
window.debugAddTestCard=function(){
  if(!Array.isArray(reglages.savedCards)) reglages.savedCards=[];
  reglages.savedCards.push({type:'Visa',last4:String(Math.floor(1000+Math.random()*9000)),holder:'TEST LAGO',expiry:'12/29',design:CARD_DESIGNS[Math.floor(Math.random()*CARD_DESIGNS.length)].id});
  normalizeAllData(); renderSavedCards(); saveAll(); debugRefreshStatus();
};
window.debugAddTestOrder=function(){
  if(!Array.isArray(reglages.historiqueCommandes)) reglages.historiqueCommandes=[];
  reglages.historiqueCommandes.push({id:Date.now(),date:new Date().toLocaleDateString('fr-FR'),prix:29.99,items:'Commande test',status:'Terminée'});
  mettreAJourHistorique(); renderClientStats(); saveAll(); debugRefreshStatus();
};
window.debugToggleVip=function(){
  reglages.isPremium=!reglages.isPremium;
  if(window.currentUser&&window.currentUser.role!=='admin') window.currentUser.isVip=reglages.isPremium;
  appliquerAvatarEtPremium(); appliquerThemeEtPremium(); mettreAJourVitrine(); updateCart(); saveAll(); debugRefreshStatus();
};
window.debugResetSession=function(){ if(!confirm('Remettre la session à zéro ?')) return; 
  try{ sessionStorage.removeItem(APP_STORAGE_KEY); localStorage.removeItem(LEGACY_STORAGE_KEY); }catch(_e){}
  location.reload();
};

// =============================================
// AUTH
// =============================================
window.openGooglePopup = function() { document.getElementById('googlePopupOverlay').classList.add('show'); };
window.closeGooglePopup = function(e,force=false) { if(force||e.target.id==='googlePopupOverlay') document.getElementById('googlePopupOverlay').classList.remove('show'); };
window.loginSuccess = function(email) { closeGooglePopup(null,true); setTimeout(()=>doLogin(email),300); };

window.openDriverUberPopup = function() { document.getElementById('driverUberPopupOverlay').classList.add('show'); };
window.closeDriverUberPopup = function(e,force=false) { if(force||e.target.id==='driverUberPopupOverlay') document.getElementById('driverUberPopupOverlay').classList.remove('show'); };
window.driverUberLoginSuccess = function() {
  closeDriverUberPopup(null,true);
  setTimeout(()=>{
    const email='livreur.uber@lago.app';
    let d=findDriverByEmail(email);
    if(!d){
      const newId=Math.max(0,...drivers.map(x=>x.id||0))+1;
      d={id:newId,name:'Livreur Uber',email,password:'uber',bio:'Compte livreur vierge connecté avec Uber.',rating:5.0,votes:1,isPro:false,fired:false,photo:driverInitialAvatar('L'),hireDate:new Date().toLocaleDateString('fr-FR'),totalOrders:0,status:'En attente',tips:0,earnings:0,comments:[],lat:TOURS_LAT,lng:TOURS_LNG};
      drivers.push(d);
      let app=findDriverApplication(email);
      if(!app){
        getDriverApplications().push({id:Date.now(),email,password:'uber',firstName:'Livreur',lastName:'Uber',city:'Tours',vehicle:'Compte Uber',availability:'Flexible',status:'accepted',driverId:newId,photo:d.photo,createdAt:new Date().toLocaleDateString('fr-FR')});
      }
      saveAll();
    }
    doDriverLogin(d);
  },300);
};

window.handleLoginManual = function() {
  let email=document.getElementById('loginEmail').value.trim().toLowerCase();
  let pwd=document.getElementById('loginPassword').value;
  if(!email) return alert("Entrez un email !");
  if(email==="boss@lago.app") { doLogin(email); return; }
  if(!pwd) return alert("Entrez un mot de passe !");
  if(pwd.length<3) return alert("Mot de passe trop court : mets au moins 3 caractères.");
  let existing=fakeUsers.find(u=>u.email===email);
  if(existing&&existing.password!==pwd) return alert("Mot de passe incorrect.");
  document.getElementById('captchaModal').style.display='flex';
  document.getElementById('fakeCaptchaCheck').checked=false;
  document.getElementById('fakeCaptchaCheck').onchange=function(){
    if(this.checked){
      setTimeout(()=>{
        document.getElementById('captchaModal').style.display='none';
        if(!existing){
          fakeUsers.unshift({id:fakeUsers.length+1000,email,password:pwd,isVip:false,vipSource:null,orders:0,signupDate:new Date().toLocaleDateString('fr-FR'),banni:false,historique:[],theme:"dark",avatarUrl:avatarsStandard[0],cagnotte:0,cagnotteSpent:0,moisCoussinGratuit:null,referrals:[],referralClaimed:false,savedCards:[],selectedCardDesign:'classic'});
          reglages.users=fakeUsers; sessionStorage.setItem(APP_STORAGE_KEY,JSON.stringify(reglages));
        }
        doLogin(email);
      },600);
    }
  };
};

function doLogin(email) {
  let auth=document.getElementById('authScreen');
  auth.style.opacity='0';
  setTimeout(()=>{
    auth.style.display='none';
    auth.style.opacity='1';
    if(email==="boss@lago.app"){
      window.currentUser={email:"boss@lago.app",role:"admin"};
      document.getElementById('adminApp').style.display='block';
      reglages.theme=reglages.adminTheme||"dark";
      reglages.savedCards=[];
      currentCardDesign='classic';
      document.getElementById('adminThemeSelect').value=reglages.theme;
      appliquerThemeGlobal(reglages.theme);
      mettreAJourVitrineAdmin(); renderAdminDrivers(); updateAdminStats(); renderAdminUsers(); startBot();
    } else {
      let u=fakeUsers.find(x=>x.email===email);
      window.currentUser=u;
      reglages.isPremium=u.isVip; reglages.theme=u.theme||"dark"; reglages.cagnotte=u.cagnotte||0;
      reglages.cagnotteSpent=u.cagnotteSpent||0; reglages.historiqueCommandes=u.historique||[];
      reglages.referrals=u.referrals||[]; reglages.referralClaimed=u.referralClaimed||false;
      reglages.avatarUrl=u.avatarUrl||avatarsStandard[0];
      reglages.savedCards=Array.isArray(u.savedCards)?u.savedCards:[];
      reglages.savedCards.forEach(c=>{ if(!c.design) c.design='classic'; });
      currentCardDesign=u.selectedCardDesign||'classic';
      reglages.selectedCardDesign=currentCardDesign;
      document.getElementById('clientApp').style.display='block';
      document.getElementById('clientEmailDisplay').innerText=email;
      cartDistance=(Math.random()*(6.5-0.5)+0.5).toFixed(1);
      mettreAJourVitrine(); appliquerAvatarEtPremium(); appliquerThemeEtPremium();
      mettreAJourHistorique(); renderReferrals(); updateCart(); updateClientNavIndicator(); updatePaymentCardPreview();
    }
  },300);
}


// =============================================
// AUTH LIVREUR / CANDIDATURES
// =============================================
function getDriverApplications(){
  if(!Array.isArray(reglages.driverApplications)) reglages.driverApplications=[];
  return reglages.driverApplications;
}
function normalizeDriverEmail(email){ return (email||'').trim().toLowerCase(); }
function findDriverApplication(email){ return getDriverApplications().find(a=>normalizeDriverEmail(a.email)===normalizeDriverEmail(email)); }
function findDriverByEmail(email){ return drivers.find(d=>normalizeDriverEmail(d.email)===normalizeDriverEmail(email)); }

window.showDriverAuth=function(){
  let box=document.getElementById('authFlipBox');
  if(box) box.classList.add('driver-mode');
  showDriverChoice();
};
window.resetDriverAuth=function(){
  let box=document.getElementById('authFlipBox');
  if(box) box.classList.remove('driver-mode');
  showDriverChoice();
};
window.showDriverChoice=function(){
  ['driverChoicePanel','driverLoginPanel','driverRegisterPanel'].forEach(id=>{let el=document.getElementById(id); if(el) el.classList.remove('active');});
  document.getElementById('driverChoicePanel').classList.add('active');
};
window.showDriverLogin=function(){
  ['driverChoicePanel','driverLoginPanel','driverRegisterPanel'].forEach(id=>document.getElementById(id).classList.remove('active'));
  document.getElementById('driverLoginPanel').classList.add('active');
};
window.showDriverRegister=function(){
  if(reglages.driverRecruitmentClosed) return alert('Nous ne recrutons pas pour le moment.');
  ['driverChoicePanel','driverLoginPanel','driverRegisterPanel'].forEach(id=>document.getElementById(id).classList.remove('active'));
  document.getElementById('driverRegisterPanel').classList.add('active');
};
window.submitDriverLogin=function(){
  let email=normalizeDriverEmail(document.getElementById('driverLoginEmail').value);
  let pwd=document.getElementById('driverLoginPassword').value;
  if(!email||!pwd) return alert('Entre ton email et ton mot de passe.');
  let app=findDriverApplication(email);
  let driver=findDriverByEmail(email);
  if(app && app.password!==pwd) return alert('Mot de passe incorrect.');
  if(driver && driver.password!==pwd) return alert('Mot de passe incorrect.');
  if(app && app.status==='refused') return alert('Votre demande a été refusée.');
  if(app && app.status==='pending') return alert('Votre candidature est encore en attente.');
  if((app&&app.status==='accepted') || driver){
    let d=driver || drivers.find(x=>x.id===app.driverId);
    if(!d) return alert('Compte livreur introuvable.');
    doDriverLogin(d);
    return;
  }
  alert("Aucun compte livreur accepté avec cette adresse.");
};
window.startDriverSignup=function(){
  if(reglages.driverRecruitmentClosed) return alert('Nous ne recrutons pas pour le moment.');
  let email=normalizeDriverEmail(document.getElementById('driverRegisterEmail').value);
  let pwd=document.getElementById('driverRegisterPassword').value;
  if(!email) return alert('Entre une adresse mail.');
  if(!pwd||pwd.length<3) return alert('Mot de passe trop court : mets au moins 3 caractères.');
  if(findDriverApplication(email)||findDriverByEmail(email)) return alert('Une candidature existe déjà avec cette adresse mail.');
  window.pendingDriverSignup={email,password:pwd,initial:'L',photo:driverInitialAvatar('L')};
  document.getElementById('driverCandidatePhoto').src=window.pendingDriverSignup.photo;
  document.getElementById('driverFirstName').value='';
  document.getElementById('driverFirstName').oninput=function(){ updateDriverCandidateInitialFromName(); };
  document.getElementById('driverLastName').value='';
  document.getElementById('driverAge').value='';
  document.getElementById('driverCity').value='';
  document.getElementById('driverPhone').value='';
  document.getElementById('driverExperience').value='';
  document.getElementById('driverVehicle').value='';
  document.getElementById('driverAvailability').value='';
  document.getElementById('driverArea').value='';
  document.getElementById('driverHeavy').value='';
  document.getElementById('driverMotivation').value='';
  document.getElementById('driverNotes').value='';
  renderDriverPhotoChoices();
  document.getElementById('driverRecruitStep1').classList.add('active');
  document.getElementById('driverRecruitStep2').classList.remove('active');
  document.getElementById('driverRecruitDone').classList.remove('active');
  document.getElementById('driverRecruitModal').classList.add('active');
};
window.renderDriverPhotoChoices=function(){
  let grid=document.getElementById('driverPhotoChoices');
  if(!grid) return;
  let selected=(window.pendingDriverSignup&&window.pendingDriverSignup.initial)||'L';
  grid.innerHTML=DRIVER_INITIAL_LETTERS.map(letter=>`<button type="button" class="driver-letter-choice ${selected===letter?'selected':''}" style="background:${driverInitialColor(letter)}" onclick="selectDriverCandidateLetter('${letter}')">${letter}</button>`).join('');
};
window.toggleDriverPhotoChoices=function(){
  let grid=document.getElementById('driverPhotoChoices');
  if(!grid) return;
  renderDriverPhotoChoices();
  grid.classList.toggle('show');
};
window.selectDriverCandidateLetter=function(letter){
  letter=getDriverInitialFromName(letter);
  if(window.pendingDriverSignup){ window.pendingDriverSignup.initial=letter; window.pendingDriverSignup.photo=driverInitialAvatar(letter); }
  document.getElementById('driverCandidatePhoto').src=driverInitialAvatar(letter);
  renderDriverPhotoChoices();
};
window.updateDriverCandidateInitialFromName=function(){
  if(!window.pendingDriverSignup) return;
  let letter=getDriverInitialFromName(document.getElementById('driverFirstName').value);
  if(letter && (!window.pendingDriverSignup.initial || window.pendingDriverSignup.initial==='L')) selectDriverCandidateLetter(letter);
};
window.chooseDriverCandidatePhoto=function(){ toggleDriverPhotoChoices(); };
window.nextDriverRecruitStep=function(){
  if(!document.getElementById('driverFirstName').value.trim()) return alert('Mets ton prénom.');
  if(!document.getElementById('driverCity').value.trim()) return alert('Mets ta ville.');
  if(!document.getElementById('driverAge').value.trim()) return alert('Mets ton âge.');
  document.getElementById('driverRecruitProgress').style.width='100%';
  document.getElementById('driverRecruitStep1').classList.remove('active');
  document.getElementById('driverRecruitStep2').classList.add('active');
};
window.prevDriverRecruitStep=function(){
  document.getElementById('driverRecruitProgress').style.width='50%';
  document.getElementById('driverRecruitStep2').classList.remove('active');
  document.getElementById('driverRecruitStep1').classList.add('active');
};
window.submitDriverRecruitment=function(){
  if(!window.pendingDriverSignup) return alert('Session candidature expirée.');
  let vehicle=document.getElementById('driverVehicle').value;
  let availability=document.getElementById('driverAvailability').value;
  if(!vehicle) return alert('Choisis ton véhicule.');
  if(!availability) return alert('Choisis tes disponibilités.');
  if(!document.getElementById('driverArea').value) return alert('Choisis ta zone préférée.');
  if(!document.getElementById('driverHeavy').value) return alert('Dis-nous si tu peux porter un matelas.');
  let app={
    id:Date.now(),
    email:window.pendingDriverSignup.email,
    password:window.pendingDriverSignup.password,
    photo:window.pendingDriverSignup.photo||driverInitialAvatar(window.pendingDriverSignup.initial||'L'),
    initial:window.pendingDriverSignup.initial||getDriverInitialFromName(document.getElementById('driverFirstName').value),
    firstName:document.getElementById('driverFirstName').value.trim(),
    lastName:document.getElementById('driverLastName').value.trim(),
    age:document.getElementById('driverAge').value.trim(),
    city:document.getElementById('driverCity').value.trim(),
    vehicle,
    availability,
    phone:document.getElementById('driverPhone').value.trim(),
    experience:document.getElementById('driverExperience').value,
    area:document.getElementById('driverArea').value,
    heavy:document.getElementById('driverHeavy').value,
    motivation:document.getElementById('driverMotivation').value.trim(),
    notes:document.getElementById('driverNotes').value.trim(),
    status:'pending',
    createdAt:new Date().toLocaleDateString('fr-FR')
  };
  getDriverApplications().unshift(app);
  addAdminActionLog(`Nouvelle candidature livreur : ${app.firstName||app.email}`,0);
  saveAll();
  document.getElementById('driverRecruitStep2').classList.remove('active');
  document.getElementById('driverRecruitDone').classList.add('active');
};
window.closeDriverRecruitment=function(backToClient=false){
  document.getElementById('driverRecruitModal').classList.remove('active');
  window.pendingDriverSignup=null;
  if(backToClient){ resetDriverAuth(); document.getElementById('driverRegisterEmail').value=''; document.getElementById('driverRegisterPassword').value=''; }
};
function doDriverLogin(driver){
  let auth=document.getElementById('authScreen');
  auth.style.opacity='0';
  setTimeout(()=>{
    auth.style.display='none'; auth.style.opacity='1';
    document.getElementById('clientApp').style.display='none';
    document.getElementById('adminApp').style.display='none';
    document.getElementById('driverApp').style.display='block';
    window.currentUser={email:driver.email,role:'driver'};
    window.currentDriver=driver;
    appliquerThemeGlobal(reglages.theme||'dark');
    renderDriverApp();
  },250);
}
function renderDriverApp(){
  let d=window.currentDriver;
  if(!d) return;
  document.getElementById('driverAppName').innerText=d.name||'Livreur';
  document.getElementById('driverAppAvatar').src=d.photo||DEFAULT_DRIVER_PHOTO;
  document.getElementById('driverProfileAvatar').src=d.photo||DEFAULT_DRIVER_PHOTO;
  document.getElementById('driverProfileName').innerText=d.name||'Livreur Lago';
  document.getElementById('driverProfileEmail').innerText=d.email||'';
  document.getElementById('driverProfileInfo').innerHTML=`<b>Statut :</b> ${d.status||'En attente'}<br><b>Courses :</b> ${d.totalOrders||0}<br><b>Gains :</b> ${(d.earnings||0).toFixed(2)} €<br><b>Pourboires :</b> ${d.tips||0} €`;
}
window.switchDriverAppTab=function(tabId,btn){
  document.querySelectorAll('#driverApp section').forEach(s=>s.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.querySelectorAll('#driverNav .navBtn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
};

// =============================================
// NAVIGATION CLIENT
// =============================================
window.switchClientTab = function(tabId,btn) {
  currentClientTab=tabId;
  document.getElementById('clientApp').querySelectorAll('section').forEach(s=>s.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.getElementById('clientNav').querySelectorAll('.navBtn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  document.getElementById('clientApp').scrollTo(0,0);
  let vb=document.querySelector('.fake-viewers');
  if(vb) vb.style.display=(tabId==='home')?'block':'none';
  if(tabId==='orders') updateCart();
  if(tabId==='profile'){ renderSavedCards(); renderClientStats(); }
  updateClientNavIndicator();
};

// =============================================
// AVATARS
// =============================================
function initAvatarsUI() {
  document.getElementById('standardAvatarsGrid').innerHTML=avatarsStandard.map(url=>`<img src="${url}" class="avatar-img-btn" onclick="selectAvatar('${url}')">`).join('');
  document.getElementById('premiumAvatarsGrid').innerHTML=avatarsPremium.map(url=>`<div style="position:relative;"><img src="${url}" class="avatar-img-btn premium-avatar-btn" onclick="selectAvatar('${url}',true)"><div class="avatar-lock">🔒</div></div>`).join('');
}
window.selectAvatar=function(url,isPrem=false){
  if(isPrem&&!reglages.isPremium) return alert("Cet avatar est réservé aux membres Lago+ !");
  reglages.avatarUrl=url; appliquerAvatarEtPremium();
  document.getElementById('avatarModal').classList.remove('active'); saveAll();
};
function appliquerAvatarEtPremium(){
  if(!reglages.isPremium&&avatarsPremium.includes(reglages.avatarUrl)) reglages.avatarUrl=avatarsStandard[0];
  document.getElementById('userAvatarImg').src=reglages.avatarUrl;
  document.querySelectorAll('.avatar-lock').forEach(el=>el.style.display=reglages.isPremium?'none':'flex');
  if(reglages.isPremium){
    document.getElementById('premiumBlockFalse').style.display='none';
    document.getElementById('premiumBlockTrue').style.display='block';
    document.getElementById('cagnotteDisplay').innerText=reglages.cagnotte.toFixed(2);
    ['optNeon','optBlack','optGlass'].forEach(id=>document.getElementById(id).disabled=false);
  } else {
    document.getElementById('premiumBlockFalse').style.display='block';
    document.getElementById('premiumBlockTrue').style.display='none';
    ['optNeon','optBlack','optGlass'].forEach(id=>document.getElementById(id).disabled=true);
  }
}

// =============================================
// CGU
// =============================================
let currentTosPage=1;
window.openTos=()=>{ document.getElementById('tosModal').style.display='flex'; currentTosPage=1; renderTosPage(); };
window.closeTos=()=>{ document.getElementById('tosModal').style.display='none'; };
window.nextTos=()=>{ if(currentTosPage<60){ currentTosPage++; renderTosPage(); } };
window.prevTos=()=>{ if(currentTosPage>1){ currentTosPage--; renderTosPage(); } };
function renderTosPage(){
  document.getElementById('tosPageNum').innerText=currentTosPage;
  let article=1000+currentTosPage;
  let text=`<h2 style="color:var(--accent-blue);">Chapitre ${currentTosPage} - Dispositions légales</h2><p>Conformément à l'article ${article} du Code de la Consommation fictif de Lago, l'utilisateur accepte les présentes conditions sans réserve.</p>`;
  for(let i=0;i<6;i++){
    let code=`LAGO-${String(currentTosPage).padStart(2,'0')}-${i+1}`;
    text+=`<p style="margin-bottom:10px;"><b>Alinéa ${currentTosPage}.${i+1} :</b> Le prestataire Lago applique la clause ${code} pour garantir une livraison de lit claire, drôle et stable. Les conditions restent identiques à chaque ouverture de cette page.</p>`;
  }
  document.getElementById('tosText').innerHTML=text;
  document.getElementById('tosText').scrollTop=0;
}

// =============================================
// CARTES SAUVEGARDÉES (PROFIL)
// =============================================
function renderSavedCards(){
  let container=document.getElementById('savedCardsList');
  if(!reglages.savedCards||reglages.savedCards.length===0){
    container.innerHTML='<p style="color:var(--text-dim);font-size:12px;">Aucune carte enregistrée.</p>'; renderClientStats(); return;
  }
  container.innerHTML=reglages.savedCards.map((c,i)=>`
    <div class="saved-card-item">
      <div style="display:flex;align-items:center;gap:15px;">
        ${savedCardMiniHtml(c).replace('<div class="saved-card-mini',`<div onclick="openSavedCardDesignPicker(${i},event)" title="Changer le design" class="saved-card-mini`)}
        <div>
          <div style="color:white;font-weight:bold;">${c.type} •••• ${c.last4}</div>
          <div style="color:var(--text-dim);font-size:10px;">Expire le ${c.expiry} — ${c.holder}${c.design?` • ${getCardDesignName(c.design)}`:''}</div>
        </div>
      </div>
      <button onclick="deleteSavedCard(${i})" style="background:var(--accent-red);color:white;border:none;padding:5px 10px;border-radius:5px;font-size:10px;cursor:pointer;width:auto;margin:0;">Supprimer</button>
    </div>`).join('');
}
window.deleteSavedCard=(i)=>{ if(!confirm('Supprimer cette carte ?')) return; reglages.savedCards.splice(i,1); renderSavedCards(); renderClientStats(); saveAll(); };


function renderClientStats(){
  let box=document.getElementById('clientStatsBox'); if(!box) return;
  let hist=Array.isArray(reglages.historiqueCommandes)?reglages.historiqueCommandes:[];
  let spent=hist.reduce((a,c)=>a+(Number(c.prix)||0),0);
  let saved=Math.round(spent*0.15*100)/100;
  let cards=Array.isArray(reglages.savedCards)?reglages.savedCards.length:0;
  box.innerHTML=`<div><strong>${hist.length}</strong><span>commandes</span></div><div><strong>${spent.toFixed(2)}€</strong><span>dépensés</span></div><div><strong>${saved.toFixed(2)}€</strong><span>économisés</span></div><div><strong>${cards}</strong><span>cartes</span></div>`;
}
// =============================================
// PARRAINAGE
// =============================================
window.renderReferrals=function(){
  let list=document.getElementById('referralList'); list.innerHTML="";
  if(!reglages.referrals) reglages.referrals=[];
  reglages.referrals.forEach(r=>{
    list.innerHTML+=`<div style="background:rgba(255,255,255,0.05);padding:8px 12px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;"><span style="font-size:12px;color:white;">${r}</span><span style="background:var(--accent-green);color:white;padding:2px 6px;border-radius:5px;font-weight:bold;font-size:10px;">+ 5€</span></div>`;
  });
  if(reglages.referrals.length>=3){
    document.getElementById('referralInputZone').style.display='none';
    if(reglages.referralClaimed) list.innerHTML+=`<div style="text-align:center;color:var(--accent-green);font-weight:bold;font-size:12px;margin-top:5px;">✅ Cagnotte de 15€ créditée !</div>`;
    else list.innerHTML+=`<div style="text-align:center;color:var(--accent-gold);font-weight:bold;font-size:12px;margin-top:5px;">⏳ 15€ en attente. Devenez VIP pour débloquer !</div>`;
  } else document.getElementById('referralInputZone').style.display='flex';
};

window.addReferral=function(){
  let email=document.getElementById('referralEmail').value.trim();
  if(!email||!email.includes('@')) return alert("Adresse email invalide.");
  if(email.toLowerCase()===window.currentUser.email.toLowerCase()) return alert("Tu ne peux pas te parrainer toi-même !");
  if(reglages.referrals.includes(email)) return alert("Cet ami a déjà été parrainé !");
  if(reglages.referrals.length>=3) return alert("Limite de 3 parrainages atteinte.");
  reglages.referrals.push(email); document.getElementById('referralEmail').value=''; renderReferrals();
  if(reglages.referrals.length<3) alert("🎉 Ami parrainé ! (+5€ en attente)");
  else {
    if(reglages.isPremium&&!reglages.referralClaimed){ reglages.cagnotte+=15; reglages.referralClaimed=true; appliquerAvatarEtPremium(); renderReferrals(); alert("🎉 15€ ajoutés à votre cagnotte VIP !"); }
    else if(!reglages.isPremium) document.getElementById('referralNotVipModal').classList.add('active');
  }
  saveAll();
};
window.openReferralAd=function(){ document.getElementById('referralNotVipModal').classList.remove('active'); document.getElementById('referralAdModal').classList.add('active'); };

// =============================================
// CARTE ADMIN
// =============================================
function initAdminMap(){
  if(mapInitialized) return;
  mapAdmin=L.map('adminMap').setView([TOURS_LAT,TOURS_LNG],13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{attribution:'Lago Maps'}).addTo(mapAdmin);
  mapInitialized=true; drawMapMarkers();
}
function drawMapMarkers(){
  if(!mapInitialized||!mapAdmin) return;
  mapAdmin.eachLayer(layer=>{ if(layer instanceof L.Marker) layer.remove(); });
  drivers.filter(d=>!d.fired&&d.status!=="Non recruté").forEach(d=>{
    let cl=d.isPro?'pin-pro':'pin-standard';
    let icon=L.divIcon({className:'custom-pin',html:`<div class="pin-wrapper ${cl}"><img src="${d.photo}" class="driver-photo-pin" style="width:34px;height:34px;"></div>`,iconSize:[34,42],iconAnchor:[17,42]});
    d.leafletMarker=L.marker([d.lat,d.lng],{icon}).addTo(mapAdmin);
  });
}
window.switchAdminTab=function(tabId,btn){
  document.getElementById('adminApp').querySelectorAll('section').forEach(s=>s.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.getElementById('adminNav').querySelectorAll('.navBtn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  document.getElementById('adminApp').scrollTo(0,0);
  if(tabId==='admDrivers'){ if(!mapInitialized) initAdminMap(); setTimeout(()=>mapAdmin&&mapAdmin.invalidateSize(),200); }
};
function animateMarker(marker,sLat,sLng,eLat,eLng,dur){
  let start=performance.now();
  function step(t){ let p=Math.min((t-start)/dur,1); marker.setLatLng([sLat+(eLat-sLat)*p,sLng+(eLng-sLng)*p]); if(p<1) requestAnimationFrame(step); }
  requestAnimationFrame(step);
}
window.getAvailableDriver=function(isVipClient){
  let available=drivers.filter(d=>!d.fired&&d.status!=="Non recruté"&&d.status!=="En livraison 🛵");
  if(available.length===0) return null;
  if(isVipClient){ let pros=available.filter(d=>d.isPro); if(pros.length>0) return pros[Math.floor(Math.random()*pros.length)]; }
  return available[Math.floor(Math.random()*available.length)];
};

// =============================================
// BOT
// =============================================
function startBot(){
  if(botInterval) clearInterval(botInterval);
  botInterval=setInterval(()=>{
    let activeUsers=fakeUsers.filter(u=>!u.banni&&u.id<999);
    if(activeUsers.length===0) return;
    let usr=activeUsers[Math.floor(Math.random()*activeUsers.length)];
    drivers.filter(d=>!d.fired&&d.status!=="Non recruté").forEach(d=>{ if(d.status==="En livraison 🛵") d.status="En attente"; });
    let items=["Le Duo","Le Solo","Lit Parapluie","Le Gonflable"]; let prices=[reglages.prixDuo,reglages.prixSolo,reglages.prixBebe,reglages.prixGonflable];
    let idx=Math.floor(Math.random()*items.length); let price=Number(prices[idx]);
    let isNewVip=usr.isVip&&Math.random()>0.7;
    let cutPatron=(price*0.6)+(isNewVip?59.99:0); let totalDisplayPrice=price+(isNewVip?59.99:0);
    reglages.caTotal+=cutPatron; reglages.totalOrders++; usr.orders++;
    let d2=new Date();
    usr.historique.push({id:Date.now()+Math.random(),date:d2.toLocaleDateString('fr-FR')+" à "+d2.getHours()+"h"+(d2.getMinutes()<10?'0':'')+d2.getMinutes(),prix:totalDisplayPrice,items:items[idx],status:"Terminée"});
    updateAdminStats();
    let botTip=Math.random()>0.5?[1,2,5][Math.floor(Math.random()*3)]:0;
    let assignedD=getAvailableDriver(usr.isVip);
    if(assignedD){
      assignedD.status="En livraison 🛵"; assignedD.totalOrders++; assignedD.earnings+=price*0.4;
      if(botTip>0) assignedD.tips+=botTip;
      if(mapInitialized&&assignedD.leafletMarker){
        let nLat=TOURS_LAT-0.02+Math.random()*0.04,nLng=TOURS_LNG-0.03+Math.random()*0.06;
        animateMarker(assignedD.leafletMarker,assignedD.lat,assignedD.lng,nLat,nLng,7500);
        assignedD.lat=nLat; assignedD.lng=nLng;
      }
      if(Math.random()>0.1){
        let coms=["Rapide et efficace !","Livreur super sympa.","Parfait, je recommande.","Lit au top.","Impeccable."];
        let stars=Math.floor(Math.random()*(5-3+1))+3;
        assignedD.comments.push({date:new Date().toLocaleDateString('fr-FR'),email:usr.email,rating:stars,text:coms[Math.floor(Math.random()*coms.length)]});
        let tp=(assignedD.rating*assignedD.votes)+stars; assignedD.votes++; assignedD.rating=Math.round((tp/assignedD.votes)*10)/10;
      }
      if(window.currentOpenDriverId===assignedD.id) openDriverModal(assignedD.id);
    }
    drivers.filter(d=>!d.fired&&d.status!=="Non recruté").forEach(d=>{
      if(d.status!=="En livraison 🛵"){ let r=Math.random(); if(r<0.7) d.status="En attente"; else if(r<0.9) d.status="En pause ☕"; else d.status="Retard ⚠️"; }
    });
    renderAdminDrivers();
    if(window.currentOpenUserId===usr.id){ openUserModal(usr.id); renderAdminUsers(); }
    let notif=document.createElement('div'); notif.className='admin-toast';
    notif.innerHTML=`🔔 <b>${usr.email.split('@')[0]}</b> a commandé <b>${items[idx]}</b> (+${totalDisplayPrice.toFixed(2)}€)<br><span style="font-size:11px;">🛵 Livré par: <b>${assignedD?assignedD.name:'Inconnu'}</b></span>${botTip>0?`<br><span style="color:var(--accent-green);font-size:11px;">💰 Pourboire +${botTip}€</span>`:''}${isNewVip?`<br><span style="color:var(--accent-gold);font-size:11px;">👑 Abonnement VIP inclus !</span>`:''}`;
    document.getElementById('adminToastContainer').appendChild(notif);
    setTimeout(()=>{ notif.style.opacity='0'; setTimeout(()=>notif.remove(),400); },5000);
    saveAll();
  },8000);
}
function stopBot(){ clearInterval(botInterval); botInterval=null; }

// =============================================
// MODALS ADMIN
// =============================================
window.openDriverModal=function(id){
  window.currentOpenDriverId=id; window.currentOpenUserId=null;
  let d=drivers.find(x=>x.id===id);
  let commentsHTML=d.comments.length>0?d.comments.map(c=>{
    let fu=fakeUsers.find(u=>u.email===c.email); let ava=fu?fu.avatarUrl:avatarsStandard[0];
    return `<div style="text-align:left;background:rgba(0,0,0,0.2);border-radius:10px;padding:10px;margin-bottom:8px;"><div style="font-size:11px;color:var(--text-dim);margin-bottom:4px;display:flex;justify-content:space-between;"><span><img src="${ava}" style="width:15px;height:15px;border-radius:50%;vertical-align:middle;margin-right:5px;">${c.email}</span><span>${c.date}</span></div><div style="color:var(--accent-gold);font-size:12px;">${'✱'.repeat(c.rating)}</div><div style="font-size:13px;font-style:italic;">"${c.text}"</div></div>`;
  }).join(''):"<p style='color:var(--text-dim);font-size:12px;'>Aucun avis.</p>";
  document.getElementById('adminModalContent').innerHTML=`<img src="${d.photo}" class="modal-avatar-large"><h3 style="margin:0;">${d.name}${d.isPro?' 👑':''}</h3><div style="color:var(--accent-gold);font-weight:bold;margin-bottom:15px;">★ ${d.rating} (${d.votes} avis)</div><div style="text-align:left;font-size:14px;color:var(--text-dim);background:var(--glass-bg);padding:15px;border-radius:15px;margin-bottom:15px;"><p style="margin-top:0;"><b>Embauche :</b> ${d.hireDate}</p><p><b>Courses :</b> ${d.totalOrders}</p><p><b>Gains (40%) :</b> ${d.earnings.toFixed(2)} €</p><p><b>Pourboires :</b> <span style="color:var(--accent-green);">${d.tips} €</span></p><p style="margin-bottom:0;"><b>Statut :</b> ${d.status==='En livraison 🛵'?'<span style="color:var(--accent-blue);font-weight:bold;">'+d.status+'</span>':d.status}</p></div><h4 style="color:white;margin-top:0;">Historique des Avis</h4><div style="max-height:150px;overflow-y:auto;">${commentsHTML}</div>`;
  document.getElementById('adminModal').classList.add('active');
};
window.toggleUserVip=function(id){
  let u=fakeUsers.find(x=>x.id===id);
  if(u.isVip&&u.vipSource==='purchased') return alert("VIP ACHETÉ : Impossible de retirer (CGU).");
  u.isVip=!u.isVip; u.vipSource=u.isVip?'gifted':null;
  if(window.currentUser&&window.currentUser.id===u.id) reglages.isPremium=u.isVip;
  openUserModal(id); renderAdminUsers();
};
window.openUserModal=function(id){
  window.currentOpenDriverId=null; window.currentOpenUserId=id;
  let u=fakeUsers.find(x=>x.id===id);
  let histHTML=u.historique.length>0?u.historique.map(h=>`<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;"><div><div style="font-weight:bold;font-size:12px;color:white;">${h.date}</div><div style="color:var(--text-dim);font-size:11px;">${h.items}</div></div><div style="color:var(--accent-green);font-weight:bold;">${parseFloat(h.prix).toFixed(2)}€</div></div>`).reverse().join(''):"<p style='color:var(--text-dim);font-size:12px;'>Aucune commande.</p>";
  let btnHtml=u.isVip?(u.vipSource==='purchased'?`<button disabled style="padding:4px 8px;background:gray;color:#fff;border-radius:5px;border:none;font-size:10px;">ACHETÉ</button>`:`<button onclick="toggleUserVip(${u.id})" style="padding:4px 8px;background:var(--accent-red);color:#fff;border-radius:5px;border:none;font-size:10px;cursor:pointer;">RETIRER VIP</button>`):`<button onclick="toggleUserVip(${u.id})" style="padding:4px 8px;background:var(--accent-gold);color:#000;border-radius:5px;border:none;font-size:10px;cursor:pointer;">OFFRIR VIP</button>`;
  document.getElementById('adminModalContent').innerHTML=`<img src="${u.avatarUrl}" class="modal-avatar-large"><h3 style="margin:0;font-size:18px;word-break:break-all;">${u.email}</h3><div style="color:${u.isVip?'var(--accent-gold)':'var(--text-dim)'};font-weight:bold;margin-bottom:15px;display:flex;align-items:center;justify-content:center;gap:10px;">${u.isVip?'👑 Membre VIP':'Client Standard'} ${btnHtml}</div><div style="text-align:left;font-size:14px;color:var(--text-dim);background:var(--glass-bg);padding:15px;border-radius:15px;margin-bottom:15px;"><p style="margin-top:0;"><b>Inscription :</b> ${u.signupDate}</p><p><b>Commandes :</b> ${u.orders}</p><p style="margin-bottom:0;"><b>État :</b> ${u.banni?'<span style="color:var(--accent-red);font-weight:bold;">BANNI</span>':'<span style="color:var(--accent-green);font-weight:bold;">Actif</span>'}</p></div><h4 style="color:white;margin-top:0;text-align:left;">Historique</h4><div style="max-height:150px;overflow-y:auto;text-align:left;">${histHTML}</div>`;
  document.getElementById('adminModal').classList.add('active');
};
window.closeAdminModal=function(){ window.currentOpenDriverId=null; window.currentOpenUserId=null; document.getElementById('adminModal').classList.remove('active'); };
window.banUser=function(id){ if(confirm("Bannir ce client ?")){ fakeUsers.find(u=>u.id===id).banni=true; renderAdminUsers(); } };

// =============================================
// THÈME
// =============================================
function initLiquidGlassFollower(){
  if(document.querySelector('.liquid-cursor')) return;
  const bubble=document.createElement('div');
  bubble.className='liquid-cursor';
  document.body.appendChild(bubble);
  const move=(x,y)=>{
    document.documentElement.style.setProperty('--glass-x', x+'px');
    document.documentElement.style.setProperty('--glass-y', y+'px');
  };
  window.addEventListener('pointermove', e=>move(e.clientX,e.clientY), {passive:true});
  window.addEventListener('touchmove', e=>{
    if(e.touches&&e.touches[0]) move(e.touches[0].clientX,e.touches[0].clientY);
  }, {passive:true});
}

function appliquerThemeGlobal(themeName){
  document.body.className='';
  if(reglages.weatherSurge) document.body.classList.add('rain-mode');
  if(themeName==='light') document.body.classList.add('theme-day');
  else if(themeName==='neon') document.body.classList.add('theme-neon');
  else if(themeName==='black') document.body.classList.add('theme-black');
  else if(themeName==='glass') document.body.classList.add('theme-glass');
  updateClientNavIndicator();
}
document.getElementById('adminThemeSelect').addEventListener('change',e=>{ reglages.theme=e.target.value; reglages.adminTheme=e.target.value; appliquerThemeGlobal(reglages.theme); saveAll(); });
function appliquerThemeEtPremium(){ appliquerThemeGlobal(reglages.theme); document.getElementById('userThemeSelect').value=reglages.theme; updatePaymentCardPreview(); }
document.getElementById('userThemeSelect').addEventListener('change',e=>{ reglages.theme=e.target.value; appliquerThemeEtPremium(); saveAll(); });

// =============================================
// VIP
// =============================================
document.getElementById('buyPremiumBtn').onclick=()=>{
  document.getElementById('vipConfirmModal').classList.add('active');
  document.getElementById('vipStep1').style.display='block';
  document.getElementById('vipStep2').style.display='none';
};
window.vipGoStep2=function(){ document.getElementById('vipStep1').style.display='none'; document.getElementById('vipStep2').style.display='block'; };
window.closeVipModal=function(){ document.getElementById('vipConfirmModal').classList.remove('active'); };
window.confirmVipPurchase=function(){
  closeVipModal(); document.getElementById('referralAdModal').classList.remove('active');
  openPaymentModal(59.99,()=>{
    reglages.isPremium=true;
    let bonus=15;
    if(reglages.referrals&&reglages.referrals.length===3&&!reglages.referralClaimed){ bonus+=15; reglages.referralClaimed=true; }
    reglages.cagnotte+=bonus; reglages.cagnotteSpent=0; reglages.caTotal+=59.99;
    if(window.currentUser) window.currentUser.vipSource='purchased';
    addAdminActionLog("Achat Lago+",59.99);
    appliquerAvatarEtPremium(); appliquerThemeEtPremium(); mettreAJourVitrine(); updateCart(); updateAdminStats(); renderReferrals(); saveAll();
    alert(`Bienvenue dans le club VIP Lago+ 👑 ! ${bonus}€ ajoutés à ta cagnotte !`);
  });
};
window.refundVip=function(){
  let spent=reglages.cagnotteSpent||0; let cushion=0;
  if(reglages.moisCoussinGratuit===new Date().getMonth()) cushion=5;
  let refund=Math.max(0,59.99-spent-cushion);
  let msg=`Voulez-vous annuler votre abonnement VIP ?\n\nPrix payé : 59.99€\nCagnotte utilisée : ${spent.toFixed(2)}€${cushion>0?'\nCoussin gratuit : 5.00€':''}\n\nMontant remboursé : ${refund.toFixed(2)}€`;
  if(confirm(msg)){
    reglages.isPremium=false; reglages.cagnotte=0; reglages.cagnotteSpent=0; reglages.moisCoussinGratuit=null;
    reglages.caTotal=Math.max(0,reglages.caTotal-refund);
    if(window.currentUser) window.currentUser.vipSource=null;
    if(["neon","black","glass"].includes(reglages.theme)) reglages.theme="dark";
    addAdminActionLog("Remboursement Lago+",-refund);
    updateAdminStats(); appliquerAvatarEtPremium(); appliquerThemeEtPremium(); updateCart(); mettreAJourVitrine();
    alert(`Abonnement annulé. Remboursement : ${refund.toFixed(2)}€.`); saveAll();
  }
};

// =============================================
// COMMANDES PROGRAMMÉES
// =============================================
window.cancelOrder=function(orderId){
  let order=reglages.historiqueCommandes.find(o=>o.id===orderId);
  if(!order||order.status!=="En cours") return;
  let now=new Date(); let[h,m]=order.scheduledTime.split(':');
  let target=new Date(); target.setHours(parseInt(h),parseInt(m),0,0);
  if(target<now) target.setDate(target.getDate()+1);
  if(target-now<3600000) return alert("❌ Annulation impossible à moins d'une heure de la livraison.");
  if(confirm(`Voulez-vous annuler votre livraison à ${order.scheduledTime} ? Remboursement : ${order.prix.toFixed(2)}€.`)){
    order.status="Annulée";
    if(order.cagnotteUsed>0){ reglages.cagnotte+=order.cagnotteUsed; reglages.cagnotteSpent=Math.max(0,reglages.cagnotteSpent-order.cagnotteUsed); }
    reglages.caTotal-=order.prix; reglages.totalOrders--; updateAdminStats();
    mettreAJourHistorique(); updateCart(); saveAll(); alert("✅ Commande annulée et remboursée.");
  }
};

// =============================================
// VITRINE
// =============================================
function mettreAJourHistorique(){
  let div=document.getElementById('historiqueDetails');
  if(reglages.historiqueCommandes.length===0){ div.innerHTML="<p style='color:var(--text-dim)'>Aucune commande pour le moment.</p>"; return; }
  div.innerHTML="";
  [...reglages.historiqueCommandes].reverse().forEach(h=>{
    let badge="",extraClass="",onclickAttr="";
    if(h.status==="En cours"){ badge=`<div class="status-badge status-encours">⏳ EN COURS (${h.scheduledTime}) - Cliquer pour annuler</div>`; extraClass="programmable"; onclickAttr=`onclick="cancelOrder(${h.id})"`; }
    else if(h.status==="Annulée") badge=`<div class="status-badge status-annule">❌ ANNULÉE</div>`;
    else badge=`<div class="status-badge status-termine">✓ TERMINÉE</div>`;
    div.innerHTML+=`<div class="history-card ${extraClass}" ${onclickAttr}><div style="flex:1;"><div style="font-weight:bold;font-size:13px;color:white;">${h.date}</div><div style="color:var(--text-dim);font-size:11px;margin-top:2px;">${h.items}</div>${badge}</div><div style="color:var(--accent-green);font-weight:bold;font-size:14px;text-align:right;">${h.status==="Annulée"?`<strike style="color:var(--text-dim)">${h.prix.toFixed(2)}€</strike>`:`${h.prix.toFixed(2)}€`}</div></div>`;
  });
}

function mettreAJourVitrine(){
  document.getElementById('welcomeTextDisplay').innerText=reglages.welcomeText;
  document.getElementById('adminWelcomeText').value=reglages.welcomeText;
  document.getElementById('adminTaxeNuit').checked=reglages.taxeNuit;
  document.getElementById('adminPromoCodeStr').value=reglages.promoCodeStr||"FREROT";
  document.getElementById('adminPromoValue').value=reglages.promoValue||5;
  syncPromoAdminUI();
  function updateMatelas(baseName,prix,rupture){
    let div=document.getElementById('matelas'+baseName); if(!div) return;
    div.dataset.price=prix;
    document.getElementById('prix'+baseName+'Text').innerText=prix+" €";
    document.getElementById('adminPrix'+baseName).value=prix;
    document.getElementById('adminRupture'+baseName).checked=rupture;
    if(rupture){ div.classList.add('out-of-stock'); div.querySelector('.rupture-badge').style.display="block"; }
    else{ div.classList.remove('out-of-stock'); div.querySelector('.rupture-badge').style.display="none"; }
  }
  updateMatelas('Solo',reglages.prixSolo,reglages.ruptureSolo);
  updateMatelas('Duo',reglages.prixDuo,reglages.ruptureDuo);
  updateMatelas('Gonflable',reglages.prixGonflable,reglages.ruptureGonflable);
  updateMatelas('Bebe',reglages.prixBebe,reglages.ruptureBebe);
  let containerOpts=document.querySelector('.options:not(.tip-options)');
  containerOpts.innerHTML="";
  let adminOptList=document.getElementById('adminOptionsList'); adminOptList.innerHTML="";
  let currentMonth=new Date().getMonth();
  for(let key in reglages.options){
    let opt=reglages.options[key];
    if(opt.active){
      let estGratuit=(reglages.isPremium&&opt.name==="☁️ Coussin"&&reglages.moisCoussinGratuit!==currentMonth);
      let prixAff=estGratuit?"0€ 🎁":`+${opt.price}€`;
      let div=document.createElement('div'); div.className="option";
      div.dataset.name=opt.name; div.dataset.price=estGratuit?0:opt.price; div.dataset.desc=opt.desc;
      div.innerHTML=`${opt.name} <span style="${estGratuit?'color:var(--accent-gold);':''}">${prixAff}</span>`;
      containerOpts.appendChild(div);
    }
    adminOptList.innerHTML+=`<div class="admin-opt-row"><input type="checkbox" id="admAct_${key}" ${opt.active?'checked':''}><input type="text" id="admName_${key}" value="${opt.name}"><input type="number" id="admPrice_${key}" value="${opt.price}"> €</div>`;
  }
  attacherEvenementsClics(); updateCart();
}

function attacherEvenementsClics(){
  document.querySelectorAll('.mattress').forEach(m=>{
    m.onclick=()=>{
      if(m.classList.contains('out-of-stock')) return;
      if(m.classList.contains('selected')){
        m.classList.remove('selected');
        selectedMattress=null;
        updateCart();
        return;
      }
      document.querySelectorAll('.mattress').forEach(x=>x.classList.remove('selected'));
      m.classList.add('selected'); selectedMattress=m;
      updateCart();
    };
  });
  document.querySelectorAll('.options:not(.tip-options) .option').forEach(o=>{
    let timerAppui; let isLongPress=false;
    o.oncontextmenu=e=>e.preventDefault();
    o.addEventListener('touchstart',()=>{ isLongPress=false; timerAppui=setTimeout(()=>{ isLongPress=true; document.getElementById('bubbleTitle').innerText=o.dataset.name; document.getElementById('bubbleDesc').innerText=o.dataset.desc; document.getElementById('infoBubble').style.display="block"; },500); },{passive:true});
    o.addEventListener('touchmove',()=>clearTimeout(timerAppui),{passive:true});
    o.addEventListener('touchend',e=>{ clearTimeout(timerAppui); if(isLongPress) e.preventDefault(); });
    o.addEventListener('click',()=>{ if(!isLongPress) o.classList.toggle('selected'); });
  });
}

let customTipPreviousTip=0;
let customTipPreviousSelected=null;
function restoreTipSelection(){
  document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
  if(customTipPreviousSelected){
    let oldBtn=document.querySelector(`.tip-btn[data-val="${customTipPreviousSelected}"]`);
    if(oldBtn) oldBtn.classList.add('selected');
  }
  currentTip=customTipPreviousTip;
  updateCart();
}
window.openCustomTipModal=function(){
  customTipPreviousTip=currentTip;
  let selected=document.querySelector('.tip-btn.selected');
  customTipPreviousSelected=selected?selected.dataset.val:null;
  document.getElementById('customTipInput').value="";
  document.getElementById('customTipModal').classList.add('active');
};
window.closeCustomTipModal=function(){
  restoreTipSelection();
  document.getElementById('customTipModal').classList.remove('active');
};
window.validerCustomTip=function(){
  let val=parseFloat(document.getElementById('customTipInput').value);
  if(!isNaN(val)&&val>=0.10){
    currentTip=Math.round(val*100)/100;
    document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
    let customBtn=document.querySelector('.tip-btn[data-val="custom"]');
    if(customBtn) customBtn.classList.add('selected');
    updateCart();
    document.getElementById('customTipModal').classList.remove('active');
  }
  else { alert("Montant minimum: 0.10€"); restoreTipSelection(); document.getElementById('customTipModal').classList.remove('active'); }
};
document.querySelectorAll('.tip-btn').forEach(btn=>{
  btn.onclick=()=>{
    if(btn.dataset.val==="custom") { openCustomTipModal(); return; }
    currentTip=Number(btn.dataset.val); updateCart();
    document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
  };
});
document.getElementById('closeBubble').onclick=()=>{ document.getElementById('infoBubble').style.display="none"; };
window.toggleWeather=function(){
  reglages.weatherSurge=document.getElementById('adminWeatherToggle').checked;
  if(reglages.weatherSurge) document.body.classList.add('rain-mode');
  else document.body.classList.remove('rain-mode');
  addAdminActionLog(`Surtaxe météo ${reglages.weatherSurge?'activée':'désactivée'}`,0);
  updateCart(); saveAll();
};

document.getElementById('saveAdminBtn').onclick=()=>{
  reglages.welcomeText=document.getElementById('adminWelcomeText').value;
  reglages.taxeNuit=document.getElementById('adminTaxeNuit').checked;
  reglages.prixSolo=Math.max(0,Number(document.getElementById('adminPrixSolo').value)||0);
  reglages.ruptureSolo=document.getElementById('adminRuptureSolo').checked;
  reglages.prixDuo=Math.max(0,Number(document.getElementById('adminPrixDuo').value)||0);
  reglages.ruptureDuo=document.getElementById('adminRuptureDuo').checked;
  reglages.prixGonflable=Math.max(0,Number(document.getElementById('adminPrixGonflable').value)||0);
  reglages.ruptureGonflable=document.getElementById('adminRuptureGonflable').checked;
  reglages.prixBebe=Math.max(0,Number(document.getElementById('adminPrixBebe').value)||0);
  reglages.ruptureBebe=document.getElementById('adminRuptureBebe').checked;
  if(!reglages.promoConfig) normalizePromoConfig();
  reglages.promoCodeStr=reglages.promoConfig.code;
  reglages.promoValue=reglages.promoConfig.percent;
  for(let key in reglages.options){
    reglages.options[key].active=document.getElementById('admAct_'+key).checked;
    reglages.options[key].name=document.getElementById('admName_'+key).value;
    reglages.options[key].price=Math.max(0,Number(document.getElementById('admPrice_'+key).value)||0);
  }
  addAdminActionLog("Réglages vitrine sauvegardés",0);
  mettreAJourVitrine(); saveAll(); alert("Réglages sauvegardés ! 💾");
};

function mettreAJourVitrineAdmin(){
  document.getElementById('adminTaxeNuit').checked=reglages.taxeNuit;
  document.getElementById('adminWeatherToggle').checked=reglages.weatherSurge;
  if(reglages.weatherSurge) document.body.classList.add('rain-mode');
  else document.body.classList.remove('rain-mode');
}

// =============================================
// PANIER
// =============================================
document.getElementById('addToCart').onclick=()=>{
  if(!selectedMattress) return alert("Choisis un matelas d'abord !");
  let item={name:selectedMattress.dataset.name,basePrice:Number(selectedMattress.dataset.price),price:Number(selectedMattress.dataset.price),options:[],qty:1};
  document.querySelectorAll('.options:not(.tip-options) .option.selected').forEach(o=>{
    item.options.push({name:o.dataset.name,price:Number(o.dataset.price)});
    item.price+=Number(o.dataset.price);
  });
  let optStr=JSON.stringify(item.options);
  let existing=cart.find(c=>c.name===item.name&&JSON.stringify(c.options)===optStr);
  if(existing) existing.qty++;
  else cart.push(item);
  updateCart(); alert("C'est dans le panier ! 🛒");
  document.querySelectorAll('.mattress,.options:not(.tip-options) .option').forEach(el=>el.classList.remove('selected'));
  selectedMattress=null;
};

document.getElementById('applyPromo').onclick=()=>{
  normalizePromoConfig();
  let entered=document.getElementById('promoInput').value.trim().toUpperCase();
  if(!reglages.promoConfig.active) return alert("Aucun code promo actif pour le moment.");
  if(reglages.promoConfig.usageLimit<999 && (reglages.promoConfig.usageCount||0)>=reglages.promoConfig.usageLimit) return alert("Ce code promo a déjà atteint sa limite d'utilisation.");
  if(entered===reglages.promoConfig.code){
    promoActive=true; updateCart();
    let msg=document.getElementById('promoMessage');
    let disc=computePromoDiscount();
    if(disc>0){ msg.innerText=`Code appliqué : -${disc.toFixed(2)} €`; msg.style.display="block"; }
    else { promoActive=false; msg.style.display="none"; alert("Ce code ne s'applique pas à ce matelas."); }
  } else alert("Code invalide !");
};
document.getElementById('useCagnotteCheck').addEventListener('change',updateCart);
window.removeFromCart=function(index){ cart.splice(index,1); updateCart(); };
window.toggleScheduleInput=function(){
  let mode=document.getElementById('deliveryModeSelect').value;
  let input=document.getElementById('scheduledTimeInput');
  if(mode==='later'){ input.style.display='block'; document.getElementById('tipSection').style.display='none'; }
  else{ input.style.display='none'; document.getElementById('tipSection').style.display='block'; }
};

function updateCart(){
  document.getElementById('cartCount').textContent=cart.reduce((acc,c)=>acc+c.qty,0);
  let list=document.getElementById('cartList'); let sousTotalLitsOptions=0;
  list.innerHTML=""; currentCagnotteDeduction=0;
  if(cart.length===0){
    promoActive=false; document.getElementById('promoMessage').style.display="none"; document.getElementById('promoInput').value="";
    list.innerHTML="<p style='color:var(--text-dim)'>Panier vide.</p>";
    document.getElementById('factureDetails').style.display="none";
    document.getElementById('scheduleSection').style.display="none";
    document.getElementById('tipSection').style.display="none";
    document.getElementById('totalPrice').textContent="0.00"; return;
  }
  document.getElementById('scheduleSection').style.display="block";
  if(document.getElementById('deliveryModeSelect').value==='now') document.getElementById('tipSection').style.display="block";
  cart.forEach((c,index)=>{
    let lp=c.price*c.qty; sousTotalLitsOptions+=lp;
    let opts=c.options.map(o=>`<small style="color:var(--text-dim);display:block;">+ ${o.name}</small>`).join('');
    list.innerHTML+=`<div class="cartItem" style="border-bottom:1px solid var(--glass-border);align-items:center;"><div style="display:flex;align-items:center;"><button class="remove-btn" onclick="removeFromCart(${index})">−</button><div><span style="font-weight:bold;">${c.name}${c.qty>1?` <span style="color:var(--accent-blue);">x${c.qty}</span>`:''}</span>${opts}</div></div><span style="font-weight:700;">${lp.toFixed(2)} €</span></div>`;
  });
  document.getElementById('factureDetails').style.display="block";
  document.getElementById('sousTotalDisplay').innerText=sousTotalLitsOptions.toFixed(2)+" €";
  document.getElementById('cartDistanceDisplay').innerText=cartDistance;
  let fraisLivraison=4.99;
  if(reglages.isPremium&&cartDistance<=3.0){ fraisLivraison=0; document.getElementById('fraisLivraisonDisplay').innerHTML=`<strike style="color:var(--text-dim);">4.99 €</strike> <span style="color:var(--accent-green);font-weight:bold;">OFFERT</span>`; }
  else document.getElementById('fraisLivraisonDisplay').innerText="4.99 €";
  let total=sousTotalLitsOptions+fraisLivraison+2.99;
  let dynDiv=document.getElementById('dynamicTaxesAndDiscounts'); dynDiv.innerHTML="";
  if(reglages.isPremium){ let disc=Math.round(sousTotalLitsOptions*0.15*100)/100; document.getElementById('premiumDiscountRow').style.display="flex"; document.getElementById('premiumDiscountDisplay').innerText="-"+disc.toFixed(2)+" €"; total-=disc; }
  else document.getElementById('premiumDiscountRow').style.display="none";
  if(reglages.taxeNuit){ let t=Math.round(sousTotalLitsOptions*0.20*100)/100; dynDiv.innerHTML+=`<div class="cartItem" style="color:var(--accent-blue);margin-top:10px;"><span>🌙 Surtaxe de Nuit (20%)</span><span>+ ${t.toFixed(2)} €</span></div>`; total+=t; }
  if(reglages.weatherSurge){ let s=Math.round(sousTotalLitsOptions*0.25*100)/100; dynDiv.innerHTML+=`<div class="cartItem" style="color:var(--accent-blue);margin-top:5px;"><span>🌧️ Forte demande (+25%)</span><span>+ ${s.toFixed(2)} €</span></div>`; total+=s; }
  if(promoActive){ let pv=computePromoDiscount(); if(pv>0){ total-=pv; dynDiv.innerHTML+=`<div class="cartItem discount" style="margin-top:10px;"><span>Promo ${reglages.promoConfig.code} (-${reglages.promoConfig.percent}%)</span><span>-${pv.toFixed(2)} €</span></div>`; let msg=document.getElementById('promoMessage'); if(msg){ msg.innerText=`Code appliqué : -${pv.toFixed(2)} €`; msg.style.display="block"; } } else { promoActive=false; document.getElementById('promoMessage').style.display="none"; } }
  total=Math.round(Math.max(0,total)*100)/100;
  let divCag=document.getElementById('useCagnotteDiv'); let checkCag=document.getElementById('useCagnotteCheck');
  if(reglages.isPremium&&reglages.cagnotte>0){
    divCag.style.display="block"; document.getElementById('cagnotteDispoCart').innerText=reglages.cagnotte.toFixed(2);
    if(checkCag.checked){ currentCagnotteDeduction=Math.min(total,reglages.cagnotte); total-=currentCagnotteDeduction; dynDiv.innerHTML+=`<div class="cartItem" style="color:var(--accent-gold);font-weight:bold;margin-top:10px;"><span>💰 Cagnotte</span><span>-${currentCagnotteDeduction.toFixed(2)} €</span></div>`; }
  } else{ divCag.style.display="none"; checkCag.checked=false; }
  if(currentTip>0&&document.getElementById('deliveryModeSelect').value==='now'){ dynDiv.innerHTML+=`<div class="cartItem" style="color:var(--accent-green);font-weight:bold;margin-top:10px;"><span>🙏 Pourboire Livreur</span><span>+${currentTip.toFixed(2)} €</span></div>`; total+=currentTip; }
  document.getElementById('totalPrice').textContent=total.toFixed(2);
}

// =============================================
// AVIS
// =============================================
document.querySelectorAll('#starContainer .star').forEach(s=>{
  s.onclick=()=>{
    currentClientRating=parseInt(s.dataset.val);
    document.querySelectorAll('#starContainer .star').forEach(st=>st.classList.toggle('active',parseInt(st.dataset.val)<=currentClientRating));
  };
});
document.getElementById('submitReviewBtn').onclick=function(){
  this.disabled=true;
  let text=document.getElementById('commentInput').value;
  if(currentDeliveryDriver&&currentClientRating>0){
    currentDeliveryDriver.comments.push({date:new Date().toLocaleDateString('fr-FR'),email:document.getElementById('clientEmailDisplay').innerText,rating:currentClientRating,text});
    let tp=(currentDeliveryDriver.rating*currentDeliveryDriver.votes)+currentClientRating;
    currentDeliveryDriver.votes++; currentDeliveryDriver.rating=Math.round((tp/currentDeliveryDriver.votes)*10)/10;
    renderAdminDrivers();
  }
  document.getElementById('merciAvis').style.display='block';
  this.style.display='none'; document.getElementById('commentInput').style.display='none';
  saveAll();
};
window.showBioModal=function(){
  if(!currentDeliveryDriver) return;
  document.getElementById('bioPhoto').src=currentDeliveryDriver.photo;
  document.getElementById('bioName').innerText=currentDeliveryDriver.name;
  document.getElementById('bioRating').innerText=currentDeliveryDriver.rating;
  document.getElementById('bioText').innerText=currentDeliveryDriver.bio||"Toujours prêt à livrer.";
  document.getElementById('bioCourses').innerText=currentDeliveryDriver.totalOrders;
  document.getElementById('driverBioModal').classList.add('active');
};
window.toggleChat=function(){ let cz=document.getElementById('chatZone'); cz.style.display=cz.style.display==='block'?'none':'block'; };
window.sendChatMessage=function(){
  let input=document.getElementById('chatInput'); let msg=input.value.trim(); if(!msg) return;
  let hist=document.getElementById('chatHistory'); let myAvatar=reglages.avatarUrl||avatarsStandard[0];
  hist.innerHTML+=`<div class="chat-row client"><img src="${myAvatar}" class="chat-avatar"><div class="chat-msg chat-msg-client">${msg}</div></div>`;
  input.value=''; hist.scrollTop=hist.scrollHeight;
  let dAvatar=currentDeliveryDriver?currentDeliveryDriver.photo:"https://randomuser.me/api/portraits/men/1.jpg";
  let typingId='typing'+Date.now();
  hist.innerHTML+=`<div class="chat-row driver" id="${typingId}"><img src="${dAvatar}" class="chat-avatar"><div class="chat-msg chat-msg-driver">•••</div></div>`;
  hist.scrollTop=hist.scrollHeight;
  setTimeout(()=>{
    let low=msg.toLowerCase();
    let replies=["J'arrive dans 2 min !","Je suis bloqué au feu, mais j'avance.","Je cherche une place, j'arrive.","Descendez s'il vous plaît !","Ok c'est noté !","J'ai votre lit à l'arrière.","Je tourne dans votre rue.","Je fais au plus vite, promis.","Je vous appelle si je ne trouve pas l'entrée."];
    let rep=low.includes('code')||low.includes('porte')?"Ok, je note le code/la porte.":(low.includes('retard')||low.includes('temps')?"Je vous tiens au courant, j'arrive dès que possible.":replies[Math.floor(Math.random()*replies.length)]);
    let row=document.getElementById(typingId); if(row) row.outerHTML=`<div class="chat-row driver"><img src="${dAvatar}" class="chat-avatar"><div class="chat-msg chat-msg-driver">${rep}</div></div>`;
    hist.scrollTop=hist.scrollHeight;
  },1200+Math.random()*1800);
};

// =============================================
// ===== FIX #2 : PAIEMENT ===================
// L'enregistrement de la carte se fait UNIQUEMENT
// au moment du clic sur "Payer", pas avant.
// La case à cocher est juste une préférence.
// Le popup "remplacer ?" apparaît seulement à ce moment.
// =============================================
window.openPaymentModal=function(amount,onSuccess){
  currentPaymentAmount=amount; pendingPaymentCallback=onSuccess;
  document.getElementById('payAmountDisplay').innerText=amount.toFixed(2)+' €';
  document.getElementById('cardPayAmount').innerText=amount.toFixed(2);
  // Reset visuel carte
  document.getElementById('cardNumberDisplay').innerText='•••• •••• •••• ••••';
  document.getElementById('cardHolderDisplay').innerText='VOTRE NOM';
  let expiryDisplay=document.getElementById('cardExpiryDisplay'); if(expiryDisplay) expiryDisplay.innerText='MM/AA';
  let cvvDisplay=document.getElementById('cardCvvDisplay'); if(cvvDisplay) cvvDisplay.innerText='•••';
  let l4=document.getElementById('cardLast4Display'); if(l4) l4.innerText='0000';
  let brand=document.getElementById('cardBrandDisplay'); if(brand) brand.innerText='CB';
  let backType=document.getElementById('cardBackTypeDisplay'); if(backType) backType.innerText='CB';
  setPaymentCardFace('front');
  // Reset champs
  ['cardNumber','cardHolder','cardExpiry','cardCVV','paypalEmail','paypalPassword'].forEach(id=>{
    let el=document.getElementById(id); if(el) el.value='';
  });
  document.getElementById('saveCardCheck').checked=false; // Toujours décoché à l'ouverture
  // Reset tabs
  document.querySelectorAll('.pay-tab').forEach((t,i)=>t.classList.toggle('active',i===0));
  document.querySelectorAll('.pay-panel').forEach((p,i)=>p.classList.toggle('active',i===0));
  // Cartes sauvegardées : sélectionner la première par défaut si elle existe
  selectedSavedCardIndex=reglages.savedCards&&reglages.savedCards.length>0?0:-1;
  showingNewCardForm=selectedSavedCardIndex<0;
  renderSavedCardsInPayment();
  updatePaymentCardPreview();
  let payContent=document.querySelector('#paymentSheet .pay-content'); if(payContent) payContent.scrollTop=0;
  document.getElementById('paymentOverlay').classList.add('show');
};
window.closePayment=()=>document.getElementById('paymentOverlay').classList.remove('show');
window.switchPayTab=(tab,btn)=>{
  document.querySelectorAll('.pay-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.pay-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active'); document.getElementById('panel-'+tab).classList.add('active');
};

function shakeInput(id,msg){
  let el=document.getElementById(id);
  el.style.borderColor='#ff3b30'; el.style.animation='shake 0.4s ease';
  setTimeout(()=>{ el.style.borderColor=''; el.style.animation=''; },1000);
  alert(msg);
}
function showProcessing(text,sub){
  document.getElementById('processingSpinner').style.borderTopColor='#007aff';
  document.getElementById('processingText').innerText=text;
  document.getElementById('processingSub').innerText=sub;
  document.getElementById('processingOverlay').classList.add('show');
}
function hideProcessing(){ document.getElementById('processingOverlay').classList.remove('show'); }
function showPaymentSuccess(amount){
  document.getElementById('successAmount').innerText=amount.toFixed(2)+' €';
  document.getElementById('paySuccessOverlay').classList.add('show');
  setTimeout(()=>{
    document.getElementById('paySuccessOverlay').classList.remove('show');
    if(pendingPaymentCallback){ pendingPaymentCallback(); pendingPaymentCallback=null; }
  },2800);
}

// Lancement du vrai traitement de paiement (après validation)
function lancerTraitementPaiement(){
  closePayment();
  showProcessing('Vérification 3D Secure…','Connexion à votre banque');
  setTimeout(()=>{ document.getElementById('processingText').innerText='Autorisation bancaire…'; document.getElementById('processingSub').innerText='Veuillez patienter'; },1200);
  setTimeout(()=>{ document.getElementById('processingText').innerText='Paiement accepté ✓'; document.getElementById('processingSpinner').style.borderTopColor='#30d158'; },2400);
  setTimeout(()=>{ hideProcessing(); showPaymentSuccess(currentPaymentAmount); },3000);
}

window.processCardPayment=function(){
  // CAS 1 : Carte sauvegardée sélectionnée → payer directement
  if(selectedSavedCardIndex>=0&&reglages.savedCards&&reglages.savedCards[selectedSavedCardIndex]){
    currentCardDesign=reglages.savedCards[selectedSavedCardIndex].design||currentCardDesign||'classic';
    lancerTraitementPaiement();
    return;
  }
  // CAS 2 : Nouvelle carte → valider les champs
  let num=document.getElementById('cardNumber').value.replace(/\s/g,'');
  let holder=document.getElementById('cardHolder').value.trim();
  let exp=document.getElementById('cardExpiry').value;
  let cvv=document.getElementById('cardCVV').value;
  if(num.length<16) return shakeInput('cardNumber','Numéro de carte invalide (16 chiffres)');
  if(!holder) return shakeInput('cardHolder','Entrez le nom du titulaire');
  if(exp.length<5) return shakeInput('cardExpiry',"Date d'expiration invalide (MM/AA)");
  if(cvv.length<3) return shakeInput('cardCVV','Code CVV invalide (3 chiffres)');

  // ===== ENREGISTREMENT : seulement ici, au moment du clic sur Payer =====
  if(document.getElementById('saveCardCheck').checked){
    if(!reglages.savedCards) reglages.savedCards=[];
    let type=num.startsWith('4')?'Visa':(num.startsWith('5')?'Mastercard':'CB');
    let newCard={type,last4:num.slice(-4),holder:holder.toUpperCase(),expiry:exp,design:normalizeCardDesignId(currentCardDesign)};
    if(reglages.savedCards.length>0){
      // Popup de remplacement seulement ici
      let existing=reglages.savedCards[reglages.savedCards.length-1];
      let replace=confirm(`Vous avez déjà une carte enregistrée (${existing.type} •••• ${existing.last4}).\n\nVoulez-vous la remplacer par la nouvelle carte ${type} •••• ${num.slice(-4)} ?\n\n• OK = remplacer\n• Annuler = ajouter en plus`);
      if(replace) reglages.savedCards=[newCard];
      else reglages.savedCards.push(newCard);
    } else {
      reglages.savedCards.push(newCard);
    }
    saveAll();
  }

  lancerTraitementPaiement();
};

window.processPayPalPayment=()=>{
  let email=document.getElementById('paypalEmail').value;
  let pass=document.getElementById('paypalPassword').value;
  if(!email||!email.includes('@')) return shakeInput('paypalEmail','Email invalide');
  if(!pass||pass.length<6) return shakeInput('paypalPassword','Mot de passe incorrect');
  closePayment();
  showProcessing('Connexion à PayPal…','Vérification des identifiants');
  document.getElementById('processingSpinner').style.borderTopColor='#009cde';
  setTimeout(()=>document.getElementById('processingText').innerText='Compte vérifié ✓',1500);
  setTimeout(()=>document.getElementById('processingText').innerText='Autorisation du paiement…',2200);
  setTimeout(()=>{ hideProcessing(); showPaymentSuccess(currentPaymentAmount); },3200);
};

// =============================================
// RÉSUMÉ & MINI SUIVI LIVRAISON
// =============================================
function buildOrderSummary(finalPrice,resumeItems,driverName){
  return {items:resumeItems,total:finalPrice,driver:driverName||'En recherche',distance:cartDistance,tip:currentTip,promo:promoActive?computePromoDiscount():0,cagnotte:currentCagnotteDeduction,mode:document.getElementById('deliveryModeSelect').value};
}
function renderOrderSummary(){
  let box=document.getElementById('orderSummaryContent'); if(!box) return;
  let s=lastOrderSummary;
  if(!s){ box.innerHTML='<p style="color:var(--text-dim);">Aucune commande récente.</p>'; return; }
  box.innerHTML=`<div class="row"><span>Articles</span><strong>${s.items}</strong></div><div class="row"><span>Livreur</span><strong>${s.driver}</strong></div><div class="row"><span>Distance</span><strong>${s.distance} km</strong></div><div class="row"><span>Promo</span><strong>-${(s.promo||0).toFixed(2)} €</strong></div><div class="row"><span>Cagnotte</span><strong>-${(s.cagnotte||0).toFixed(2)} €</strong></div><div class="row"><span>Pourboire</span><strong>${(s.tip||0).toFixed(2)} €</strong></div><div class="row"><span>Total payé</span><strong>${s.total.toFixed(2)} €</strong></div>`;
}
window.openOrderSummaryModal=function(){ renderOrderSummary(); document.getElementById('orderSummaryModal').classList.add('active'); };
window.closeOrderSummaryModal=function(){ document.getElementById('orderSummaryModal').classList.remove('active'); };
function showDeliveryMiniBubble(driver,etaText='Recherche…'){
  let b=document.getElementById('deliveryMiniBubble'); if(!b) return;
  if(driver){ document.getElementById('miniDriverPhoto').src=driver.photo; document.getElementById('miniDriverName').innerText=driver.name; }
  document.getElementById('miniEtaText').innerText=etaText;
  if(deliveryMiniVisible) b.classList.add('show');
}
function hideDeliveryMiniBubble(){ deliveryMiniVisible=false; let b=document.getElementById('deliveryMiniBubble'); if(b) b.classList.remove('show'); }
window.expandDeliveryTracking=function(){
  if(!deliveryInProgress) return;
  document.getElementById('clientApp').querySelectorAll('section').forEach(s=>s.classList.remove('active'));
  document.getElementById('tracking').classList.add('active');
  document.getElementById('clientNav').style.display='none';
  hideDeliveryMiniBubble();
};
window.minimizeDeliveryTracking=function(){
  if(!deliveryInProgress) return;
  document.getElementById('tracking').classList.remove('active');
  document.getElementById('clientNav').style.display='flex';
  deliveryMiniVisible=true;
  switchClientTab('home',document.querySelectorAll('#clientNav .navBtn')[0]);
  showDeliveryMiniBubble(currentDeliveryDriver,'En cours…');
};

// =============================================
// BOUTON PAYER (commande)
// =============================================
document.getElementById('payBtn').onclick=()=>{
  if(deliveryInProgress) return alert("Une livraison est déjà en cours. Tu peux préparer ton panier, mais attends la fin pour repayer.");
  if(cart.length===0) return alert("Ton panier est vide !");
  for(let item of cart){
    if(item.name==="Le Solo"&&reglages.ruptureSolo) return alert("Désolé, Le Solo vient de tomber en rupture !");
    if(item.name==="Le Duo"&&reglages.ruptureDuo) return alert("Désolé, Le Duo vient de tomber en rupture !");
    if(item.name==="Matelas Gonflable"&&reglages.ruptureGonflable) return alert("Désolé, le Gonflable vient de tomber en rupture !");
    if(item.name==="Lit Parapluie"&&reglages.ruptureBebe) return alert("Désolé, le Lit Parapluie vient de tomber en rupture !");
  }
  let deliveryMode=document.getElementById('deliveryModeSelect').value;
  let scheduledTime=document.getElementById('scheduledTimeInput').value;
  if(deliveryMode==='later'&&!scheduledTime) return alert("Veuillez choisir une heure de livraison !");
  let finalPrice=Number(document.getElementById('totalPrice').textContent);

  openPaymentModal(finalPrice,()=>{
    let totalSansTip=Math.round((finalPrice-currentTip)*100)/100;
    let resumeItems=cart.map(c=>`${c.name}${c.qty>1?' (x'+c.qty+')':''}`).join(', ');
    let sousTotalLits=cart.reduce((acc,c)=>acc+(c.price*c.qty),0);
    let cutDriver=sousTotalLits*0.4;
    let cutPatron=(sousTotalLits*0.6)+(reglages.isPremium&&cartDistance<=3.0?0:4.99)+2.99;
    if(promoActive) cutPatron-=computePromoDiscount();
    if(reglages.isPremium) cutPatron-=Math.round(sousTotalLits*0.15*100)/100;
    if(reglages.taxeNuit) cutPatron+=Math.round(sousTotalLits*0.20*100)/100;
    if(reglages.weatherSurge) cutPatron+=Math.round(sousTotalLits*0.25*100)/100;
    if(currentCagnotteDeduction>0) cutPatron-=currentCagnotteDeduction;

    if(deliveryMode==='later'){
      if(currentCagnotteDeduction>0){ reglages.cagnotte-=currentCagnotteDeduction; reglages.cagnotteSpent=(reglages.cagnotteSpent||0)+currentCagnotteDeduction; }
      let d2=new Date(); let dateStr=d2.toLocaleDateString('fr-FR');
      reglages.historiqueCommandes.push({id:Date.now(),date:dateStr,scheduledTime,prix:finalPrice,items:resumeItems,status:"En cours",cagnotteUsed:currentCagnotteDeduction});
      reglages.caTotal+=Math.max(0,cutPatron); reglages.totalOrders++;
      registerPromoUsageIfNeeded();
      updateAdminStats(); cart=[]; promoActive=false; currentTip=0;
      document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
      document.getElementById('promoMessage').style.display="none"; document.getElementById('promoInput').value="";
      document.getElementById('useCagnotteCheck').checked=false;
      mettreAJourVitrine(); updateCart(); mettreAJourHistorique(); saveAll();
      alert(`✅ Livraison programmée pour ${scheduledTime} !`);
      switchClientTab('profile',document.querySelectorAll('.navBtn')[2]); return;
    }

    // Livraison immédiate
    document.getElementById('clientApp').querySelectorAll('section').forEach(s=>s.classList.remove('active'));
    document.getElementById('clientNav').style.display='none';
    document.getElementById('tracking').classList.add('active');
    let bar=document.getElementById('progressBar'); let truck=document.getElementById('truckIcon');
    let title=document.getElementById('trackTitle'); let desc=document.getElementById('trackDesc');
    let backBtn=document.getElementById('backHomeBtn'); let cashDiv=document.getElementById('cashbackPopup');
    let showGps=document.getElementById('showGpsBtn'); let showChat=document.getElementById('showChatBtn');
    bar.style.width="5%"; truck.style.left="0%"; truck.innerText="🚚"; truck.style.opacity="1";
    title.innerText="Commande validée !"; desc.innerText="Recherche d'un livreur disponible...";
    backBtn.style.display="block"; backBtn.innerText="Réduire la commande"; cashDiv.style.display="none"; showGps.style.display="none"; showChat.style.display="none";
    let summaryBtn=document.getElementById("trackingSummaryBtn"); if(summaryBtn) summaryBtn.style.display="block";
    document.getElementById('chatZone').style.display="none"; document.getElementById('chatHistory').innerHTML="";
    document.getElementById('ratingDiv').style.display="none"; document.getElementById('merciAvis').style.display="none";
    document.querySelectorAll('#starContainer .star').forEach(st=>st.classList.remove('active'));
    document.getElementById('submitReviewBtn').style.display='block'; document.getElementById('submitReviewBtn').disabled=false;
    document.getElementById('commentInput').style.display='block'; document.getElementById('commentInput').value="";
    currentClientRating=0;
    currentDeliveryDriver=getAvailableDriver(reglages.isPremium);
    if(!currentDeliveryDriver){ alert("Aucun livreur disponible !"); return; }
    let nomAff=currentDeliveryDriver.name+(currentDeliveryDriver.isPro?' 👑':'');
    document.getElementById('livreurName').innerText=nomAff;
    document.getElementById('rateLivreurName').innerText=nomAff;
    document.getElementById('livreurNote').innerText="★ "+currentDeliveryDriver.rating;
    document.getElementById('clientLivreurPhoto').src=currentDeliveryDriver.photo;
    document.getElementById('clientLivreurPhoto').style.display="block";
    document.getElementById('driverProfile').style.display="flex";
    deliveryInProgress=true;
    lastOrderSummary=buildOrderSummary(finalPrice,resumeItems,nomAff);
    showDeliveryMiniBubble(currentDeliveryDriver,'Recherche…');
    currentDeliveryDriver.earnings+=cutDriver;
    if(currentTip>0) currentDeliveryDriver.tips+=currentTip;
    currentDeliveryDriver.totalOrders++;
    cleanupDeliveryTimers();
    deliveryStageTimer=setTimeout(()=>{
      bar.style.width="50%"; truck.style.left="45%";
      title.innerText="En route 🛵"; desc.innerText=currentDeliveryDriver.name+" slalome entre les voitures !";
      showGps.style.display="inline-block"; showChat.style.display="inline-block";
      showDeliveryMiniBubble(currentDeliveryDriver,'En route • ~25 min');
      initGPSDelivery(currentDeliveryDriver); openClientGPS();
    },1000);
    deliveryFinishTimer=setTimeout(()=>{
      bar.style.width="100%"; truck.style.left="90%"; truck.style.opacity="0";
      setTimeout(()=>{ truck.innerText="✅"; truck.style.opacity="1"; },500);
      title.innerText="Il est là ! 🚨"; desc.innerText="Descends vite chercher ton lit !";
      deliveryFinishTimer=null; deliveryStageTimer=null; expandDeliveryTracking(); deliveryInProgress=false; hideDeliveryMiniBubble(); document.getElementById('clientNav').style.display='none';
      backBtn.innerText="Retour à l'accueil"; backBtn.style.display="block"; let summaryBtn2=document.getElementById("trackingSummaryBtn"); if(summaryBtn2) summaryBtn2.style.display="block"; document.getElementById('ratingDiv').style.display="block";
      showGps.style.display="none"; showChat.style.display="none";
      document.getElementById('chatZone').style.display="none"; document.getElementById('gpsModal').style.display="none";
      if(window.etaInt) clearInterval(window.etaInt);
      if(currentCagnotteDeduction>0){ reglages.cagnotte-=currentCagnotteDeduction; reglages.cagnotteSpent=(reglages.cagnotteSpent||0)+currentCagnotteDeduction; }
      if(cart.some(c=>c.options.some(o=>o.name==="☁️ Coussin"&&o.price===0))) reglages.moisCoussinGratuit=new Date().getMonth();
      if(reglages.isPremium&&totalSansTip>0){
        let gain=(Math.random()*(5-2)+2).toFixed(2); reglages.cagnotte+=parseFloat(gain);
        document.getElementById('cashbackWon').innerText=gain; cashDiv.style.display="block";
        appliquerAvatarEtPremium(); appliquerThemeEtPremium();
      }
      let d3=new Date(); let ds=d3.toLocaleDateString('fr-FR')+" à "+d3.getHours()+"h"+(d3.getMinutes()<10?'0':'')+d3.getMinutes();
      reglages.historiqueCommandes.push({id:Date.now(),date:ds,prix:finalPrice,items:resumeItems,status:"Terminée"});
      mettreAJourHistorique(); reglages.caTotal+=Math.max(0,cutPatron); reglages.totalOrders++;
      addAdminActionLog("Commande terminée",Math.max(0,cutPatron));
      updateAdminStats(); cart=[]; promoActive=false; currentTip=0;
      document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
      document.getElementById('promoMessage').style.display="none"; document.getElementById('promoInput').value="";
      document.getElementById('useCagnotteCheck').checked=false;
      mettreAJourVitrine(); updateCart(); saveAll();
    },35000);
  });
};

document.getElementById('backHomeBtn').onclick=()=>{
  if(deliveryInProgress){ minimizeDeliveryTracking(); return; }
  document.getElementById('tracking').classList.remove('active');
  document.getElementById('home').classList.add('active');
  document.getElementById('clientNav').style.display='flex';
  document.getElementById('driverProfile').style.display="none";
  let summaryBtn=document.getElementById("trackingSummaryBtn"); if(summaryBtn) summaryBtn.style.display="none";
  document.getElementById('chatHistory').innerHTML="";
  if(window.etaInt) clearInterval(window.etaInt);
  document.getElementById('clientNav').querySelectorAll('.navBtn').forEach((b,i)=>b.classList.toggle('active',i===0));
  currentClientTab='home';
  updateClientNavIndicator();
};

// =============================================
// ADMIN DRIVERS
// =============================================
window.switchDriverTab=function(type,btn){
  document.querySelectorAll('.admin-tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tabActifs').style.display=type==='actifs'?'block':'none';
  document.getElementById('tabRecrutement').style.display=type==='recrutement'?'block':'none';
  let map=document.getElementById('adminMap'); if(map) map.style.display=type==='recrutement'?'none':'block';
  renderAdminDrivers();
};
function updateDriverRecruitmentUI(){
  let btn=document.getElementById('adminRecruitToggleBtn');
  let hint=document.getElementById('adminRecruitHint');
  let registerBtn=document.getElementById('driverRegisterChoiceBtn');
  let closed=!!reglages.driverRecruitmentClosed;
  if(btn){ btn.innerText=closed?'Réouvrir les recrutements':'Arrêter les recrutements'; btn.style.background=closed?'var(--accent-green)':'var(--accent-red)'; }
  if(hint){ hint.innerText=closed?'Recrutements fermés : les candidats ne peuvent plus s’inscrire.':'Candidatures reçues + profils disponibles.'; }
  if(registerBtn){ registerBtn.classList.toggle('disabled',closed); registerBtn.innerText=closed?'Inscriptions fermées':'S’inscrire'; }
}
window.toggleDriverRecruitments=function(){
  reglages.driverRecruitmentClosed=!reglages.driverRecruitmentClosed;
  addAdminActionLog(`Recrutements livreurs ${reglages.driverRecruitmentClosed?'fermés':'ouverts'}`,0);
  updateDriverRecruitmentUI(); saveAll(); renderAdminDrivers();
};
window.togglePro=function(id){ let d=drivers.find(x=>x.id===id); d.isPro=!d.isPro; addAdminActionLog(`${d.name} ${d.isPro?'passé PRO':'repassé STANDARD'}`,0); renderAdminDrivers(); saveAll(); };
window.renderAdminDrivers=function(){
  let listActifs=document.getElementById('adminDriverList');
  let searchStr=(document.getElementById('adminDriverSearch')||{value:''}).value.toLowerCase();
  let listRecruts=document.getElementById('adminRecruitList');
  let actifs=drivers.filter(d=>!d.fired&&d.status!=="Non recruté"&&d.status!=="Refusé"&&d.name.toLowerCase().includes(searchStr));
  let recruts=drivers.filter(d=>!d.fired&&d.status==="Non recruté"&&d.name.toLowerCase().includes(searchStr));
  let applications=getDriverApplications().filter(a=>a.status==='pending');
  updateDriverRecruitmentUI();
  document.getElementById('countActifs').innerText=actifs.length;
  document.getElementById('countRecruts').innerText=recruts.length+applications.length;
  listActifs.innerHTML=actifs.map(d=>`<div class="driver-card-admin" onclick="openDriverModal(${d.id})"><div style="display:flex;align-items:center;gap:10px;"><img src="${d.photo}" class="driver-avatar"><div><strong>${d.name}${d.isPro?' 👑':''}</strong> <span style="background:rgba(34,197,94,0.2);color:var(--accent-green);padding:2px 6px;border-radius:5px;font-size:10px;">💰 ${d.tips}€</span><br><small style="color:var(--text-dim);">⭐ ${d.rating} • ${d.totalOrders} courses • ${d.status==='En livraison 🛵'?'<span style="color:var(--accent-blue);font-weight:bold;">'+d.status+'</span>':d.status}</small></div></div><div style="display:flex;gap:5px;" onclick="event.stopPropagation()"><button onclick="togglePro(${d.id})" style="padding:6px;margin:0;width:auto;font-size:10px;background:${d.isPro?'var(--text-dim)':'var(--accent-blue)'};color:#fff;border-radius:8px;">${d.isPro?'STANDARD':'PRO'}</button><button onclick="fireDriver(${d.id})" style="padding:6px;margin:0;width:auto;font-size:10px;background:var(--accent-red);color:#fff;border-radius:8px;">VIRER</button></div></div>`).join('');
  let appsHTML=applications.map(a=>`<div class="driver-card-admin driver-application-card" onclick="openDriverApplicationModal(${a.id})"><div style="display:flex;align-items:center;gap:10px;"><img src="${a.photo||DEFAULT_DRIVER_PHOTO}" class="driver-avatar"><div><strong>${a.firstName||'Candidat'} ${a.lastName||''}</strong> <span class="driver-application-status">Formulaire</span><br><small style="color:var(--text-dim);">${a.city||'Ville inconnue'} • ${a.vehicle||'véhicule ?'} • ${a.email}</small></div></div><button onclick="event.stopPropagation();openDriverApplicationModal(${a.id})" style="padding:6px 12px;margin:0;width:auto;font-size:11px;background:var(--accent-blue);color:#000;border-radius:8px;font-weight:bold;">Voir</button></div>`).join('');
  let poolHTML=recruts.map(d=>`<div class="driver-card-admin driver-fake-form-card" onclick="openDriverPoolApplicationModal(${d.id})"><div style="display:flex;align-items:center;gap:10px;"><img src="${d.photo}" class="driver-avatar" style="opacity:0.9;"><div><strong>${d.name}</strong> <span class="driver-application-status">Formulaire</span><br><small style="color:var(--text-dim);">${(d.fakeForm&&d.fakeForm.city)||'Tours'} • ${(d.fakeForm&&d.fakeForm.vehicle)||'Véhicule ?'}</small></div></div><button onclick="event.stopPropagation();openDriverPoolApplicationModal(${d.id})" style="padding:6px 12px;margin:0;width:auto;font-size:11px;background:var(--accent-blue);color:#000;border-radius:8px;font-weight:bold;">Voir formulaire</button></div>`).join('');
  listRecruts.innerHTML=(appsHTML||'')+(poolHTML||'');
  drawMapMarkers();
};

window.openDriverApplicationModal=function(id){
  let a=getDriverApplications().find(x=>x.id===id);
  if(!a) return alert('Candidature introuvable.');
  document.getElementById('adminModalContent').innerHTML=`
    <img src="${a.photo||DEFAULT_DRIVER_PHOTO}" class="modal-avatar-large">
    <h3 style="margin:0;">${a.firstName||'Candidat'} ${a.lastName||''}</h3>
    <div style="color:var(--accent-blue);font-weight:bold;margin-bottom:15px;">Candidature livreur</div>
    <div class="driver-form-mini">
      <b>Email :</b> ${a.email}<br>
      <b>Âge :</b> ${a.age||'Non renseigné'}<br>
      <b>Ville :</b> ${a.city||'Non renseignée'}<br>
      <b>Téléphone/pseudo :</b> ${a.phone||'Non renseigné'}<br>
      <b>Expérience :</b> ${a.experience||'Non renseignée'}<br>
      <b>Véhicule :</b> ${a.vehicle||'Non renseigné'}<br>
      <b>Disponibilités :</b> ${a.availability||'Non renseignées'}<br>
      <b>Zone :</b> ${a.area||'Non renseignée'}<br>
      <b>Port de matelas :</b> ${a.heavy||'Non renseigné'}<br>
      <b>Date :</b> ${a.createdAt||'Aujourd’hui'}
    </div>
    <h4 style="color:white;text-align:left;">Formulaire</h4>
    <div class="driver-form-mini"><b>Motivation :</b><br>${(a.motivation||'Aucune motivation écrite.').replace(/</g,'&lt;')}<br><br><b>Infos en plus :</b><br>${(a.notes||'Aucune note.').replace(/</g,'&lt;')}</div>
    <div style="display:flex;gap:10px;margin-top:12px;">
      <button onclick="acceptDriverApplication(${a.id})" style="background:var(--accent-green);color:white;">Recruter</button>
      <button onclick="refuseDriverApplication(${a.id})" style="background:var(--accent-red);color:white;">Refuser</button>
    </div>`;
  document.getElementById('adminModal').classList.add('active');
};
window.acceptDriverApplication=function(id){
  let a=getDriverApplications().find(x=>x.id===id);
  if(!a) return;
  if(a.status==='accepted') return alert('Déjà recruté.');
  let newId=Math.max(0,...drivers.map(d=>d.id||0))+1;
  let name=((a.firstName||'Livreur')+' '+(a.lastName||'Lago')).trim();
  let d={id:newId,name,email:a.email,password:a.password,bio:a.motivation||'Nouveau livreur Lago.',rating:5.0,votes:1,isPro:false,fired:false,photo:a.photo||DEFAULT_DRIVER_PHOTO,hireDate:new Date().toLocaleDateString('fr-FR'),totalOrders:0,status:'En attente',tips:0,earnings:0,comments:[],lat:TOURS_LAT-0.02+Math.random()*0.04,lng:TOURS_LNG-0.03+Math.random()*0.06,applicationId:a.id,vehicle:a.vehicle,availability:a.availability,city:a.city,area:a.area,experience:a.experience,phone:a.phone,heavy:a.heavy};
  drivers.push(d);
  a.status='accepted'; a.driverId=newId; a.reviewedAt=new Date().toLocaleDateString('fr-FR');
  addAdminActionLog(`${name} recruté via formulaire`,0);
  closeAdminModal(); renderAdminDrivers(); saveAll();
};
window.refuseDriverApplication=function(id){
  let a=getDriverApplications().find(x=>x.id===id);
  if(!a) return;
  if(confirm('Refuser cette candidature ?')){
    a.status='refused'; a.reviewedAt=new Date().toLocaleDateString('fr-FR');
    addAdminActionLog(`Candidature refusée : ${a.email}`,0);
    closeAdminModal(); renderAdminDrivers(); saveAll();
  }
};

window.openDriverPoolApplicationModal=function(id){
  let d=drivers.find(x=>x.id===id);
  if(!d) return alert('Livreur introuvable.');
  if(!d.fakeForm) d.fakeForm=buildFakeDriverForm(d);
  let a=d.fakeForm;
  document.getElementById('adminModalContent').innerHTML=`
    <img src="${a.photo||d.photo||DEFAULT_DRIVER_PHOTO}" class="modal-avatar-large">
    <h3 style="margin:0;">${a.firstName||d.name||'Candidat'} ${a.lastName||''}</h3>
    <div style="color:var(--accent-blue);font-weight:bold;margin-bottom:15px;">Formulaire de recrutement</div>
    <div class="driver-form-mini">
      <b>Email :</b> ${a.email||d.email||'Non renseigné'}<br>
      <b>Âge :</b> ${a.age||'Non renseigné'}<br>
      <b>Ville :</b> ${a.city||'Non renseignée'}<br>
      <b>Téléphone/pseudo :</b> ${a.phone||'Non renseigné'}<br>
      <b>Expérience :</b> ${a.experience||'Non renseignée'}<br>
      <b>Véhicule :</b> ${a.vehicle||'Non renseigné'}<br>
      <b>Disponibilités :</b> ${a.availability||'Non renseignées'}<br>
      <b>Zone :</b> ${a.area||'Non renseignée'}<br>
      <b>Port de matelas :</b> ${a.heavy||'Non renseigné'}<br>
      <b>Date :</b> ${a.createdAt||'Simulation'}
    </div>
    <h4 style="color:white;text-align:left;">Réponses du formulaire</h4>
    <div class="driver-form-mini"><b>Motivation :</b><br>${String(a.motivation||d.bio||'Motivé pour rejoindre Lago.').replace(/</g,'&lt;')}<br><br><b>Infos en plus :</b><br>${String(a.notes||'Aucune note.').replace(/</g,'&lt;')}</div>
    <div style="display:flex;gap:10px;margin-top:12px;">
      <button onclick="hireDriverFromPool(${d.id})" style="background:var(--accent-green);color:white;">Recruter</button>
      <button onclick="refuseDriverFromPool(${d.id})" style="background:var(--accent-red);color:white;">Refuser</button>
    </div>`;
  document.getElementById('adminModal').classList.add('active');
};
window.hireDriverFromPool=function(id){
  let d=drivers.find(x=>x.id===id);
  if(!d) return;
  d.status='En attente';
  d.fired=false;
  d.hireDate=new Date().toLocaleDateString('fr-FR');
  d.totalOrders=0; d.tips=0; d.earnings=0; d.rating=5.0; d.votes=1; d.comments=[];
  addAdminActionLog(`${d.name} recruté depuis formulaire`,0);
  closeAdminModal(); renderAdminDrivers(); saveAll();
};
window.refuseDriverFromPool=function(id){
  let d=drivers.find(x=>x.id===id);
  if(!d) return;
  if(confirm('Refuser ce formulaire ?')){
    d.status='Refusé';
    addAdminActionLog(`Formulaire refusé : ${d.name}`,0);
    closeAdminModal(); renderAdminDrivers(); saveAll();
  }
};

window.fireDriver=function(id){ if(confirm("Licencier définitivement ce livreur ?")){ let d=drivers.find(x=>x.id===id); d.fired=true; d.status="Viré"; addAdminActionLog(`${d.name} viré`,0); renderAdminDrivers(); saveAll(); } };
window.hireDriver=function(id){ let d=drivers.find(x=>x.id===id); d.status="En attente"; d.totalOrders=0; d.tips=0; d.earnings=0; d.rating=5.0; d.votes=1; d.comments=[]; addAdminActionLog(`${d.name} recruté`,0); renderAdminDrivers(); saveAll(); };
window.renderAdminUsers=function(){
  let list=document.getElementById('adminUserList');
  let searchStr=(document.getElementById('adminUserSearch')||{value:''}).value.toLowerCase();
  document.getElementById('countUsersAdmin').innerText=fakeUsers.length;
  let filtered=fakeUsers.filter(u=>u.email.toLowerCase().includes(searchStr));
  list.innerHTML=filtered.map(u=>`<div style="font-size:12px;padding:8px 5px;border-bottom:1px solid var(--glass-border);display:flex;justify-content:space-between;align-items:center;cursor:pointer;" onclick="openUserModal(${u.id})"><div style="display:flex;align-items:center;gap:10px;"><img src="${u.avatarUrl}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;border:2px solid ${u.isVip?'var(--accent-gold)':'var(--glass-border)'}"><span>${u.email}<br><small style="color:var(--text-dim);">${u.orders} commandes</small></span></div><div style="display:flex;align-items:center;gap:10px;"><span style="color:${u.isVip?'var(--accent-gold)':'var(--text-dim)'};font-weight:bold;">${u.isVip?'👑 VIP':'Client'}</span>${!u.banni?`<button style="background:var(--accent-red);color:white;border:none;border-radius:4px;padding:2px 6px;font-size:10px;cursor:pointer;" onclick="event.stopPropagation();banUser(${u.id})">❌</button>`:'<span style="color:var(--accent-red);font-size:10px;font-weight:bold;">BANNI</span>'}</div></div>`).join('');
};
function updateAdminStats(){
  let ca=Number(reglages.caTotal)||0;
  document.getElementById('statsCATotal').innerText=ca.toFixed(2)+" €";
  document.getElementById('statsTotalOrders').innerText=(reglages.totalOrders||0);
  let trend=document.getElementById('statsTrendIndicator');
  if(trend){
    let base=lastCATrendBase;
    if(base===null || typeof base==='undefined') base=0;
    let diff=Math.round((ca-base)*100)/100;
    trend.className='stats-trend '+(diff<0?'loss':(diff>0?'gain':'neutral'));
    trend.innerText=(diff<0?`↘ ${diff.toFixed(2)} €`:(diff>0?`↗ +${diff.toFixed(2)} €`:'→ 0.00 €'))+' depuis l’ouverture';
  }
  lastCATrendBase=ca;
}

// =============================================
// GPS LIVRAISON
// =============================================
function initGPSDelivery(driver){
  if(mapClient){ mapClient.remove(); mapClient=null; }
  mapClient=L.map('clientMap',{zoomControl:false}).setView([TOURS_LAT,TOURS_LNG],14);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapClient);
  if(window.etaInt) clearInterval(window.etaInt);
  let sLat=driver.lat,sLng=driver.lng;
  let eLat=sLat+(Math.random()*0.02-0.01),eLng=sLng+(Math.random()*0.02-0.01);
  let line=L.polyline([[sLat,sLng],[eLat,eLng]],{color:'var(--accent-blue)',weight:4,dashArray:'10, 10'}).addTo(mapClient);
  mapClient.fitBounds(line.getBounds(),{padding:[50,50]});
  let icon=L.divIcon({className:'driver-marker-icon-client',html:'🛵',iconSize:[30,30]});
  clientMarker=L.marker([sLat,sLng],{icon}).addTo(mapClient);
  animateMarker(clientMarker,sLat,sLng,eLat,eLng,25000);
  let timeLeft=Math.floor(cartDistance*4)+10;
  document.getElementById('etaTimer').innerText=timeLeft;
  window.etaInt=setInterval(()=>{
    timeLeft--; if(timeLeft<=0){ clearInterval(window.etaInt); document.getElementById('etaTimer').innerText=0; }
    else document.getElementById('etaTimer').innerText=timeLeft;
  },60000);
}
window.openClientGPS=function(){
  document.getElementById('gpsModal').style.display='flex';
  if(mapClient) setTimeout(()=>mapClient.invalidateSize(),200);
};


// Intro Lago simple, épurée, sans thème saisonnier
function startSimpleIntro(){}
