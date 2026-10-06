// Server-rendered unauthenticated Connect UI smoke test; no browser, network or account data is needed.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AuthPanel } from '../src/components/social.tsx';

const connectSource = await fs.readFile(new URL('../src/pages/Connect.tsx', import.meta.url), 'utf8');
assert.match(connectSource, /if \(!authenticated\) return[\s\S]*?<AuthPanel onSuccess=\{refresh\}/, 'the signed-out Connect branch renders the account actions when readiness is healthy');
const markup = renderToStaticMarkup(createElement(AuthPanel, { onSuccess: () => {} }));
assert.match(markup, />Sign Up<\/button>/, 'unauthenticated Connect presents an explicit Sign Up action');
assert.match(markup, />Log In<\/button>/, 'unauthenticated Connect presents an explicit Log In action');
assert.match(markup, /name="email"|type="email"/, 'Sign Up and Log In use the account email form');
assert.doesNotMatch(markup, /Requests received|My Chats|>Discover<|>Message<|@[a-z0-9.]+/i, 'signed-out UI does not expose private Connect content or profile data');
console.log('PASS Connect UI: unauthenticated users see Sign Up and Log In, with no private profile, request, connection or chat data.');
