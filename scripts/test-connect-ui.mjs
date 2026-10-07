// Server-rendered unauthenticated Connect UI smoke test; no browser, network or account data is needed.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AuthPanel } from '../src/components/social.tsx';
import { ProfilePhotoUpload } from '../src/components/ProfilePhotoUpload.tsx';

const connectSource = await fs.readFile(new URL('../src/pages/Connect.tsx', import.meta.url), 'utf8');
assert.match(connectSource, /if \(!authenticated\) return[\s\S]*?<AuthPanel onSuccess=\{refresh\}/, 'the signed-out Connect branch renders the account actions when readiness is healthy');
const markup = renderToStaticMarkup(createElement(AuthPanel, { onSuccess: () => {} }));
assert.match(markup, />Sign Up<\/button>/, 'unauthenticated Connect presents an explicit Sign Up action');
assert.match(markup, />Log In<\/button>/, 'unauthenticated Connect presents an explicit Log In action');
assert.match(markup, /name="email"|type="email"/, 'Sign Up and Log In use the account email form');
assert.doesNotMatch(markup, /Requests received|My Chats|>Discover<|>Message<|@[a-z0-9.]+/i, 'signed-out UI does not expose private Connect content or profile data');

// Profile-photo upload replaces the old manual URL input.
assert.doesNotMatch(connectSource, /Profile photo URL \(optional\)/, 'the manual profile-photo URL input is removed');
assert.doesNotMatch(connectSource, /type="url"/, 'no URL input remains in Connect onboarding');
assert.match(connectSource, /ProfilePhotoUpload/, 'onboarding uses the real photo upload component');
assert.match(connectSource, /uploadProfilePhoto/, 'onboarding uploads through the authenticated server endpoint');
const photoMarkup = renderToStaticMarkup(createElement(ProfilePhotoUpload, { preview: '', onSelect: () => {}, onRemove: () => {} }));
assert.match(photoMarkup, /Profile photo \(optional\)/, 'onboarding shows the optional profile-photo label');
assert.match(photoMarkup, />Upload Photo<\/button>/, 'onboarding shows an Upload Photo button');
assert.match(photoMarkup, /type="file"/, 'a native file input opens the gallery/file picker');
assert.match(photoMarkup, /accept="image\/jpeg,image\/png,image\/webp"/, 'the picker is limited to safe image formats');
assert.doesNotMatch(photoMarkup, /Remove Photo/, 'no Remove action before a photo is selected');
const photoPreviewMarkup = renderToStaticMarkup(createElement(ProfilePhotoUpload, { preview: 'blob:preview', onSelect: () => {}, onRemove: () => {} }));
assert.match(photoPreviewMarkup, /<img[^>]+src="blob:preview"/, 'an immediate image preview is shown after selection');
assert.match(photoPreviewMarkup, />Change Photo<\/button>/, 'Change Photo is shown after selection');
assert.match(photoPreviewMarkup, />Remove Photo<\/button>/, 'Remove Photo is shown after selection');
console.log('PASS Connect UI: unauthenticated users see Sign Up and Log In, with no private profile, request, connection or chat data; onboarding uses the profile-photo upload UI with preview/Change/Remove and no manual URL input.');
