import React, { useEffect, useState } from 'react';

const languages = [
  ['en','English'],['hi','हिन्दी'],['bn','বাংলা'],['te','తెలుగు'],['ta','தமிழ்'],['mr','मराठी']
];
const labels = {
  en:{welcome:'A safer way to understand your rights and speak up.',intro:'Ask questions, learn work rules, or save a concern. You decide what happens to your information.',ask:'Ask Mitra',report:'Report an incident',rights:'Know your rights',feedback:'Anonymous feedback',help:'How to use the app'},
  hi:{welcome:'अपने अधिकार समझने और अपनी बात कहने का आसान तरीका।',intro:'सवाल पूछें, काम के नियम समझें या अपनी परेशानी सुरक्षित रखें। जानकारी साझा करने का फैसला आपका है।',ask:'मित्र से पूछें',report:'घटना की रिपोर्ट करें',rights:'अपने अधिकार जानें',feedback:'गुमनाम सुझाव दें',help:'ऐप कैसे इस्तेमाल करें'},
  bn:{welcome:'আপনার অধিকার জানুন এবং নিরাপদে কথা বলুন।',intro:'প্রশ্ন করুন, কাজের নিয়ম জানুন বা সমস্যা লিখে রাখুন। তথ্য কীভাবে ভাগ হবে তা আপনিই ঠিক করবেন।',ask:'মিত্রকে জিজ্ঞাসা করুন',report:'ঘটনা জানান',rights:'নিজের অধিকার জানুন',feedback:'নাম ছাড়া মতামত দিন',help:'অ্যাপ ব্যবহার'},
  te:{welcome:'మీ హక్కులను తెలుసుకుని సురక్షితంగా మాట్లాడండి.',intro:'ప్రశ్న అడగండి, పని నియమాలు తెలుసుకోండి లేదా సమస్యను నమోదు చేయండి. సమాచారాన్ని ఎలా పంచుకోవాలో మీరే నిర్ణయిస్తారు.',ask:'మిత్రను అడగండి',report:'సంఘటనను నివేదించండి',rights:'మీ హక్కులు తెలుసుకోండి',feedback:'అజ్ఞాత అభిప్రాయం',help:'యాప్ ఎలా వాడాలి'},
  ta:{welcome:'உங்கள் உரிமைகளை அறிந்து பாதுகாப்பாகப் பேசுங்கள்.',intro:'கேள்வி கேளுங்கள், வேலை விதிகளை அறியுங்கள் அல்லது பிரச்சினையைப் பதிவு செய்யுங்கள். தகவலை எப்படிப் பகிர்வது என்பதை நீங்களே முடிவு செய்யலாம்.',ask:'மித்ராவிடம் கேளுங்கள்',report:'சம்பவத்தைப் புகாரளி',rights:'உங்கள் உரிமைகளை அறிக',feedback:'பெயரில்லா கருத்து',help:'செயலியைப் பயன்படுத்துவது'},
  mr:{welcome:'तुमचे हक्क समजून घ्या आणि सुरक्षितपणे बोला.',intro:'प्रश्न विचारा, कामाचे नियम जाणून घ्या किंवा समस्या नोंदवा. माहिती कशी शेअर करायची हे तुम्ही ठरवता.',ask:'मित्राला विचारा',report:'घटनेची नोंद करा',rights:'तुमचे हक्क जाणून घ्या',feedback:'निनावी अभिप्राय',help:'अ‍ॅप कसे वापरावे'}
};
const topics = [
  ['🦺','Safety rules','Use the safety equipment provided for your task. Do not operate a machine if its guard is missing or it seems unsafe. Report hazards to a supervisor or trusted safety contact.'],
  ['💰','Wages & overtime','Keep wage slips and note the days and hours you work. Check pay, overtime and deductions. Ask for an explanation if an amount is unclear.'],
  ['🌿','Leave & benefits','Ask for the workplace leave policy in a language you understand. Keep a record of leave requests and replies. Rules can vary by job and applicable law.'],
  ['🧡','Harassment & dignity','Everyone deserves to work without threats, bullying or unwanted behaviour. You can record what happened and seek help from a trusted person or organisation.'],
  ['📣','How to report a problem','You can keep a private record, share an anonymous signal, or make a named complaint. Read who will see the information before choosing.']
];
const initialReport = () => ({step:1,category:'Safety / Accident',description:'',date:new Date().toISOString().slice(0,10),place:'Shop floor',factoryCode:'',trust:'private',contactName:'',contactPhone:''});

export default function App(){
  const [language,setLanguage] = useState(localStorage.getItem('mv-language') || 'en');
  const [page,setPage] = useState('home');
  const [report,setReport] = useState(initialReport);
  const [chat,setChat] = useState([{role:'bot',text:'Namaste! 🙏 I am Mitra. How can I help you today?'}]);
  const [question,setQuestion] = useState('');
  const [feedback,setFeedback] = useState({category:'Safety',description:'',factoryCode:''});
  const [notice,setNotice] = useState('');
  const [busy,setBusy] = useState(false);
  const t = labels[language] || labels.en;

  useEffect(()=>{localStorage.setItem('mv-language',language)},[language]);
  const navigate = p => {setNotice('');setPage(p);window.scrollTo(0,0)};
  const speak = text => {
    if(!('speechSynthesis' in window)){setNotice('Audio playback is not supported in this browser.');return;}
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = ({en:'en-IN',hi:'hi-IN',bn:'bn-IN',te:'te-IN',ta:'ta-IN',mr:'mr-IN'})[language] || 'en-IN';
    speechSynthesis.speak(utterance);
  };
  const voiceInput = (setter) => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!Recognition){setNotice('Voice input is not supported in this browser. Try Chrome on Android or type instead.');return;}
    const recognition = new Recognition();
    recognition.lang = ({en:'en-IN',hi:'hi-IN',bn:'bn-IN',te:'te-IN',ta:'ta-IN',mr:'mr-IN'})[language] || 'en-IN';
    recognition.onresult = e => setter(e.results[0][0].transcript);
    recognition.onerror = () => setNotice('Could not capture speech. Please try again or type.');
    recognition.start();
  };
  const sendChat = async (text=question) => {
    const message=text.trim(); if(!message)return;
    setChat(old=>[...old,{role:'user',text:message}]);setQuestion('');setBusy(true);
    try{
      const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({language,message})});
      const data=await r.json(); if(!r.ok)throw new Error(data.error||'Chat request failed');
      setChat(old=>[...old,{role:'bot',text:data.answer}]);
    }catch(e){setChat(old=>[...old,{role:'bot',text:`Sorry, I could not reach the service. ${e.message}`}]);}
    finally{setBusy(false);}
  };
  const saveReport = async () => {
    if(report.trust==='private'){
      const all=JSON.parse(localStorage.getItem('mv-private')||'[]');
      all.push({...report,savedAt:new Date().toISOString()});localStorage.setItem('mv-private',JSON.stringify(all));
      setNotice('Private log saved only in this browser on this device.');navigate('saved');return;
    }
    setBusy(true);
    try{
      const payload={category:report.category,description:report.description,date:report.date,place:report.place,factoryCode:report.factoryCode,trustLevel:report.trust};
      if(report.trust==='formal'){payload.contactName=report.contactName;payload.contactPhone=report.contactPhone;}
      const r=await fetch('/api/incidents',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data=await r.json();if(!r.ok)throw new Error(data.error||'Could not save');
      setNotice(data.message);setReport(initialReport());navigate('home');
    }catch(e){setNotice(e.message);}
    finally{setBusy(false);}
  };
  const submitFeedback = async () => {
    if(!feedback.description.trim()){setNotice('Please add your feedback.');return;}
    setBusy(true);
    try{
      const r=await fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(feedback)});
      const data=await r.json();if(!r.ok)throw new Error(data.error||'Could not save feedback');
      setFeedback({category:'Safety',description:'',factoryCode:''});setNotice(data.message);navigate('home');
    }catch(e){setNotice(e.message);}
    finally{setBusy(false);}
  };
  const startReport=()=>{setReport(initialReport());navigate('report');};
  const updateReport=(key,value)=>setReport(old=>({...old,[key]:value}));
  const reportNext=()=>{
    if(report.step===1&&!report.description.trim()){setNotice('Please add a short description.');return;}
    if(report.step===3&&!document.getElementById('agree')?.checked){setNotice('Please confirm that you understand this choice.');return;}
    setNotice('');updateReport('step',Math.min(4,report.step+1));
  };
  const nav=[['home','⌂','Home'],['chat','💬',t.ask],['report','📝',t.report],['info','📘',t.rights],['feedback','🤝',t.feedback],['help','🎧',t.help],['saved','🔒','My private logs']];
  const emergency=()=>navigate('emergency');

  return <div className="app">
    <header className="top">
      <div className="brand"><div className="logo">મ</div><div>MitraVoice<small>Worker Companion</small></div></div>
      <div className="topright">
        <select aria-label="Choose language" value={language} onChange={e=>setLanguage(e.target.value)}>{languages.map(([v,n])=><option key={v} value={v}>{n}</option>)}</select>
        <button className="emergency" onClick={emergency}>⚠ Emergency</button>
      </div>
    </header>
    <div className="layout">
      <aside className="sidebar"><small>MAIN MENU</small>{nav.map(([id,icon,label])=><button key={id} className={`nav ${page===id?'active':''}`} onClick={()=>navigate(id)}>{icon} &nbsp; {label}</button>)}</aside>
      <main className="panel">
        {notice && <div className="notice" role="status">{notice}<button className="dismiss" onClick={()=>setNotice('')}>×</button></div>}
        {page==='home' && <><section className="hero"><div><div className="eyebrow">Welcome to MitraVoice</div><h1>{t.welcome}</h1><p>{t.intro}</p><button className="btn" onClick={()=>navigate('chat')}>Get started →</button></div><div className="heroicon">🫶</div></section>
          <div className="cards">
            <Tile icon="💬" title={t.ask} desc="Speak or type a question in your language" onClick={()=>navigate('chat')}/>
            <Tile icon="📝" title={t.report} desc="Choose what happens to your report" onClick={startReport}/>
            <Tile icon="📘" title={t.rights} desc="Simple information with audio" onClick={()=>navigate('info')}/>
            <Tile icon="🤝" title={t.feedback} desc="Share a concern without your name" onClick={()=>navigate('feedback')}/>
            <Tile icon="🎧" title={t.help} desc="Listen to short app guides" onClick={()=>navigate('help')}/>
            <Tile icon="🔒" title="My private logs" desc="View reports saved on this device" onClick={()=>navigate('saved')}/>
          </div><div className="notice">🔐 <b>You are in control.</b> A private log, anonymous signal and formal complaint are different. Read who can see each option before choosing.</div>
        </>}
        {page==='chat' && <><div className="eyebrow">Multilingual assistant</div><h1>{t.ask}</h1><p>You can speak or type. Ask about wages, overtime, safety or leave.</p><div className="chatbox">{chat.map((m,i)=><div key={i} className={`bubble ${m.role}`}>{m.text}{m.role==='bot'&&<button className="audio" onClick={()=>speak(m.text)}>🔊 Play audio</button>}</div>)}</div><div className="chatcontrols"><input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()} placeholder="Type your question…"/><button className="btn" disabled={busy} onClick={()=>sendChat()}>Send</button><button className="btn secondary" onClick={()=>voiceInput(setQuestion)}>🎙</button></div><div className="quick"><button onClick={()=>sendChat('What should I do if a machine is unsafe?')}>Unsafe machine</button><button onClick={()=>sendChat('How can I check my wage slip?')}>Wage slip</button></div><div className="notice">Sample rule-based answers only. This assistant is not a lawyer and cannot provide legal advice.</div></>}
        {page==='report' && <><div className="eyebrow">Incident reporting · Trust ladder</div><h1>Report an incident</h1><div className="progresslabel">STEP {report.step} OF 4</div><div className="progress"><span style={{width:`${report.step*25}%`}}/></div>
          {report.step===1 && <><h2>What happened?</h2><p>Choose the closest topic and describe the issue.</p><div className="pills">{['Harassment','Safety / Accident','Wages / Overtime','Other'].map(x=><button key={x} className={report.category===x?'selected':''} onClick={()=>updateReport('category',x)}>{x}</button>)}</div><Field label="Description"><textarea value={report.description} onChange={e=>updateReport('description',e.target.value)} placeholder="Tell us what happened. Avoid names if not needed."/></Field><button className="btn secondary" onClick={()=>voiceInput(v=>updateReport('description',report.description+' '+v))}>🎙 Speak description</button></>}
          {report.step===2 && <><h2>When and where?</h2><Field label="Date"><input type="date" value={report.date} onChange={e=>updateReport('date',e.target.value)}/></Field><Field label="Place"><select value={report.place} onChange={e=>updateReport('place',e.target.value)}>{['Shop floor','Dormitory','Canteen','Washroom','Outside factory','Other'].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Factory code (optional)"><input value={report.factoryCode} onChange={e=>updateReport('factoryCode',e.target.value)} placeholder="Optional workplace code"/></Field></>}
          {report.step===3 && <><h2>Choose your trust level</h2><p>You decide who can see your report.</p><div className="trustgrid">
            <Trust active={report.trust==='private'} icon="🔒" title="1. Private log" desc="Saved only in this browser on this device." onClick={()=>updateReport('trust','private')}/>
            <Trust active={report.trust==='anonymous'} icon="🕊️" title="2. Anonymous signal" desc="Category and details go to the demo database without name/contact fields." onClick={()=>updateReport('trust','anonymous')}/>
            <Trust active={report.trust==='formal'} icon="📨" title="3. Formal complaint" desc="Optional name/contact are stored with the report. Not sent to an NGO." onClick={()=>updateReport('trust','formal')}/>
          </div><div className="notice"><b>Who sees this?</b><br/>{report.trust==='private'?'Only someone with access to this browser/device.':report.trust==='anonymous'?'The MitraVoice database stores the category and description without contact fields. No NGO is connected.':'The MitraVoice database stores the report and any contact fields you provide. No NGO or employer is notified.'}<br/><br/><b>What is shared?</b><br/>{report.trust==='private'?'Nothing is sent to the server.':report.trust==='anonymous'?'Category, description, date, place and optional factory code. Do not write identifying details in the description.':'Incident details and any optional name/phone you provide.'}</div>
          {report.trust==='formal' && <><Field label="Name (optional)"><input value={report.contactName} onChange={e=>updateReport('contactName',e.target.value)}/></Field><Field label="Phone (optional)"><input value={report.contactPhone} onChange={e=>updateReport('contactPhone',e.target.value)}/></Field></>}
          <label className="check"><input id="agree" type="checkbox"/> I understand who may see this information and want to continue.</label></>}
          {report.step===4 && <><h2>Review your choice</h2><div className="notice"><b>Category:</b> {report.category}<br/><b>Date:</b> {report.date}<br/><b>Place:</b> {report.place}<br/><b>Trust level:</b> {report.trust}</div><p>{report.trust==='private'?'This record stays in this browser.':report.trust==='anonymous'?'This record will be sent to the configured demo database without contact fields.':'This record and optional contact details will be sent to the demo database only. It will not be sent to an NGO.'}</p><b>Description</b><p>{report.description}</p><button className="btn outline" onClick={()=>updateReport('step',1)}>Edit details</button></>}
          <div className="row between formnav">{report.step>1&&report.step<4&&<button className="btn outline" onClick={()=>updateReport('step',report.step-1)}>← Back</button>}<span/>{report.step<4?<button className="btn" onClick={reportNext}>Continue →</button>:<button className="btn" disabled={busy} onClick={saveReport}>{busy?'Saving…':'Save / finish'}</button>}</div>
        </>}
        {page==='info' && <><div className="eyebrow">Simple information hub</div><h1>{t.rights}</h1><p>Choose a topic. Read the short guide or listen to it.</p>{topics.map(([icon,title,desc])=><article className="topic" key={title}><div className="row between"><h3>{icon} {title}</h3><button className="btn secondary" onClick={()=>speak(desc)}>🔊 Play audio</button></div><p>{desc}</p><button className="textbtn" onClick={()=>{setQuestion(`Tell me more about ${title.toLowerCase()}`);navigate('chat')}}>Ask a question →</button></article>)}<div className="notice">General simplified information only. It is not legal advice.</div></>}
        {page==='feedback' && <><div className="eyebrow">Your voice matters</div><h1>{t.feedback}</h1><p>This form does not ask for your name or phone number. Please do not include identifying details in the message.</p><Field label="Category"><select value={feedback.category} onChange={e=>setFeedback({...feedback,category:e.target.value})}>{['Safety','Harassment','Wages','Facilities','Other'].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Feedback"><textarea value={feedback.description} onChange={e=>setFeedback({...feedback,description:e.target.value})} placeholder="What would you like us to know?"/></Field><Field label="Factory code (optional)"><input value={feedback.factoryCode} onChange={e=>setFeedback({...feedback,factoryCode:e.target.value})}/></Field><div className="row"><button className="btn secondary" onClick={()=>voiceInput(v=>setFeedback(old=>({...old,description:old.description+' '+v})))}>🎙 Speak feedback</button><button className="btn" disabled={busy} onClick={submitFeedback}>{busy?'Submitting…':'Submit anonymously'}</button></div><div className="notice">The backend does not request a name or phone. A message can still identify you if you include personal details in its text.</div></>}
        {page==='help' && <><div className="eyebrow">Audio guides</div><h1>{t.help}</h1><p>Listen in your selected language using your browser's speech service.</p>{[['How to use MitraVoice','Learn to ask questions, explore topics and use the main menu.'],['Your rights and speaking up','An introduction to keeping records and finding trusted support.'],['Understanding the trust ladder','Learn the difference between a private log, anonymous signal and formal complaint.']].map(([title,desc])=><article className="guide" key={title}><div><h3>{title}</h3><p>{desc}</p></div><button className="btn secondary" onClick={()=>speak(`${title}. ${desc}`)}>▶ Play</button></article>)}</>}
        {page==='saved' && <><div className="eyebrow">Stored on this device</div><h1>My private logs</h1><p>Private logs stay in this browser's local storage and are not synced.</p>{(JSON.parse(localStorage.getItem('mv-private')||'[]')).length===0?<p>No private logs saved yet.</p>:(JSON.parse(localStorage.getItem('mv-private')||'[]')).map((x,i)=><article className="topic" key={i}><b>{x.category}</b> · {x.date}<p>{x.description}</p><small>{x.place}</small></article>)}<div className="notice warning">Do not use this demo to store sensitive information on a shared phone. Local browser storage is not a secure vault.</div></>}
        {page==='emergency' && <Emergency speak={speak} navigate={navigate} setNotice={setNotice}/>}
      </main>
    </div>
    <button className="emergency-fab" onClick={emergency}>⚠ Emergency</button>
    <footer>MitraVoice prototype · Your choices matter · Do not use for real confidential complaints yet.</footer>
  </div>;
}

function Tile({icon,title,desc,onClick}){return <button className="tile" onClick={onClick}><span className="tileicon">{icon}</span><b>{title}</b><small>{desc}</small></button>}
function Field({label,children}){return <div className="field"><label>{label}</label>{children}</div>}
function Trust({active,icon,title,desc,onClick}){return <button className={`trust ${active?'chosen':''}`} onClick={onClick}><span>{icon}</span><b>{title}</b><small>{desc}</small></button>}
function Emergency({navigate,setNotice}){
 const [recording,setRecording]=useState(false),[recorder,setRecorder]=useState(null),[chunks,setChunks]=useState([]);
 const start=async()=>{
  try{
   if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw new Error('Audio recording is not supported in this browser.');
   const stream=await navigator.mediaDevices.getUserMedia({audio:true});const mr=new MediaRecorder(stream);const parts=[];
   mr.ondataavailable=e=>parts.push(e.data);
   mr.onstop=()=>{const blob=new Blob(parts,{type:'audio/webm'});const reader=new FileReader();reader.onload=()=>{try{const arr=JSON.parse(localStorage.getItem('mv-emergency')||'[]');arr.push({audio:reader.result,savedAt:new Date().toISOString()});localStorage.setItem('mv-emergency',JSON.stringify(arr));setNotice('Emergency voice draft saved in this browser only. It was not sent.');}catch{setNotice('Could not save recording. The browser storage may be full.');}};reader.readAsDataURL(blob);stream.getTracks().forEach(t=>t.stop());setRecording(false);};
   mr.start();setRecorder(mr);setRecording(true);
  }catch(e){setNotice(e.message+' You can type a report instead.');}
 };
 return <><div className="eyebrow red">Quick access</div><h1>Emergency help</h1><p>If you are in immediate danger, move to a safer place if possible and contact local emergency services or someone you trust.</p><div className="cards"><Tile icon="🎙" title="Quick record incident" desc="Record a voice note and save it as a private draft on this device." onClick={recording?()=>recorder?.stop():start}/><Tile icon="📞" title="Call emergency services" desc="Call India's emergency number 112." onClick={()=>{if(confirm('Call 112 now?'))window.location.href='tel:112'}}/></div>{recording&&<div className="notice warning"><b>● Recording…</b><p>Describe what is happening. Stop when ready.</p><button className="btn danger" onClick={()=>recorder?.stop()}>Stop and save draft</button></div>}<div className="notice">Recording is optional and is not automatically shared. This demo has no NGO helpline configured.</div><button className="btn outline" onClick={()=>navigate('home')}>Exit / Hide</button></>;
}
