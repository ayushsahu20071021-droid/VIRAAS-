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
import { resolveCoupleSide } from '../../shared/coupleTryOn.mjs';

type Step = 'pick' | 'unavailable' | 'age' | 'under18' | 'privacy' | 'upload' | 'preview' | 'payment' | 'generating' | 'result' | 'error';
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

interface SubjectResolution { subject?: Subject; error?: string; unavailableKind?: 'look' | 'product' | 'couple' }

function resolveSubject(sp: URLSearchParams): SubjectResolution {
  const productId = sp.get('product');
  const womenLookId = sp.get('womenLook');
  const menLookId = sp.get('menLook');
  const coupleId = sp.get('couple');
  const side = sp.get('side');

  if (menLookId) {
    const look = menLookById.get(menLookId);
    const src = menImages[menLookId];
    if (!look || !src) return { error: 'This exact Men look reference is not available for Try-On.', unavailableKind: 'look' };
    return { subject: {
      kind: 'men', id: menLookId, title: `Look ${menLookId.replace('men-look-', '')}`,
      category: look.garmentType ?? 'Men look', colour: look.colors.primary ?? '', imageUrl: src,
      detailPath: `/men-look/${menLookId}`, meta: `${menOccasionLabel(look.occasion)} · ${look.referenceId}`,
      apiBody: { menLookId }, outfitDesc: look.garmentType,
    } };
  }
  if (womenLookId) {
    const look = womenLookById.get(womenLookId);
    const st = previewStatus[womenLookId];
    if (!look || !st?.live || !st.src) return { error: 'This exact Women look reference is not available for Try-On.', unavailableKind: 'look' };
    return { subject: {
      kind: 'women', id: womenLookId, title: `Look ${womenLookId.replace('women-look-', '')}`,
      category: look.garmentType ?? 'Women look', colour: look.colors.primary ?? '', imageUrl: st.src,
      detailPath: `/women-look/${womenLookId}`, meta: `${womenOccasionLabel(look.occasion)} · ${look.referenceId}`,
      apiBody: { womenLookId }, outfitDesc: look.garmentType,
    } };
  }
  if (coupleId) {
    const couple = coupleById.get(coupleId);
    if (!couple) return { error: 'Unknown Couple look.', unavailableKind: 'couple' };
    const resolved = resolveCoupleSide(couple, side, byId);
    if (!resolved.ok) return { error: resolved.message, unavailableKind: 'couple' };
    const isHer = resolved.side === 'her';
    const person = isHer ? couple.her : couple.him;
    return { subject: {
      kind: 'couple', id: `${couple.id}-${resolved.side}`, title: `${couple.title} · ${isHer ? 'Her' : 'Him'}`,
      category: `${isHer ? 'Her' : 'Him'} outfit`, colour: person.colour || '', imageUrl: resolved.garmentImageUrl,
      detailPath: `/couple-edit/${couple.id}`, outfitDesc: resolved.garmentDescription,
      meta: `${isHer ? 'Her' : 'Him'} · exact VIRAAS garment reference`,
      apiBody: { coupleId: couple.id, side: resolved.side },
    } };
  }
  if (productId) {
    const p = byId.get(productId);
    if (!p || !tryOnHrefForProduct(p)) return { error: 'This product does not have its own live Try-On image yet.', unavailableKind: 'product' };
    return { subject: {
      kind: 'product', id: p.id, title: p.title, category: p.category, colour: p.colour, imageUrl: p.imageUrl,
      detailPath: `/product/${p.id}`, apiBody: { productId: p.id }, outfitDesc: p.title, product: p,
    } };
  }
  return {};
}

export default function TryOn() {
  const [sp, setSp] = useSearchParams();
  const resolution = resolveSubject(sp);
  const subject = resolution.subject;
  const subjectError = resolution.error;
  const unavailableKind = resolution.unavailableKind;
  const [step, setStep] = useState<Step>(subject ? 'age' : subjectError ? 'unavailable' : 'pick');
  const [photo, setPhoto] = useState<string | null>(null);          // original upload
  const [edit, setEdit] = useState<PhotoEdit>(DEFAULT_EDIT);
  const [processed, setProcessed] = useState<string | null>(null);   // processed JPEG sent only after consent
  const [photoProcessingError, setPhotoProcessingError] = useState('');
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState<TryOnResponse | null>(null);
  const status = useTryOnStatus();
  const tryOnAvailable = useTryOnAvailable();
  const [saved, setSavedFlag] = useState(false);
  const [payNote, setPayNote] = useState<string>('');
  const [creditBalance, setCreditBalance] = useState<number | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);
  const [creditsError, setCreditsError] = useState('');
  const [payuPhone, setPayuPhone] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const generateLock = useRef(false);
  const paymentLock = useRef(false);
  const { toggle, isSaved } = useSaved();

  const key = `${sp.get('product') || ''}|${sp.get('womenLook') || ''}|${sp.get('menLook') || ''}|${sp.get('couple') || ''}|${sp.get('side') || ''}`;
  const returnedPayment = sp.get('payment');
  const returnedTxnId = sp.get('txnid');

  const refreshCredits = async () => {
    setCreditsLoading(true);
    try {
      const response = await fetch('/api/try-on/credits', { credentials: 'include', cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data?.ok !== true || !Number.isInteger(data.balance)) {
        setCreditBalance(null);
        setCreditsError(String(data?.message || 'Sign in and complete an adult VIRAAS profile to use Try-On credits.'));
        return null;
      }
      setCreditBalance(data.balance);
      setCreditsError('');
      return data.balance as number;
    } catch {
      setCreditBalance(null);
      setCreditsError('Persistent Try-On credits are unavailable right now.');
      return null;
    } finally { setCreditsLoading(false); }
  };

  useEffect(() => {
    if (!subject) { setStep(subjectError ? 'unavailable' : 'pick'); setCreditBalance(null); return; }
    setStep(sessionStorage.getItem(AGE_KEY) === '1' ? 'privacy' : 'age');
    setPhoto(null); setProcessed(null); setEdit(DEFAULT_EDIT); setConsent(false); setResult(null); setSavedFlag(false); setPayNote('');
    setCreditBalance(null);
    void refreshCredits();
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  // After a PayU POST callback, read the authenticated order status from PostgreSQL. A return query
  // string alone never changes the balance; only a server-verified payment status can do that.
  useEffect(() => {
    if (!subject || !returnedPayment || !returnedTxnId) return;
    let active = true;
    const checkPayment = async () => {
      setStep('payment');
      let resolved = false;
      for (let attempt = 0; attempt < 8 && active; attempt++) {
        if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 1800));
        try {
          if (attempt > 0) {
            await fetch('/api/payment/verify', {
              method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ txnid: returnedTxnId }),
            });
          }
          const response = await fetch(`/api/payment/status?txnid=${encodeURIComponent(returnedTxnId)}`, { credentials: 'include', cache: 'no-store' });
          const data = await response.json().catch(() => ({}));
          if (!response.ok || data?.ok !== true) break;
          if (data.status === 'succeeded' && Number.isInteger(data.balance)) {
            if (!active) return;
            setCreditBalance(data.balance);
            setCreditsError('');
            setPayNote('PayU confirmed your ₹20 payment. One Try-On credit has been added to your account.');
            setStep('privacy');
            resolved = true;
            break;
          }
          if (data.status === 'failed') {
            if (!active) return;
            setCreditBalance(0);
            setPayNote('PayU did not complete this payment. No credit was added. You may try checkout again.');
            setStep('privacy');
            resolved = true;
            break;
          }
        } catch { /* continue with a bounded server-side verification retry */ }
      }
      if (active) {
        setSp((current) => { const next = new URLSearchParams(current); next.delete('payment'); next.delete('txnid'); return next; }, { replace: true });
        if (!resolved) {
          setPayNote('Payment is still awaiting PayU verification. No credit is available until VIRAAS confirms it.');
          setStep('privacy');
          void refreshCredits();
        }
      }
    };
    void checkPayment();
    return () => { active = false; };
  }, [returnedPayment, returnedTxnId, key]); // eslint-disable-line react-hooks/exhaustive-deps

  // Recompute the edited (sent) version whenever the photo or the privacy edit changes.
  useEffect(() => {
    let alive = true;
    if (!photo) { setProcessed(null); setPhotoProcessingError(''); return; }
    setProcessed(null);
    setPhotoProcessingError('');
    processPhoto(photo, edit)
      .then((processedPhoto) => { if (alive) setProcessed(processedPhoto); })
      .catch(() => {
        if (!alive) return;
        setProcessed(null);
        setPhotoProcessingError('This photo could not be safely processed. Choose another image before continuing.');
      });
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

  const paymentReady = Boolean(tryOnAvailable && status.topUpAvailable && status.paymentConfigured && status.paymentProvider === 'payu');

  // PayU receives only fixed order data and a billing phone number—never a user's photo.
  const startPayment = async () => {
    if (!subject || paymentLock.current || !paymentReady) return;
    paymentLock.current = true;
    setPayNote('');
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json', [IDEMPOTENCY_HEADER]: newAttemptKey() },
        body: JSON.stringify({ ...subject.apiBody, phone: payuPhone }),
      });
      const data = await res.json().catch(() => ({}));
      const endpoint = String(data?.checkout?.endpoint || '');
      if (!res.ok || !data.ok || !data.checkout?.fields || !['https://secure.payu.in/_payment', 'https://test.payu.in/_payment'].includes(endpoint)) {
        throw new Error(data?.message || 'PayU checkout could not be started. No payment was taken.');
      }
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = endpoint;
      form.acceptCharset = 'UTF-8';
      form.style.display = 'none';
      for (const [name, value] of Object.entries(data.checkout.fields as Record<string, unknown>)) {
        if (typeof value !== 'string' || !/^[a-zA-Z0-9_]+$/.test(name)) continue;
        const input = document.createElement('input');
        input.type = 'hidden'; input.name = name; input.value = value; form.appendChild(input);
      }
      document.body.appendChild(form);
      setStep('payment');
      form.submit();
    } catch (error) {
      setPayNote(String((error as Error).message || 'PayU checkout could not be started.'));
    } finally {
      paymentLock.current = false;
    }
  };

  const generate = async () => {
    if (!tryOnAvailable || !subject || !processed || !consent || creditBalance === null || creditBalance < 1 || generateLock.current) return;
    generateLock.current = true;
    setStep('generating');
    try {
      const res = await fetch('/api/try-on', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json', [IDEMPOTENCY_HEADER]: newAttemptKey() },
        body: JSON.stringify({ ...subject.apiBody, photo: processed, ageConfirmed: true, consent: true }),
      });
      const data = (await res.json()) as TryOnResponse & { creditsRemaining?: number; balance?: number };
      if (!res.ok || !data.ok || typeof data.resultImage !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(data.resultImage)) {
        if (data.code === 'NO_TRYON_CREDITS') { setCreditBalance(0); setPayNote('No Try-On credits remaining.'); }
        throw new Error(data.message || 'The server did not return a generated image.');
      }
      if (Number.isInteger(data.creditsRemaining)) setCreditBalance(data.creditsRemaining!);
      else setCreditBalance((current) => current === null ? null : Math.max(0, current - 1));
      setPhoto(null); setProcessed(null); setEdit(DEFAULT_EDIT); setConsent(false);
      setResult(data); setStep('result');
    } catch (error) {
      setResult({ ok: false, mode: status.mode, message: String((error as Error).message) }); setStep('error');
    } finally {
      generateLock.current = false;
    }
  };

  const onGenerateClick = () => {
    if (!tryOnAvailable || creditBalance === null) return;
    if (creditBalance < 1) setStep('payment'); else void generate();
  };

  const tryAnother = () => {
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

      {step === 'unavailable' && (
        <div className="demo-banner" role="status" data-tryon-reference="unavailable">
          <strong>{unavailableKind === 'couple' ? 'This exact Couple-side Try-On reference is unavailable.' : 'This exact Try-On reference is unavailable.'}</strong>
          <p>{subjectError || 'No valid VIRAAS garment image is linked to this selection.'}</p>
          <p className="muted small">No photo will be requested and no combined Couple image, other look, or guessed mapping will be used.</p>
          <div className="row">
            {sp.get('couple') && <Link className="btn btn-dark" to={`/couple-edit/${sp.get('couple')}`}>Back to Couple look</Link>}
            <Link className="btn btn-ghost" to={unavailableKind === 'couple' ? '/couple-edit' : '/women'}>Browse looks</Link>
          </div>
        </div>
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
                {creditsLoading && <p className="muted small" role="status">Checking your secure Try-On credit balance…</p>}
                {creditBalance !== null && <p className="credit-balance" aria-live="polite">{creditBalance} Try-On credit{creditBalance === 1 ? '' : 's'} available</p>}
                {creditBalance === 0 && <p className="muted"><strong>No Try-On credits remaining.</strong></p>}
                {creditsError && <p className="vc-err" role="alert">{creditsError} <Link to="/connect">Sign in or complete your adult VIRAAS profile</Link>.</p>}
                {payNote && <p className="muted small" role="status">{payNote}</p>}
                {creditBalance === 0 && <div className="row"><button className="btn btn-accent" disabled={!paymentReady} onClick={() => setStep('payment')}>{paymentReady ? `Buy 1 Try-On credit · ₹${status.priceInr ?? 20}` : 'Secure top-up unavailable'}</button></div>}
                <div className="row"><button className="btn btn-dark" disabled={!tryOnAvailable || creditsLoading || creditBalance === null || creditBalance < 1} onClick={() => setStep('upload')}>{!tryOnAvailable ? 'Try-On unavailable' : creditBalance === null ? 'Sign in required' : creditBalance < 1 ? 'Add a credit to continue' : 'Got it'}</button></div>
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
                  <img src={processed ?? photo} alt="Your photo; only the safely processed preview can be uploaded" className="user-photo" />
                  {!processed && !photoProcessingError && <p className="muted small" role="status">Preparing your private photo in this browser…</p>}
                  <div className="edit-controls">
                    <label className="edit-row">
                      <input type="checkbox" checked={edit.hideFace} onChange={(e) => setEdit({ ...edit, hideFace: e.target.checked })} />
                      <span>Hide my face</span>
                    </label>
                    <label className="edit-row">
                      <span>Crop off the top {edit.cropTopPct > 0 ? `(${edit.cropTopPct}%)` : ''}</span>
                      <input type="range" min={0} max={45} step={5} value={edit.cropTopPct} onChange={(e) => setEdit({ ...edit, cropTopPct: Number(e.target.value) })} />
                    </label>
                    {photoProcessingError && <p className="vc-err" role="alert">{photoProcessingError}</p>}
                    {isEdited(edit) && !photoProcessingError && <p className="muted small">The edited version above is what gets sent — not your original.</p>}
                    <button className="btn btn-ghost sm" onClick={() => fileRef.current?.click()}>Change photo</button>
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onFile(e.target.files?.[0])} hidden />
                  </div>
                </div>
                <label className="consent">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>I’m 18+ and I understand my photo is sent to the VIRAAS server to generate my try-on for this look. It isn’t added to the catalog or made public. See the <Link to="/ai-try-on-privacy">AI Try-On Privacy</Link> notice.</span>
                </label>
                <p className="credit-balance" aria-live="polite">{creditBalance === null ? (creditsLoading ? 'Checking credits…' : 'Sign in required') : creditBalance === 0 ? 'No Try-On credits remaining.' : `${creditBalance} Try-On credit${creditBalance === 1 ? '' : 's'} available`}</p>
                {creditsError && <p className="vc-err" role="alert">{creditsError} <Link to="/connect">Sign in or complete your adult VIRAAS profile</Link>.</p>}
                <div className="row">
                  <button className="btn btn-accent" disabled={!consent || !processed || generationBlocked || creditsLoading || creditBalance === null || (creditBalance === 0 && !paymentReady)} onClick={onGenerateClick}>
                    {generationBlocked ? 'Try-On unavailable' : creditBalance === 0 ? (paymentReady ? `Buy 1 credit · ₹${status.priceInr ?? 20}` : 'Try-On checkout unavailable') : creditBalance === null ? 'Sign in required' : 'Use 1 credit · Generate'}
                  </button>
                </div>
                {creditBalance === 0 && paymentReady && <p className="muted small">The ₹20 PayU purchase adds exactly 1 Try-On credit. The payment provider does not receive your photo.</p>}
                {creditBalance === 0 && !paymentReady && <p className="muted small">A secure PayU top-up is unavailable. No payment has been taken.</p>}
              </div>
            )}

            {/* PayU top-up: a verified ₹20 payment adds exactly one persistent credit. */}
            {step === 'payment' && (
              <div className="gate">
                <h2>Add 1 Try-On credit</h2>
                <p>Pay ₹{status.priceInr ?? 20} once through secure PayU checkout. A verified payment adds exactly one credit to your VIRAAS account; no photo is sent to PayU.</p>
                <label className="vc-label">Indian mobile number for PayU
                  <input type="tel" value={payuPhone} onChange={(event) => setPayuPhone(event.target.value)} placeholder="9876543210" autoComplete="tel" inputMode="tel" maxLength={16} />
                  <small className="muted">Used for checkout only. VIRAAS does not store this number.</small>
                </label>
                {!paymentReady && <p className="muted small">Secure PayU checkout is unavailable. No payment has been taken.</p>}
                {payNote && <p className="muted small" role="status">{payNote}</p>}
                <div className="row">
                  <button className="btn btn-accent" disabled={!paymentReady || !payuPhone.trim() || paymentLock.current} onClick={() => void startPayment()}>Continue to secure PayU checkout · ₹{status.priceInr ?? 20}</button>
                  <button className="btn btn-ghost" onClick={() => setStep(photo ? 'preview' : 'privacy')}>Back</button>
                </div>
                <p className="muted small">VIRAAS adds credits only after verifying PayU’s signed callback and server-side payment status.</p>
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
                {creditBalance === 0 && <p className="muted"><strong>No Try-On credits remaining.</strong></p>}
                <div className="row">
                  {creditBalance === 0 && paymentReady && <button className="btn btn-accent" onClick={() => setStep('payment')}>Buy 1 credit · ₹{status.priceInr ?? 20}</button>}
                  <button className="btn btn-dark" onClick={() => photo ? setStep('preview') : setStep('privacy')}>Try again</button>
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
