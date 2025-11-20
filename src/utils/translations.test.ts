import { describe, it, expect } from 'vitest';
import { getTranslation, getTranslator } from './translations';

describe('translations utilities', () => {
  it('getTranslation returns english translation for en', () => {
    expect(getTranslation('welcome' as any, 'en' as any)).toBe('Welcome');
  });

  it('getTranslation returns fallback to key if missing', () => {
    // pass an unknown key at runtime
    expect(getTranslation('__unknown_key__' as any, 'en' as any)).toBe('__unknown_key__');
  });

  it('getTranslator returns a bound translator function', () => {
    const t = getTranslator('ml' as any);
    expect(typeof t).toBe('function');
    expect(t('welcome' as any)).toBe('സ്വാഗതം');
  });

  it('translator falls back to english when key missing in language', () => {
    const t = getTranslator('hi' as any);
    // use a key that exists in en
    expect(t('dashboard' as any)).toBe('डैशबोर्ड');
  });
});
