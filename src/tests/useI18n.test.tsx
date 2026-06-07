import { renderHook, act } from '@testing-library/react';
import { TenantProvider } from '@/app/providers/TenantProvider';
import { I18nProvider } from '@/app/providers/I18nProvider';
import { useI18n } from '@/hooks/useI18n';
import { describe, it, expect, vi } from 'vitest';

describe('useI18n Hook', () => {
  it('throws an error if consumed outside of an I18nProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useI18n())).toThrow(
      'useI18n must be used within an I18nProvider',
    );

    consoleSpy.mockRestore();
  });

  it('returns the default locale (en-US) from tenant config', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TenantProvider>
        <I18nProvider>{children}</I18nProvider>
      </TenantProvider>
    );

    const { result } = renderHook(() => useI18n(), { wrapper });

    expect(result.current.currentLocale).toBe('en-US');
    expect(result.current.supportedLocales).toEqual(['en-US', 'ja-JP', 'es-ES']);
  });

  it('translates known keys via t()', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TenantProvider>
        <I18nProvider>{children}</I18nProvider>
      </TenantProvider>
    );

    const { result } = renderHook(() => useI18n(), { wrapper });

    expect(result.current.t('nav.dashboard')).toBe('Dashboard');
    expect(result.current.t('nav.profile')).toBe('Profile');
    expect(result.current.t('page.notFound.title')).toBe('Page Not Found');
  });

  it('falls back to the key itself for unknown translations', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TenantProvider>
        <I18nProvider>{children}</I18nProvider>
      </TenantProvider>
    );

    const { result } = renderHook(() => useI18n(), { wrapper });

    expect(result.current.t('some.untranslated.key')).toBe('some.untranslated.key');
    expect(result.current.t('')).toBe('');
  });

  it('switches locale with setLocale and returns translated values', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TenantProvider>
        <I18nProvider>{children}</I18nProvider>
      </TenantProvider>
    );

    const { result } = renderHook(() => useI18n(), { wrapper });

    expect(result.current.currentLocale).toBe('en-US');

    act(() => {
      result.current.setLocale('ja-JP');
    });

    expect(result.current.currentLocale).toBe('ja-JP');
    expect(result.current.t('nav.dashboard')).toBe('ダッシュボード');
  });

  it('switches to Spanish (es-ES) and returns translated values', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TenantProvider>
        <I18nProvider>{children}</I18nProvider>
      </TenantProvider>
    );

    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLocale('es-ES');
    });

    expect(result.current.currentLocale).toBe('es-ES');
    expect(result.current.t('nav.dashboard')).toBe('Panel');
    expect(result.current.t('nav.profile')).toBe('Perfil');
    expect(result.current.t('page.notFound.title')).toBe('Página No Encontrada');
    expect(result.current.t('page.settings.applyOverrides')).toBe('Aplicar Anulaciones');
  });

  it('ignores setLocale calls for unsupported locales', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TenantProvider>
        <I18nProvider>{children}</I18nProvider>
      </TenantProvider>
    );

    const { result } = renderHook(() => useI18n(), { wrapper });

    act(() => {
      result.current.setLocale('fr-FR');
    });

    // Should remain at default
    expect(result.current.currentLocale).toBe('en-US');
  });

  it('formats currency using Intl.NumberFormat with tenant currency', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TenantProvider>
        <I18nProvider>{children}</I18nProvider>
      </TenantProvider>
    );

    const { result } = renderHook(() => useI18n(), { wrapper });

    const formatted = result.current.formatCurrency(128430);
    // en-US + USD should produce something like "$128,430.00"
    expect(formatted).toContain('128');
    expect(formatted).toContain(',');
  });

  it('formats numbers using Intl.NumberFormat', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TenantProvider>
        <I18nProvider>{children}</I18nProvider>
      </TenantProvider>
    );

    const { result } = renderHook(() => useI18n(), { wrapper });

    expect(result.current.formatNumber(8642)).toBe('8,642');
    expect(result.current.formatNumber(3.24)).toBe('3.24');
  });
});
