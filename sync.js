(()=>{const C=window.YC_CFG;if(!C)return;
if(!C.key||/COLLER/.test(C.key)||!window.supabase){window.doAuth=()=>toast('Renseignez la clé publique Supabase dans config.js');return}
const SB=supabase.createClient(C.url,C.key);let T,known=new Set();
const row=r=>({...r.data,id:r.id,uid:r.owner,active:r.active?1:0,mod:+new Date(r.updated_at)});
async function boot(){const{data:{session}}=await SB.auth.getSession();
 if(!session){S.me=null;S.cards=S.cards.filter(c=>c._p);return R()}
 const id=session.user.id,{data:me}=await SB.from('profiles').select('*').eq('id',id).single();if(!me)return R();
 const adm=me.role=='admin',pr=adm?(await SB.from('profiles').select('*')).data:[me];
 S.users=pr.map(p=>({id:p.id,name:p.name,email:p.email,role:p.role,on:!p.suspended}));S.me=id;
 let q=SB.from('cards').select('*');if(!adm)q=q.eq('owner',id);const cs=(await q).data||[];S.cards=cs.map(row);known=new Set(cs.map(r=>r.id));
 S.rdv=((await SB.from('appointments').select('*')).data||[]).map(r=>({...r.data,cid:r.card_id,t:+new Date(r.created_at)}));R()}
async function push(){if(!S.me)return;const me=U();if(!me)return;
 const mine=S.cards.filter(c=>c.uid==S.me&&!c._p);
 if(mine.length)await SB.from('cards').upsert(mine.map(c=>{const{id,uid,mod,active,...d}=c;return{id,owner:uid,data:d,active:!!active,updated_at:new Date().toISOString()}}));
 const ids=new Set(S.cards.map(c=>c.id));for(const k of known)if(!ids.has(k))await SB.from('cards').delete().eq('id',k);
 known=new Set(mine.map(c=>c.id));
 await SB.from('profiles').update({name:me.name}).eq('id',S.me);
 if(me.role=='admin')for(const u of S.users)if(u.id!=S.me&&!u._p)await SB.from('profiles').update({suspended:!u.on,role:u.role}).eq('id',u.id)}
window.onSave=()=>{clearTimeout(T);T=setTimeout(()=>push().catch(()=>toast('Synchronisation impossible')),900)};
window.doAuth=async()=>{const e=$('#ae').value.trim().toLowerCase(),p=$('#ap').value,n=$('#an')?$('#an').value.trim():'';
 if(!/^\S+@\S+\.\S+$/.test(e)||(am!='fg'&&p.length<6))return toast('E-mail ou mot de passe invalide');
 if(am=='fg'){const r=await SB.auth.resetPasswordForEmail(e,{redirectTo:location.href.split('#')[0]});return toast(r.error?'Erreur : '+r.error.message:'E-mail de réinitialisation envoyé')}
 if(am=='up'){const r=await SB.auth.signUp({email:e,password:p,options:{data:{name:n}}});if(r.error)return toast('Inscription refusée : accès restreint pour le moment');if(!r.data.session)return toast('Vérifiez votre e-mail pour confirmer le compte')}
 else{const r=await SB.auth.signInWithPassword({email:e,password:p});if(r.error)return toast('Identifiants incorrects')}
 v='home';await boot()};
window.logout=async()=>{await SB.auth.signOut();S.me=null;S.cards=[];S.rdv=[];R()};
const _R=window.R;
async function pubLoad(id){$('#app').innerHTML='<div class=box>Chargement…</div>';const{data}=await SB.from('cards').select('*').eq('id',id).maybeSingle();
 if(data){const c=row(data);c._p=1;S.cards.push(c);if(!S.users.some(u=>u.id==c.uid))S.users.push({id:c.uid,name:'',on:1,role:'user',_p:1})}_R()}
window.R=function(){const m=location.hash.match(/^#c-(.+)/);if(m&&!S.cards.some(c=>c.id==m[1])){pubLoad(m[1]);return}_R()};
const _rs=window.rdSend;window.rdSend=async id=>{const n=S.rdv.length;_rs(id);if(S.rdv.length>n){const{cid,...d}=S.rdv[n];await SB.from('appointments').insert({card_id:id,data:d})}};
SB.auth.onAuthStateChange(async ev=>{if(ev=='PASSWORD_RECOVERY'){const p=prompt('Nouveau mot de passe (6 caractères min.)');if(p&&p.length>5){const r=await SB.auth.updateUser({password:p});toast(r.error?r.error.message:'Mot de passe modifié')}boot()}});
boot()})();
