import { useEffect, useState } from 'react';
import { realtimeEnabled, supabase } from './lib/supabase.js';

const starter = [
  { id: 'starter-1', sender: 'her', body: 'Hey, I hope your day is going gently.', created_at: 'Today · 08:42' },
  { id: 'starter-2', sender: 'me', body: 'I am here. How are you feeling?', created_at: 'Today · 08:45' },
];

const labelTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function Chat() {
  const [messages, setMessages] = useState(() => { try { return JSON.parse(localStorage.getItem('lumen-chat-v1')) || starter; } catch { return starter; } });
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState(realtimeEnabled ? 'Realtime messages enabled' : 'Messages stay on this device');

  useEffect(() => {
    if (!realtimeEnabled) { localStorage.setItem('lumen-chat-v1', JSON.stringify(messages.slice(-100))); return undefined; }
    let active = true;
    supabase.from('messages').select('*').eq('room', 'mh-private').order('created_at', { ascending: true }).limit(100).then(({ data, error }) => { if (active && !error && data?.length) setMessages(data); });
    const channel = supabase.channel('mh-private-room').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'room=eq.mh-private' }, event => setMessages(value => value.some(item => item.id === event.new.id) ? value : [...value, event.new])).subscribe();
    return () => { active = false; supabase.removeChannel(channel); };
  }, []);

  const send = async event => { event.preventDefault(); const body = text.trim().slice(0, 500); if (!body) return; const message = { room: 'mh-private', sender: 'me', body }; setText(''); if (realtimeEnabled) { const { error } = await supabase.from('messages').insert(message); if (error) setStatus('Could not send. Check Supabase policies.'); } else setMessages(value => [...value, { ...message, id: crypto.randomUUID?.() || String(Date.now()), created_at: `Today · ${labelTime()}` }]); };
  const voice = async () => { if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setStatus('Voice recording needs a supported browser.'); return; } if (recording) return; try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); const recorder = new MediaRecorder(stream); const chunks = []; setRecording(true); setStatus('Recording a private voice note...'); recorder.addEventListener('dataavailable', event => event.data.size && chunks.push(event.data)); recorder.addEventListener('stop', async () => { stream.getTracks().forEach(track => track.stop()); setRecording(false); const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }); if (realtimeEnabled) { const path = `mh-private/${crypto.randomUUID?.() || Date.now()}.webm`; const upload = await supabase.storage.from('voice-notes').upload(path, blob, { contentType: blob.type }); if (!upload.error) await supabase.from('messages').insert({ room: 'mh-private', sender: 'me', voice_path: path }); else setStatus('Voice note upload failed.'); } else { setMessages(value => [...value, { id: String(Date.now()), sender: 'me', body: 'Voice note recorded locally.', created_at: `Today · ${labelTime()}` }]); } setStatus(realtimeEnabled ? 'Realtime messages enabled' : 'Messages stay on this device'); }); recorder.start(); window.setTimeout(() => recorder.state === 'recording' && recorder.stop(), 60000); } catch { setStatus('Microphone permission was not granted.'); setRecording(false); } };

  return <><header className="topline"><div><div className="date-label">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div><h1>Leave a little light on.</h1></div><div className="chat-presence"><span className="presence-dot" />{realtimeEnabled ? 'Realtime' : 'Private space'}</div></header><div className="view-tabs"><a href="/today">◷Today</a><a href="/week">▦Week</a><a href="/story">✦Story</a><a href="/our-day">♡Our day</a><a className="active" href="/chat">◌Chat</a></div><section className="chat-shell"><header className="chat-header"><div className="avatar">H</div><div><h2>Haleemah</h2><p>{status}</p></div><span className="secure-label">{realtimeEnabled ? 'SYNCED' : 'LOCAL'}</span></header><div className="message-list">{messages.map(message => <article className={`message ${message.sender === 'me' ? 'outgoing' : 'incoming'}`} key={message.id}><div className="message-bubble">{message.body || 'Voice note'}</div><time className="message-meta">{message.created_at || 'Just now'}</time></article>)}</div><form className="message-composer" onSubmit={send}><textarea value={text} onChange={event => setText(event.target.value)} maxLength="500" placeholder="Write something gentle..." aria-label="Write a message" /><div className="composer-actions"><button className={`voice-button ${recording ? 'recording' : ''}`} type="button" onClick={voice}>{recording ? '● Stop recording' : '● Voice note'}</button><button className="send-button">Send ↗</button></div></form></section><p className="chat-notice">{realtimeEnabled ? 'Connected to your private Supabase room.' : 'Local mode is active. Add Supabase environment variables to enable cross-device messages.'}</p></>;
}
