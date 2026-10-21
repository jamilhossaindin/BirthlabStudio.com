module.exports = function brandBoard(b,w,h,seed=0,options={}){
 const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
 const W=1600,H=1600*h/w,pad=Math.min(95,H*.13),time=options.time||0;
 const text=(x,y,size,str,color=b.ink,weight=600,extra="")=>`<text x="${x}" y="${y}" fill="${color}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}" ${extra}>${esc(str)}</text>`;
 const rect=(x,y,ww,hh,fill,rx=0,attrs="")=>`<rect x="${x}" y="${y}" width="${ww}" height="${hh}" rx="${rx}" fill="${fill}" ${attrs}/>`;
 const circle=(x,y,r,fill,attrs="")=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${attrs}/>`;
 const line=(x,y,xx,yy,c=b.ink,sw=2)=>`<path d="M${x} ${y}L${xx} ${yy}" fill="none" stroke="${c}" stroke-width="${sw}"/>`;
 const nameSize=Math.min(190,1420/Math.max(5,b.name.length)*1.63);
 function motif(x,y,s,color=b.accent,variant=0){
   let out=""; const f=s/600;
   if(b.shape==="cycle"){out=circle(170,360,135,"none",`stroke="${color}" stroke-width="20"`)+circle(470,360,135,"none",`stroke="${color}" stroke-width="20"`)+`<path d="M170 360L285 130L390 360H170L300 240H445L470 360M260 130H330M424 190L445 240" fill="none" stroke="${color}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>`;}
   else if(b.shape==="landscape"){out=rect(0,0,600,600,b.secondary,32)+circle(425,130,65,b.accent)+`<path d="M0 430L205 160L405 435L505 300L600 430V600H0Z" fill="${b.ink}"/><path d="M0 480Q175 390 300 500T600 450V600H0Z" fill="${b.accent}"/><path d="M300 600Q170 520 320 455T270 350" fill="none" stroke="${b.paper}" stroke-width="17"/>`;}
   else if(b.shape==="harbour"){out=rect(0,0,600,600,b.paper,24)+circle(440,125,74,b.accent)+`<path d="M0 395Q130 365 260 395T600 395V600H0Z" fill="${b.secondary}"/><path d="M0 480Q150 440 300 480T600 480" fill="none" stroke="${b.ink}" stroke-width="9"/><path d="M265 410V145L130 350H265L380 350L285 225M140 420H370L335 455H180Z" fill="${b.ink}"/><path d="M0 310Q280 245 600 300" fill="none" stroke="${b.ink}" stroke-width="9"/>`;}
   else if(b.shape==="leaf"){for(let i=0;i<7;i++){let yy=460-i*50;out+=`<ellipse cx="${290-i*7}" cy="${yy}" rx="65" ry="22" transform="rotate(-28 ${290-i*7} ${yy})" fill="${i%2?b.secondary:b.ink}"/><ellipse cx="${375-i*7}" cy="${yy-28}" rx="65" ry="22" transform="rotate(28 ${375-i*7} ${yy-28})" fill="${b.ink}"/>`;}out+=`<path d="M280 550Q360 330 315 115" fill="none" stroke="${b.ink}" stroke-width="9"/>`;}
   else if(b.shape==="sun"){out=circle(300,330,155,color);for(let i=0;i<14;i++){const a=i/14*Math.PI*2;out+=line(300+Math.cos(a)*200,330+Math.sin(a)*200,300+Math.cos(a)*255,330+Math.sin(a)*255,color,13);}out+=rect(80,330,440,220,b.paper)+line(65,340,535,340,b.ink,5);}
   else if(b.shape==="sound"||b.shape==="threads"){for(let i=0;i<12;i++){const hh=70+Math.abs(Math.sin(i*.72+time))*330;out+=rect(35+i*46,300-hh/2,24,hh,i%3===0?b.secondary:color,12);}if(b.shape==="threads")out+=`<path d="M0 480Q200 200 390 450T600 370" fill="none" stroke="${b.ink}" stroke-width="13"/>`;}
   else if(b.shape==="bottle"){out=rect(190,100,200,340,b.ink,45)+rect(215,45,150,90,b.secondary,14)+rect(205,220,170,155,b.paper,5)+text(227,275,28,"ROOT")+text(227,313,28,"RITUAL")+rect(90,450,420,35,b.accent,18)+circle(440,185,75,b.secondary);}
   else if(b.shape==="star"||b.shape==="north"){out=`<path d="M300 40L355 225L540 160L410 300L560 430L355 380L300 570L245 380L45 450L180 300L45 150L245 225Z" fill="${color}"/>`;if(b.shape==="north")out=`<path d="M110 500V100H225L400 340V100H515V500H400L225 260V500Z" fill="${color}"/>`;}
   else if(b.shape==="links"||b.shape==="cart"){out=rect(90,80,420,440,b.paper,40,`stroke="${b.ink}" stroke-width="6"`)+circle(300,190,65,b.secondary)+rect(155,300,290,55,color,27)+rect(155,380,290,55,b.secondary,27)+line(260,190,340,190,b.ink,8)+line(300,150,300,230,b.ink,8);}
   else if(b.shape==="frames"){out=rect(0,0,350,420,b.secondary)+rect(200,140,400,460,b.accent)+circle(290,300,145,b.ink)+rect(40,45,280,290,"none",0,`stroke="${b.paper}" stroke-width="10"`);}
   else if(b.shape==="signal"){out=rect(30,100,540,390,b.ink,42)+rect(60,135,425,315,color,28);for(let i=0;i<7;i++)out+=`<path d="M75 ${200+i*30}Q210 ${125+i*35+Math.sin(time+i)*20} 330 ${225+i*25}T470 ${210+i*30}" fill="none" stroke="${b.secondary}" stroke-width="12"/>`;out+=circle(525,210,12,b.paper)+circle(525,270,12,b.paper)+line(230,100,160,10,b.ink,13)+line(330,100,410,10,b.ink,13);}
   else if(b.shape==="orbit"){out=`<ellipse cx="300" cy="300" rx="270" ry="125" fill="none" stroke="${b.secondary}" stroke-width="8" transform="rotate(-30 300 300)"/>`+circle(300,300,155,color)+circle(270,250,80,b.paper,`opacity=".35"`)+circle(545,205,33,b.ink)+`<path d="M80 490Q340 590 535 390" fill="none" stroke="${b.ink}" stroke-width="9"/>`;}
   else {for(let yy=0;yy<3;yy++)for(let xx=0;xx<3;xx++){const j=(xx+yy+variant)%3;out+=j===0?rect(xx*195,yy*195,185,185,color,20):j===1?circle(xx*195+92,yy*195+92,90,b.secondary):`<path d="M${xx*195} ${yy*195+185}A185 185 0 0 1 ${xx*195+185} ${yy*195}V${yy*195+185}Z" fill="${b.ink}"/>`;}}
   return `<g transform="translate(${x} ${y}) scale(${f})">${out}</g>`;
 }
 function browserWindow(x,y,ww,hh,dark=false){
  const paper=dark?b.ink:b.paper,ink=dark?b.paper:b.ink;let out=rect(x,y,ww,hh,paper,20,`filter="url(#shadow)"`)+rect(x,y,ww,38,ink,20)+rect(x,y+20,ww,18,ink);
  for(let i=0;i<3;i++)out+=circle(x+22+i*18,y+19,5,paper,`opacity=".7"`);
  out+=text(x+ww*.4,y+25,12,b.name+" / STUDIO CONCEPT",paper,400);
  out+=text(x+ww*.055,y+hh*.17,Math.min(ww*.055,55),b.name,ink);
  out+=text(x+ww*.65,y+hh*.17,Math.min(ww*.016,15),"WORK     ABOUT     CONTACT",ink,400);
  const usable=hh-90,heroTop=y+hh*.24;
  out+=text(x+ww*.055,heroTop+usable*.13,Math.min(ww*.055,55,ww*.49/(b.tag.split(". ")[0].length*.53)),b.tag.split(". ")[0]+".",ink);
  out+=text(x+ww*.055,heroTop+usable*.27,Math.min(ww*.023,22),"A concept in identity, digital and creative direction.",ink,400);
  out+=rect(x+ww*.055,heroTop+usable*.35,ww*.18,ww*.045,b.accent,ww*.022)+text(x+ww*.078,heroTop+usable*.35+ww*.03,Math.min(ww*.019,18),"Explore the idea",b.ink);
  out+=motif(x+ww*.60,heroTop,Math.min(ww*.31,usable*.76),b.accent,seed);
  for(let i=0;i<3;i++){const yy=y+hh*.77;out+=rect(x+ww*(.055+i*.3),yy,ww*.27,hh*.13,i%2?b.secondary:b.accent,8)+text(x+ww*(.075+i*.3),yy+hh*.075,Math.min(ww*.021,20),["01 / Identity","02 / Digital","03 / Motion"][i],b.ink);}
  return out;
 }
 const defs=`<defs><filter id="shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="${b.ink}" flood-opacity=".18"/></filter><pattern id="grid" width="70" height="70" patternUnits="userSpaceOnUse"><path d="M70 0H0V70" fill="none" stroke="${b.ink}" stroke-opacity=".07" stroke-width="1"/></pattern><linearGradient id="wash" x2="1" y2="1"><stop stop-color="${b.paper}"/><stop offset="1" stop-color="${b.secondary}"/></linearGradient></defs>`;
 let art=defs+rect(0,0,W,H,b.paper)+rect(0,0,W,H,"url(#grid)");
 const isTiny=options.role==="icon"||(Math.min(w,h)<220&&w/h<2);
 if(isTiny){art=rect(0,0,W,H,"#0965ff",W*.2)+text(W*.5,H*.72,Math.min(W,H)*.68,(b.slug==="studio"?"B":b.name[0]),"#fff",600,'text-anchor="middle"');}
 else if(options.role==="avatar"){art+=circle(800,H*.5,Math.min(610,H*.42),b.ink)+text(800,H*.5+Math.min(H*.16,220),Math.min(H*.55,650),"B",b.paper,600,'text-anchor="middle"');}
 else if(options.photo&&((seed%5===0)||options.forcePhoto)){
   art+=`<image href="${esc(options.photo)}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>`;
   if(seed%2){const bh=Math.min(190,H*.2);art+=rect(0,H-bh,W,bh,b.ink)+text(pad,H-bh*.44,Math.min(86,bh*.44),b.name,b.paper)+text(W-pad,H-bh*.44,Math.min(24,bh*.18),"BIRTHLAB STUDIO / CONCEPT",b.paper,400,'text-anchor="end"');}
 }
 else if(H>W*1.7){
   art+=browserWindow(90,100,1420,Math.min(1200,H*.35),false);
   const y1=Math.min(1420,H*.42);art+=text(100,y1,100,b.name)+text(100,y1+75,30,"A CONNECTED VISUAL SYSTEM",b.ink,400);
   let yy=y1+160;for(let k=0;yy<H-200;k++,yy+=900){art+=rect(100,yy,1400,790,k%2?b.ink:b.accent,24)+motif(180,yy+80,610,k%2?b.paper:b.ink,k)+text(860,yy+210,60,["Clear thinking.","A distinct voice.","Made to connect."][k%3],k%2?b.paper:b.ink)+text(860,yy+280,26,b.sector,k%2?b.paper:b.ink,400);for(let j=0;j<3;j++)art+=rect(860+j*160,yy+390,130,210,[b.paper,b.secondary,b.accent][j],12);}
 }
 else {
   const mode=seed%8,roomH=H-2*pad,headlineY=Math.min(H*.31,260);
   if(mode===0||H<600){art+=text(pad,pad+24,27,"BIRTHLAB STUDIO / "+b.sector,b.ink,400)+text(pad,headlineY+90,Math.min(nameSize,H*.24,730/(b.name.length*.55)),b.name)+text(pad,headlineY+165,Math.min(36,H*.065),b.tag,b.ink,400)+motif(W*.57,Math.max(40,H*.22),Math.min(680,H*.66),b.accent,seed);}
   else if(mode===1){art=defs+rect(0,0,W,H,b.secondary)+browserWindow(110,Math.max(85,H*.1),1380,H-Math.max(85,H*.1)*2,seed%3===0);}
   else if(mode===2){
     art=defs+rect(0,0,W,H,b.accent);const ph=Math.min(H*.78,1000),pw=ph*.72,cy=H/2;
     for(let j=0;j<3;j++){const xx=175+j*420,yy=cy-ph/2;art+=`<g transform="rotate(${[-7,2,8][j]} ${xx+pw/2} ${cy})">`+rect(xx,yy,pw,ph,[b.paper,b.ink,b.secondary][j],2,`filter="url(#shadow)"`)+text(xx+30,yy+70,Math.min(55,pw*.13),b.name,j===1?b.paper:b.ink)+motif(xx+pw*.12,yy+ph*.29,pw*.78,j===1?b.accent:b.ink,j)+text(xx+30,yy+ph-45,18,"STUDIO CONCEPT / "+String(seed+1).padStart(2,"0"),j===1?b.paper:b.ink,400)+"</g>";}
   } else if(mode===3){
     art+=rect(80,80,1440,Math.max(100,H-160),b.ink,24)+text(130,170,45,b.name,b.paper);
     const cellH=Math.max(130,(H-360)/2);art+=text(130,260,22,"IDENTITY NOTES / COLOUR / TYPE / FORM",b.paper,400);
     art+=text(140,Math.min(H*.57,510),Math.min(210,H*.25),"Aa Bb Cc",b.paper)+motif(960,225,Math.min(390,cellH*1.8),b.accent,seed);
     for(let j=0;j<4;j++)art+=rect(130+j*335,H-220,300,105,[b.paper,b.accent,b.secondary,b.ink][j],10,`stroke="${b.paper}" stroke-opacity=".3"`)+text(145+j*335,H-80,18,["PAPER","ACCENT","SECONDARY","INK"][j],b.paper,400);
   } else if(mode===4){
     art=defs+rect(0,0,W,H,b.ink);for(let j=0;j<2;j++){const xx=345+j*480,ph=Math.min(H*.84,1030),yy=(H-ph)/2,pw=ph*.49;art+=`<g transform="rotate(${j?7:-7} ${xx+pw/2} ${H/2})">`+rect(xx,yy,pw,ph,"#141817",42,`filter="url(#shadow)"`)+rect(xx+12,yy+12,pw-24,ph-24,j?b.accent:b.paper,32)+rect(xx+pw*.34,yy+19,pw*.32,20,"#141817",10)+text(xx+pw*.09,yy+ph*.14,pw*.095,b.name,b.ink)+motif(xx+pw*.12,yy+ph*.23,pw*.76,b.ink,seed)+text(xx+pw*.09,yy+ph*.76,pw*.065,"Explore the idea",b.ink);for(let k=0;k<2;k++)art+=rect(xx+pw*.09,yy+ph*(.80+k*.065),pw*.82,ph*.045,j?b.paper:b.secondary,ph*.022);art+="</g>";}
   } else if(mode===5){art=defs+rect(0,0,W,H,b.accent)+motif(740,Math.max(10,H*.05),Math.min(H*.91,880),b.ink,seed)+text(90,H*.36,110,b.name)+text(95,H*.49,34,b.tag,b.ink,400)+text(95,H*.72,24,"IDENTITY / EXPERIMENT / DIGITAL",b.ink,400);}
   else if(mode===6){art+=rect(95,90,1410,H-180,b.ink,24);for(let j=0;j<3;j++){const xx=155+j*465,hh=Math.min(H*.61,650),yy=Math.max(170,H*.2);art+=rect(xx,yy,410,hh,[b.paper,b.accent,b.secondary][j],18)+motif(xx+35,yy+35,340,b.ink,j)+text(xx+30,yy+hh-55,33,["Think clearly.","Find a voice.","Make it matter."][j],b.ink);}art+=text(150,Math.min(H-100,150),35,b.name,b.paper);}
   else {art=defs+rect(0,0,W,H,b.ink)+rect(0,0,W,H,"url(#grid)")+text(95,Math.min(220,H*.22),nameSize,b.name,b.paper)+motif(500,H*.28,Math.min(820,H*.7),b.accent,seed)+text(95,H*.87,36,b.tag,b.paper,400);}
   if(mode!==0&&mode!==1&&mode!==3&&mode!==4&&mode!==6&&H>650)art+=text(80,H-38,19,"BIRTHLAB STUDIO / "+b.sector,b.ink,400)+text(W-80,H-38,19,"STUDIO CONCEPT",b.ink,400,'text-anchor="end"');
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${W} ${H}">${art}</svg>`;
};
