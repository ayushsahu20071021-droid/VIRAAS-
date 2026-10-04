import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { byId, coupleById, coupleImageSrc, type Product } from '../lib/data';
import { womenLookById, womenOccasionLabel, type WomenLook } from '../lib/womenCatalog';
import { menLookById, menOccasionLabel, type MenLook } from '../lib/menCatalog';
import womenPreviews from '../data/women-previews.client.json';
import menFinalImages from '../data/men-final-images.json';
import { ImageFrame, ProductActionButton, ShareRow } from '../components/ui';
import { tryOnHrefForProduct } from '../lib/productActions';
import { useSaved } from '../lib/saved';
import { SHARE_TEXT } from '../lib/saved';
import { DEFAULT_EDIT, isEdited, processPhoto, downloadDataUrl, shareImage, type PhotoEdit } from '../lib/photo';
import { useTryOnStatus, useTryOnAvailable } from '../lib/tryOnStatus';

type Step = 'pick' | 'age' | 'under18' | 'privacy' | 'upload' | 'preview' | 'payment' | 'generating' | 'result' | 'error';
interface TryOnResponse { ok: boolean; mode: string; resultImage?: string; message?: string; code?: string }

const AGE_KEY = 'viraas:age-confirmed';
const previewStatus = womenPreviews as Record<string, { live: boolean; src: string } | undefined>;
const menImages = menFinalImages as Record<string, string>;

// Featured Try-On looks — a curated, diverse set of approved production looks (6 Men + 6 Women).
// These are NOT ranked by any behavioural data (no "popular"/"bestseller"/"trending" claims): they are
// hand-selected for category, occasion and visual diversity. Each opens the existing Try-On flow for that
// exact approved look via its ?menLook= / ?womenLook= reference. No Couple looks are featured here.
const FEATURED_MEN_IDS = ['men-look-001', 'men-look-045', 'men-look-131', 'men-look-025', 'men-look-152', 'men-look-108'];
const FEATURED_WOMEN_IDS = ['women-look-034', 'women-look-003', 'women-look-159', 'women-look-113', 'women-look-077', 'women-look-153'];

interface FeaturedLook {
  id: string; kind: 'men' | 'women'; title: string; garment: string; colour: string;
  occasionLabel: string; src: string; href: string; alt: string;
}

function buildFeatured(): { men: FeaturedLook[]; women: FeaturedLook[] } {
  const men = FEATURED_MEN_IDS.map((id): FeaturedLook | null => {
    const look = menLookById.get(id);
    const src = menImages[id];
    if (!look || !src) return null;
    return {
      id, kind: 'men' as const, title: `${look.colors.primary} ${look.garmentType}`,
      garment: look.garmentType, colour: look.colors.primary, occasionLabel: menOccasionLabel(look.occasion),
      src, href: `/try-on?menLook=${id}`, alt: `Men look ${look.referenceId} — ${look.garmentType}`,
    };
  }).filter((x): x is FeaturedLook => x !== null);
  const women = FEATURED_WOMEN_IDS.map((id): FeaturedLook | null => {
    const look = womenLookById.get(id);
    const st = previewStatus[id];
    if (!look || !st?.live || !st.src) return null;
    return {
      id, kind: 'women' as const, title: `${look.colors.primary} ${look.garmentType}`,
      garment: look.garmentType, colour: look.colors.primary, occasionLabel: womenOccasionLabel(look.occasion),
      src: st.src, href: `/try-on?womenLook=${id}`, alt: `Women look ${look.referenceId} — ${look.garmentType}`,
    };
  }).filter((x): x is FeaturedLook => x !== null);
  return { men, women };
}

const FEATURED = buildFeatured();

function FeaturedCard({ f }: { f: FeaturedLook }) {
  return (
    <article className="men-look-card" data-featured-look-id={f.id} data-tryon-kind={f.kind}>
      <Link to={f.href} className="men-look-image">
        <ImageFrame src={f.src} alt={f.alt} label={f.title} detail={f.occasionLabel} />
      </Link>
      <div className="men-look-body">
        <div className="kicker">{f.occasionLabel}</div>
        <Link to={f.href} className="men-look-title">{f.title}</Link>
        <div className="men-look-meta"><span>{f.garment}</span><span>{f.colour}</span></div>
        <div className="men-look-actions">
          <Link className="btn btn-accent sm" to={f.href}>Try On</Link>
          <Link to={f.href} className="link-arrow">Start try-on →</Link>
        </div>
      </div>
    </article>
  );
}

// A Try-On subject is a Men look, a QA-approved Women look, a Couple (her/him) outfit, or a shoppable product.
interface Subject {
  kind: 'product' | 'women' | 'men' | 'couple';
  id: string;              // unique id (used for Save)
  title: string;
  category: string;
  colour: string;
  imageUrl?: string;       // reference shown in the sidebar
  detailPath: string;
  outfitDesc?: string;
  meta?: string;           // small caption line
  apiBody: Record<string, unknown>; // the EXACT reference the server maps
  product?: Product;
}

const IDEMPOTENCY_HEADER = 'Idempotency-Key';
function newAttemptKey() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function resolveSubject(sp: URLSearchParams): Subject | undefined {
  const productId = sp.get('product');
  const womenLookId = sp.get('womenLook');
  const menLookId = sp.get('menLook');
  const coupleId = sp.get('couple');
  const side = sp.get('side');

  if (menLookId) {
    const look = menLookById.get(menLookId);
    const src = menImages[menLookId];
    if (look && src) {
      return {
        kind: 'men', id: menLookId, title: `Look ${menLookId.replace('men-look-', '')}`,
        category: look.garmentType ?? 'Men look', colour: look.colors.primary ?? '', imageUrl: src,
        detailPath: `/men-look/${menLookId}`, meta: `${menOccasionLabel(look.occasion)} · ${look.referenceId}`,
        apiBody: { menLookId }, outfitDesc: look.garmentType,
      };
    }
  }
  if (womenLookId) {
    const look = womenLookById.get(womenLookId);
    const st = previewStatus[womenLookId];
    if (look && st?.live && st.src) {
      return {
        kind: 'women', id: womenLookId, title: `Look ${womenLookId.replace('women-look-', '')}`,
        category: look.garmentType ?? 'Women look', colour: look.colors.primary ?? '', imageUrl: st.src,
        detailPath: `/women-look/${womenLookId}`, meta: `${womenOccasionLabel(look.occasion)} · ${look.referenceId}`,
        apiBody: { womenLookId }, outfitDesc: look.garmentType,
      };
    }
  }
  if (coupleId && (side === 'her' || side === 'him')) {
    const c = coupleById.get(coupleId);
    const ids = side === 'her' ? c?.herProductIds : c?.hisProductIds;
    const product = ids?.map((id) => byId.get(id)).find((p) => p && tryOnHrefForProduct(p));
    if (c && product) {
      const person = side === 'her' ? c.her : c.him;
      return {
        kind: 'product', id: product.id, title: product.title, category: product.category, colour: product.colour,
        imageUrl: product.imageUrl, detailPath: `/couple-edit/${coupleId}`, outfitDesc: person.desc,
        meta: `${side === 'her' ? 'Her' : 'His'} outfit — exact product image`,
        apiBody: { productId: product.id }, product,
      };
    }
  }
  if (productId) {
    const p = byId.get(productId);
    if (p && tryOnHrefForProduct(p)) {
      return {
        kind: 'product', id: p.id, title: p.title, category: p.category, colour: p.colour, imageUrl: p.imageUrl,
        detailPath: `/product/${p.id}`, apiBody: { productId: p.id }, outfitDesc: p.title, product: p,
      };
    }
  }
  return undefined;
}

export default function TryOn() {
  const [sp, setSp] = useSearchParams();
  const subject = resolveSubject(sp);
  const [step, setStep] = useState<Step>(subject ? 'age' : 'pick');
  const [photo, setPhoto] = useState<string | null>(null);          // original upload
  const [edit, setEdit] = useState<PhotoEdit>(DEFAULT_EDIT);
  const [processed, setProcessed] = useState<string | null>(null);   // edited version (what we send)
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState<TryOnResponse | null>(null);
  const status = useTryOnStatus();
  const tryOnAvailable = useTryOnAvailable();
  const [saved, setSavedFlag] = useState(false);
  const [payNote, setPayNote] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);
  const generateLock = useRef(false);
  const paymentLock = useRef(false);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { toggle, isSaved } = useSaved();

  // Clear payment polling when the component unmounts.
  useEffect(() => () => {
    if (pollTimer.current) clearInterval(pollTimer.current);
  }, []);

  const key = `${sp.get('product') || ''}|${sp.get('womenLook') || ''}|${sp.get('menLook') || ''}|${sp.get('couple') || ''}|${sp.get('side') || ''}`;
  useEffect(() => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    if (!subject) { setStep('pick'); return; }
    setStep(sessionStorage.getItem(AGE_KEY) === '1' ? 'privacy' : 'age');
    setPhoto(null); setProcessed(null); setEdit(DEFAULT_EDIT); setConsent(false); setResult(null); setSavedFlag(false); setPayNote('');
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  // Recompute the edited (sent) version whenever the photo or the privacy edit changes.
  useEffect(() => {
    let alive = true;
    if (!photo) { setProcessed(null); return; }
    processPhoto(photo, edit).then((p) => { if (alive) setProcessed(p); }).catch(() => { if (alive) setProcessed(photo); });
    return () => { alive = false; };
  }, [photo, edit]);

  const onFile = (f?: File) => {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { alert('Please upload a JPG, PNG or WebP photo.'); return; }
    if (f.size > 8 * 1024 * 1024) { alert('Please upload a photo under 8 MB.'); return; }
    const r = new FileReader();
    r.onload = () => { setPhoto(String(r.result)); setEdit(DEFAULT_EDIT); setConsent(false); setStep('preview'); };
    r.readAsDataURL(f);
  };

  // Kick off the paid flow (only when the server reports payment is required). This NEVER asserts
  // payment itself: it creates a payment, then waits for the SERVER to report an authorization that
  // only the gateway webhook can produce. A real gateway's checkout widget would open here using the
  // returned `checkout` descriptor.
  const paymentReady = Boolean(status.topUpAvailable && status.paymentConfigured && status.paymentProvider !== 'mock');

  const startPayment = async () => {
    if (!subject || !processed || !consent || paymentLock.current || !paymentReady) return;
    paymentLock.current = true;
    setPayNote(''); setStep('payment');
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subject.apiBody),
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.paymentId) throw new Error('We couldn’t start the payment. Please try again.');
      pollAuthorization(String(data.paymentId));
    } catch (e) {
      setResult({ ok: false, mode: status.mode, message: String((e as Error).message) }); setStep('error');
    } finally {
      paymentLock.current = false;
    }
  };

  // Poll the server for the one-time authorization. The token only appears once the gateway webhook
  // has been verified SERVER-SIDE — the browser cannot self-authorize.
  const pollAuthorization = (paymentId: string) => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    let tries = 0;
    pollTimer.current = setInterval(async () => {
      tries += 1;
      try {
        const r = await fetch(`/api/payment/status?paymentId=${encodeURIComponent(paymentId)}`);
        const s = await r.json();
        if (s?.authorized && s?.authToken) {
          if (pollTimer.current) clearInterval(pollTimer.current);
          generate(String(s.authToken));
        } else if (tries >= 60) {
          if (pollTimer.current) clearInterval(pollTimer.current);
          setPayNote('We’re still waiting for your payment to be confirmed. If you completed payment, please try again shortly.');
        }
      } catch { /* keep polling until the cap */ }
    }, 2000);
  };

  const generate = async (authToken?: string) => {
    if (!tryOnAvailable || !subject || !processed || !consent || generateLock.current) return;
    generateLock.current = true;
    if (pollTimer.current) clearInterval(pollTimer.current);
    setStep('generating');
    try {
      const res = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', [IDEMPOTENCY_HEADER]: newAttemptKey() },
        body: JSON.stringify({ ...subject.apiBody, photo: processed, ageConfirmed: true, ...(authToken ? { authToken } : {}) }),
      });
      const data = (await res.json()) as TryOnResponse;
      if (!res.ok || !data.ok || typeof data.resultImage !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(data.resultImage)) {
        throw new Error(data.message || 'The server did not return a generated image.');
      }
      setResult(data); setStep('result');
    } catch (e) {
      setResult({ ok: false, mode: status.mode, message: String((e as Error).message) }); setStep('error');
    } finally {
      generateLock.current = false;
    }
  };

  // Runware is only reached from this explicit click, and only when server readiness allows it.
  const onGenerateClick = () => {
    if (!tryOnAvailable) return;
    if (status.paymentRequired) startPayment(); else generate();
  };

  const tryAnother = () => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    setPhoto(null); setProcessed(null); setEdit(DEFAULT_EDIT); setConsent(false); setResult(null); setSavedFlag(false); setPayNote(''); setSp({});
  };
  const saveResult = (img?: string | null) => { toggle('tryon', subject!.id, img ?? subject!.imageUrl); setSavedFlag(true); };
  const doShareImage = async (img: string) => {
    const r = await shareImage(img, 'viraas-try-on.jpg', SHARE_TEXT);
    if (r === 'unsupported') { downloadDataUrl(img, 'viraas-try-on.jpg'); alert('Sharing isn’t supported here, so your result was downloaded instead.'); }
  };

  const generationBlocked = !tryOnAvailable;
  const readinessRequirements = status.requirements.length ? status.requirements : ['Try-On is not available yet.'];

  return (
    <div className="page tryon">
      <div className="page-head">
        <div className="kicker">AI Try-On</div>
        <h1>See it on you</h1>
        {generationBlocked && (
          <div className="demo-banner" role="status" data-tryon-readiness="unavailable">
            <strong>Try-On is unavailable. No image has been generated.</strong>
            <ul>{readinessRequirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul>
            <p className="muted small">No personal photo will be uploaded or sent to a provider until the required services and credit safeguards are ready. See{' '}
              <Link to="/ai-try-on-privacy">AI Try-On Privacy</Link>.
            </p>
          </div>
        )}
      </div>

      {step === 'pick' && (
        <>
          <p>{generationBlocked
            ? <>You can continue browsing the <Link to="/men">Men</Link>, <Link to="/women">Women</Link> and <Link to="/couple-edit">Couple</Link> edits. Try-On will appear here when the required services are ready.</>
            : <>Choose a featured look below, or open any look from the <Link to="/men">Men</Link>, <Link to="/women">Women</Link> or <Link to="/couple-edit">Couple</Link> edits.</>}
          </p>
          {tryOnAvailable && (
            <section className="tryon-featured">
              <div className="kicker">Featured Try-On looks · Men</div>
              <div className="men-look-grid">{FEATURED.men.map((f) => <FeaturedCard key={f.id} f={f} />)}</div>
              <div className="kicker tryon-featured-sub">Featured Try-On looks · Women</div>
              <div className="men-look-grid">{FEATURED.women.map((f) => <FeaturedCard key={f.id} f={f} />)}</div>
            </section>
          )}
        </>
      )}

      {subject && step !== 'pick' && (
        <div className="tryon-grid">
          <div className="tryon-product">
            <ImageFrame src={subject.imageUrl} alt={subject.title} label={subject.category} detail={subject.colour} fit="contain" />
            <div className="small strong">{subject.title}</div>
            {subject.meta && <div className="muted small">{subject.meta}</div>}
            {subject.outfitDesc && <div className="muted small">{subject.outfitDesc}</div>}
            <button className="btn btn-ghost sm" onClick={tryAnother}>Change outfit</button>
          </div>

          <div className="tryon-panel">
            {/* 1 — Age gate (18+) */}
            {step === 'age' && (
              <div className="gate">
                <h2>Are you 18 or older?</h2>
                <p>Uploading a personal photo for AI Try-On is only available to users aged 18+. If you’re 16–17, you can still browse, save, share and shop.</p>
                <div className="row">
                  <button className="btn btn-dark" onClick={() => { sessionStorage.setItem(AGE_KEY, '1'); setStep('privacy'); }}>I’m 18 or older</button>
                  <button className="btn btn-ghost" onClick={() => setStep('under18')}>I’m under 18</button>
                </div>
                <p className="muted small">See <Link to="/ai-try-on-privacy">AI Try-On Privacy</Link>.</p>
              </div>
            )}

            {step === 'under18' && (
              <div className="gate">
                <h2>Photo try-on is 18+ only</h2>
                <p>You can still browse, save, and share this look.</p>
                <div className="row">
                  {subject.kind === 'product' && subject.product
                    ? <><button className="btn btn-ghost" onClick={() => toggle('product', subject.id, subject.imageUrl)}>{isSaved('product', subject.id) ? 'Saved ✓' : 'Save look'}</button><Link className="btn btn-ghost" to={subject.detailPath}>View details</Link><ProductActionButton p={subject.product} /></>
                    : <Link className="btn btn-ghost" to={subject.detailPath}>View look details</Link>}
                </div>
                <ShareRow path={subject.detailPath} />
              </div>
            )}

            {/* 2 — Privacy tip modal */}
            {step === 'privacy' && (
              <div className="gate privacy-tip">
                <h2>🔒 A quick privacy tip</h2>
                <p>For your privacy, we recommend using a photo where <strong>your face is not clearly visible</strong> — a full-length or three-quarter body shot works best. You can also hide your face on the next screen before generating.</p>
                <ul className="tip-list">
                  <li>Full-length or 3/4 body photo</li>
                  <li>Good, even lighting</li>
                  <li>Plain background if possible</li>
                </ul>
                <div className="row"><button className="btn btn-dark" disabled={!tryOnAvailable} onClick={() => setStep('upload')}>{tryOnAvailable ? 'Got it' : 'Try-On unavailable'}</button></div>
                {generationBlocked && <p className="muted small">{readinessRequirements[0]}</p>}
                <p className="muted small">Read the <Link to="/ai-try-on-privacy">AI Try-On Privacy</Link> notice.</p>
              </div>
            )}

            {/* 3 — Upload */}
            {step === 'upload' && (
              <div className="gate">
                <h2>Upload your photo</h2>
                <p>Use a clear, front-facing, full-length photo with good light. JPG, PNG or WebP, under 8 MB.</p>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onFile(e.target.files?.[0])} hidden />
                <button className="btn btn-dark" onClick={() => fileRef.current?.click()}>Choose photo</button>
              </div>
            )}

            {/* 4 — Edit (crop / hide face) + consent + generate */}
            {step === 'preview' && photo && (
              <div className="gate">
                <h2>Adjust &amp; confirm</h2>
                <div className="photo-edit">
                  <img src={processed ?? photo} alt="Your photo (edited version that will be used)" className="user-photo" />
                  <div className="edit-controls">
                    <label className="edit-row">
                      <input type="checkbox" checked={edit.hideFace} onChange={(e) => setEdit({ ...edit, hideFace: e.target.checked })} />
                      <span>Hide my face</span>
                    </label>
                    <label className="edit-row">
                      <span>Crop off the top {edit.cropTopPct > 0 ? `(${edit.cropTopPct}%)` : ''}</span>
                      <input type="range" min={0} max={45} step={5} value={edit.cropTopPct} onChange={(e) => setEdit({ ...edit, cropTopPct: Number(e.target.value) })} />
                    </label>
                    {isEdited(edit) && <p className="muted small">The edited version above is what gets sent — not your original.</p>}
                    <button className="btn btn-ghost sm" onClick={() => fileRef.current?.click()}>Change photo</button>
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onFile(e.target.files?.[0])} hidden />
                  </div>
                </div>
                <label className="consent">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>I’m 18+ and I understand my photo is sent to the VIRAAS server to generate my try-on for this look. It isn’t added to the catalog or made public. See the <Link to="/ai-try-on-privacy">AI Try-On Privacy</Link> notice.</span>
                </label>
                <div className="row">
                  <button className="btn btn-accent" disabled={!consent || !processed || generationBlocked || (status.paymentRequired && !paymentReady)} onClick={onGenerateClick}>
                    {generationBlocked ? 'Try-On unavailable' : status.paymentRequired ? (paymentReady ? `Pay ₹${status.priceInr ?? 20} & generate` : 'Try-On checkout unavailable') : 'Generate my try-on'}
                  </button>
                </div>
                {status.paymentRequired && paymentReady && <p className="muted small">One AI Try-On for this look. Your photo is sent to VIRAAS only, not the payment provider.</p>}
                {status.paymentRequired && !paymentReady && <p className="muted small">₹{status.priceInr ?? 20} checkout is not connected. No payment has been taken.</p>}
              </div>
            )}

            {/* 4b — Payment (only shown when the server requires payment) */}
            {step === 'payment' && (
              <div className="gate">
                <h2>Complete your payment</h2>
                <p>An AI Try-On for this look is ₹{status.priceInr ?? ''}. Once your payment is confirmed, your try-on is generated automatically.</p>
                <div className="spinner" aria-label="Waiting for payment confirmation" />
                <p className="muted small">Waiting for secure confirmation… Your payment is verified on the VIRAAS server before any generation starts.</p>
                {payNote && <p className="muted small">{payNote}</p>}
                <div className="row">
                  <button className="btn btn-ghost" onClick={() => { if (pollTimer.current) clearInterval(pollTimer.current); setStep('preview'); }}>Cancel</button>
                </div>
              </div>
            )}

            {/* 5 — Loading */}
            {step === 'generating' && (
              <div className="gate">
                <h2>Processing your try-on…</h2>
                <div className="spinner" aria-label="Working" />
                <p className="muted small">This can take a moment. Please keep this tab open.</p>
              </div>
            )}

            {/* 6 — Result. A result screen is reachable only when the server returned a real image. */}
            {step === 'result' && result?.resultImage && (
              <div className="gate">
                <h2>Your try-on</h2>
                <img src={result.resultImage} alt="Your AI try-on result" className="user-photo" />
                <p className="muted small">Private to you. This image isn’t added to the catalog or shared anywhere unless you choose to.</p>
                <div className="row">
                  <button className="btn btn-ghost" onClick={() => saveResult(result.resultImage)}>{saved ? 'Saved ✓' : 'Save'}</button>
                  <button className="btn btn-ghost" onClick={() => downloadDataUrl(result.resultImage!, 'viraas-try-on.jpg')}>Download</button>
                  <button className="btn btn-ghost" onClick={() => doShareImage(result.resultImage!)}>Share</button>
                  <button className="btn btn-dark" onClick={tryAnother}>Try another</button>
                </div>
              </div>
            )}

            {/* 7 — Error */}
            {step === 'error' && (
              <div className="gate">
                <h2>We couldn’t finish your try-on</h2>
                <p>{result?.message || 'Something went wrong.'}</p>
                <div className="row">
                  <button className="btn btn-dark" onClick={() => setStep('preview')}>Try again</button>
                  <button className="btn btn-ghost" onClick={tryAnother}>Change outfit</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
