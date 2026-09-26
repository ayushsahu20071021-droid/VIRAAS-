import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { byId, PRODUCTS, type Product } from '../lib/data';
import { womenLookById, womenOccasionLabel, type WomenLook } from '../lib/womenCatalog';
import womenPreviews from '../data/women-previews.client.json';
import { ImageFrame, ShopButton, ShareRow, ProductCard } from '../components/ui';
import { useSaved } from '../lib/saved';

type Step = 'pick' | 'age' | 'under18' | 'upload' | 'preview' | 'generating' | 'result' | 'error';
interface TryOnResponse { ok: boolean; mode: 'demo' | 'live'; resultImage?: string; message?: string }

const AGE_KEY = 'viraas:age-confirmed';
const previewStatus = womenPreviews as Record<string, { live: boolean; src: string } | undefined>;

// A Try-On subject is either a shoppable product or a QA-approved (live) Women look.
type Subject =
  | { kind: 'product'; id: string; title: string; category: string; colour: string; imageUrl: string; detailPath: string; product: Product }
  | { kind: 'women'; id: string; title: string; category: string; colour: string; imageUrl: string; detailPath: string; look: WomenLook };

function resolveSubject(productId: string | null, womenLookId: string | null): Subject | undefined {
  if (productId) {
    const p = byId.get(productId);
    if (p) return { kind: 'product', id: p.id, title: p.title, category: p.category, colour: p.colour, imageUrl: p.imageUrl, detailPath: `/product/${p.id}`, product: p };
  }
  if (womenLookId) {
    const look = womenLookById.get(womenLookId);
    const st = previewStatus[womenLookId];
    // Only QA-approved, live Women looks can be tried on — never a pending/failed image.
    if (look && st?.live && st.src) {
      return { kind: 'women', id: look.id, title: `Look ${look.id.replace('women-look-', '')}`, category: look.garmentType ?? 'Women look', colour: look.colors.primary ?? '', imageUrl: st.src, detailPath: `/women-look/${look.id}`, look };
    }
  }
  return undefined;
}

export default function TryOn() {
  const [sp, setSp] = useSearchParams();
  const productId = sp.get('product');
  const womenLookId = sp.get('womenLook');
  const subject = resolveSubject(productId, womenLookId);
  const [step, setStep] = useState<Step>(subject ? 'age' : 'pick');
  const [photo, setPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<TryOnResponse | null>(null);
  const [mode, setMode] = useState<'demo' | 'live' | 'unknown'>('unknown');
  const fileRef = useRef<HTMLInputElement>(null);
  const { toggle, isSaved } = useSaved();

  useEffect(() => { fetch('/api/try-on/status').then((r) => r.json()).then((d) => setMode(d.mode)).catch(() => setMode('demo')); }, []);
  useEffect(() => {
    if (!subject) { setStep('pick'); return; }
    setStep(sessionStorage.getItem(AGE_KEY) === '1' ? 'upload' : 'age');
    setPhoto(null); setResult(null);
  }, [productId, womenLookId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFile = (f?: File) => {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { alert('Please upload a JPG, PNG or WebP photo.'); return; }
    if (f.size > 8 * 1024 * 1024) { alert('Please upload a photo under 8 MB.'); return; }
    const r = new FileReader(); r.onload = () => { setPhoto(String(r.result)); setStep('preview'); }; r.readAsDataURL(f);
  };

  const generate = async () => {
    if (!subject || !photo) return;
    setStep('generating');
    try {
      const body = subject.kind === 'product'
        ? { productId: subject.id, photo, ageConfirmed: true }
        : { womenLookId: subject.id, photo, ageConfirmed: true };
      const res = await fetch('/api/try-on', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = (await res.json()) as TryOnResponse;
      if (!res.ok || !data.ok) throw new Error(data.message || 'Try-on failed');
      setResult(data); setStep('result');
    } catch (e) { setResult({ ok: false, mode: 'demo', message: String((e as Error).message) }); setStep('error'); }
  };

  const eligible = PRODUCTS.filter((p) => p.tryOnEnabled).sort((a, b) => Number(!!b.imageUrl) - Number(!!a.imageUrl) || b.coupleIds.length - a.coupleIds.length).slice(0, 12);

  return (
    <div className="page tryon">
      <div className="page-head">
        <div className="kicker">AI Try-On</div>
        <h1>See it on you</h1>
        {mode === 'demo' && <div className="demo-banner" role="note"><strong>DEMO MODE</strong>: no AI model is connected. The result shows your uploaded photo next to the selected look for layout preview only. Your photo is not stored.</div>}
      </div>

      {step === 'pick' && (<>
        <p>Try-On starts from an outfit. Pick a look to begin — or open any live look from the <Link to="/women">Women edit</Link> and tap “Try On”.</p>
        <div className="grid4">{eligible.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </>)}

      {subject && step !== 'pick' && (
        <div className="tryon-grid">
          <div className="tryon-product">
            <ImageFrame src={subject.imageUrl} alt={subject.title} label={subject.category} detail={subject.colour} />
            <div className="small strong">{subject.title}</div>
            {subject.kind === 'women' && <div className="muted small">{womenOccasionLabel(subject.look.occasion)} · {subject.look.referenceId}</div>}
            <button className="btn btn-ghost sm" onClick={() => setSp({})}>Change outfit</button>
          </div>
          <div className="tryon-panel">
            {step === 'age' && (
              <div className="gate">
                <h2>Are you 18 or older?</h2>
                <p>Uploading a personal photo for AI Try-On is only available to users aged 18+. If you're 16–17, you can still browse, save, share and shop.</p>
                <div className="row">
                  <button className="btn btn-dark" onClick={() => { sessionStorage.setItem(AGE_KEY, '1'); setStep('upload'); }}>I'm 18 or older</button>
                  <button className="btn btn-ghost" onClick={() => setStep('under18')}>I'm under 18</button>
                </div>
                <p className="muted small">See <Link to="/ai-try-on-privacy">AI Try-On Privacy</Link>.</p>
              </div>
            )}
            {step === 'under18' && (
              <div className="gate">
                <h2>Photo try-on is 18+ only</h2>
                <p>You can still explore this look, share it with friends{subject.kind === 'product' ? ', or shop it directly' : ''}.</p>
                <div className="row">
                  {subject.kind === 'product'
                    ? <><button className="btn btn-ghost" onClick={() => toggle('product', subject.id, subject.imageUrl)}>{isSaved('product', subject.id) ? 'Saved ✓' : 'Save look'}</button><ShopButton p={subject.product} /></>
                    : <Link className="btn btn-ghost" to={subject.detailPath}>View look details</Link>}
                </div>
                <ShareRow path={subject.detailPath} />
              </div>
            )}
            {step === 'upload' && (
              <div className="gate">
                <h2>Upload a photo</h2>
                <p>Use a clear, front-facing, full-length photo with good light. JPG, PNG or WebP, under 8 MB.</p>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onFile(e.target.files?.[0])} hidden />
                <button className="btn btn-dark" onClick={() => fileRef.current?.click()}>Choose photo</button>
              </div>
            )}
            {step === 'preview' && photo && (
              <div className="gate">
                <h2>Preview</h2>
                <img src={photo} alt="Your uploaded photo" className="user-photo" />
                <div className="row"><button className="btn btn-accent" onClick={generate}>Generate</button><button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>Change photo</button></div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onFile(e.target.files?.[0])} hidden />
              </div>
            )}
            {step === 'generating' && <div className="gate"><h2>Generating…</h2><div className="spinner" aria-label="Working" /><p className="muted small">This may take a moment.</p></div>}
            {step === 'result' && result && photo && (
              <div className="gate">
                <h2>Result {result.mode === 'demo' && <span className="demo-tag">DEMO</span>}</h2>
                {result.mode === 'demo' ? (
                  <div className="demo-compare">
                    <figure><img src={photo} alt="Your photo" /><figcaption>Your photo</figcaption></figure>
                    <figure><ImageFrame src={subject.imageUrl} alt={subject.title} label={subject.category} /><figcaption>The outfit</figcaption></figure>
                    <p className="muted small">{result.message}</p>
                  </div>
                ) : <img src={result.resultImage} alt="Try-on result" className="user-photo" />}
                <div className="row">
                  {subject.kind === 'product'
                    ? <button className="btn btn-ghost" onClick={() => toggle('product', subject.id, subject.imageUrl)}>{isSaved('product', subject.id) ? 'Saved ✓' : 'Save'}</button>
                    : <Link className="btn btn-ghost" to={subject.detailPath}>View look</Link>}
                  <button className="btn btn-ghost" onClick={() => { setPhoto(null); setResult(null); setSp({}); }}>Try another</button>
                  {subject.kind === 'product' && <ShopButton p={subject.product} />}
                </div>
                <ShareRow path={subject.detailPath} />
              </div>
            )}
            {step === 'error' && <div className="gate"><h2>Something went wrong</h2><p>{result?.message}</p><button className="btn btn-dark" onClick={() => setStep('preview')}>Try again</button></div>}
          </div>
        </div>
      )}
    </div>
  );
}
