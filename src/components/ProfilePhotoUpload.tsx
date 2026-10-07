// VIRAAS Connect onboarding profile-photo picker: native file input (gallery/file picker on
// mobile, normal file picker on desktop), immediate local preview, Change/Remove actions.
// The selected file is handed to the parent, which uploads it through the authenticated
// server endpoint during submit. No manual URL input exists.
import { useRef, useState, type ChangeEvent } from 'react';
import { PROFILE_PHOTO_ACCEPT, PROFILE_PHOTO_MAX_BYTES, isAllowedProfilePhotoType } from '../lib/profilePhoto';

interface ProfilePhotoUploadProps {
  preview: string;
  disabled?: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

export function ProfilePhotoUpload({ preview, disabled, onSelect, onRemove }: ProfilePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const openPicker = () => inputRef.current?.click();
  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow picking the same file again after Remove
    if (!file) return;
    if (!isAllowedProfilePhotoType(file.type)) {
      setError('Profile photo must be a JPEG, PNG or WebP image.');
      return;
    }
    if (file.size > PROFILE_PHOTO_MAX_BYTES) {
      setError('Profile photo must be at most 5 MB.');
      return;
    }
    setError('');
    onSelect(file);
  };
  return (
    <div className="vc-photo">
      <span className="vc-photo-label">Profile photo (optional)</span>
      {preview ? (
        <div className="vc-photo-preview">
          <img src={preview} alt="Profile photo preview" />
        </div>
      ) : null}
      <div className="vc-btnrow vc-photo-actions">
        <button type="button" className="btn sm" disabled={disabled} onClick={openPicker}>
          {preview ? 'Change Photo' : 'Upload Photo'}
        </button>
        {preview ? (
          <button type="button" className="btn btn-ghost sm" disabled={disabled} onClick={() => { setError(''); onRemove(); }}>
            Remove Photo
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={PROFILE_PHOTO_ACCEPT}
        onChange={onFile}
        disabled={disabled}
        className="vc-photo-input"
        aria-hidden="true"
        tabIndex={-1}
      />
      <small className="muted">JPEG, PNG or WebP — up to 5 MB. Shown on your Connect profile and discovery cards.</small>
      {error && <p className="vc-err" role="alert">{error}</p>}
    </div>
  );
}
