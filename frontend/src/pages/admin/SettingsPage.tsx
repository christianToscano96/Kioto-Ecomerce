import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SettingsCard } from '@/components/ui/SettingsCard';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { ApiKeyInput } from '@/components/ui/ApiKeyInput';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useSettingsStore } from '@/store/settings';
import { useAuthStore } from '@/store/auth';
import { profileApi } from '@/lib/api';
import { toast } from 'sonner';
import type { Settings } from '../../../../shared/src';

const SETTINGS_SECTIONS = [
  { id: 'profile', label: 'Perfil', icon: 'person' },
  { id: 'store', label: 'Tienda', icon: 'storefront' },
  { id: 'payments', label: 'Pagos', icon: 'credit_card' },
  { id: 'notifications', label: 'Notificaciones', icon: 'notifications' },
  { id: 'appearance', label: 'Apariencia', icon: 'palette' },
  { id: 'security', label: 'Seguridad', icon: 'security' },
  { id: 'social', label: 'Redes', icon: 'share' },
  { id: 'policies', label: 'Políticas', icon: 'description' },
];

// Default settings for non-user-specific sections
const DEFAULT_SETTINGS: Settings = {
  store: {
    name: 'KIOTO',
    logo: '',
    currency: 'USD',
    timezone: 'America/Argentina',
    taxEnabled: false,
    taxRate: 0,
    shipping: {
      flatRate: 500,
      freeShippingOver: 5000,
    },
  },
  payments: {
    stripe: {
      testMode: true,
      publishableKey: '',
      secretKey: '',
    },
  },
  notifications: {
    orderEmails: true,
    lowStockEmails: true,
    webhookUrl: '',
  },
  appearance: {
    primaryColor: '#1976d2',
    darkMode: false,
  },
  security: {
    twoFactor: false,
    apiKey: '',
  },
  social: {
    instagram: '',
    whatsapp: '',
    facebook: '',
  },
  policies: {
    terms: '',
    privacy: '',
  },
};

export function SettingsPage() {
  const { settings, fetchSettings, updateSettings } = useSettingsStore();
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState<Settings | null>(null);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  // Separate state for profile form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      // Settings from backend (no profile section)
      setLocalSettings({ ...DEFAULT_SETTINGS, ...settings });
    } else {
      // Fallback to defaults while loading
      setLocalSettings(DEFAULT_SETTINGS);
    }
  }, [settings]);

  // Sync profileData when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!localSettings) return;
    setSaving(true);
    await updateSettings(localSettings);
    setHasChanges(false);
    setSaving(false);
  };

  const handleProfileSave = async () => {
    if (!profileData.name || !profileData.email) return;
    setSaving(true);
    try {
      const response = await profileApi.update({
        name: profileData.name,
        email: profileData.email,
      });
      // Update user in auth store
      useAuthStore.setState({ user: response.data.user });
      toast.success('Perfil actualizado');
    } catch (error) {
      toast.error('Error al actualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path: string, value: unknown) => {
    setLocalSettings(prev => {
      if (!prev) return prev;
      const keys = path.split('.');
      const result = { ...prev };
      let current: any = result;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return result;
    });
    setHasChanges(true);
  };

  const handleChangePassword = async () => {
    if (!passwordData.new || passwordData.new !== passwordData.confirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    setSaving(true);
    try {
      await profileApi.changePassword({
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
      });
      toast.success('Contraseña actualizada');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast.error('Error al cambiar contraseña');
    } finally {
      setSaving(false);
    }
  };

  if (!localSettings) return <div className="p-8">Cargando...</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Configuración" description="Administra tu tienda" eyebrow="Panel de Administración" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <nav className="lg:col-span-1">
          <div className="bg-surface-container-low rounded-lg border border-outline-variant/30 p-2">
            {SETTINGS_SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'profile' && (
            <>
              <SettingsCard title="Información Personal" description="Datos de tu cuenta">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    value={profileData.name}
                    onChange={(e) => setProfileData(p => ({ ...p, name: e.target.value }))}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={handleProfileSave} 
                    disabled={saving || (profileData.name === user?.name && profileData.email === user?.email)}
                  >
                    {saving ? 'Guardando...' : 'Guardar Perfil'}
                  </Button>
                </div>
              </SettingsCard>

              <SettingsCard title="Cambiar Contraseña" description="Actualiza tu contraseña">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Contraseña Actual"
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData(p => ({ ...p, current: e.target.value }))}
                  />
                  <Input
                    label="Nueva Contraseña"
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData(p => ({ ...p, new: e.target.value }))}
                  />
                  <Input
                    label="Confirmar Contraseña"
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData(p => ({ ...p, confirm: e.target.value }))}
                  />
                </div>
                <div className="mt-4">
                  <Button onClick={handleChangePassword} disabled={saving}>
                    {saving ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </Button>
                </div>
              </SettingsCard>
            </>
          )}

          {activeSection === 'store' && (
            <>
              <SettingsCard title="Información de la Tienda" description="Configuración general">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre de la Tienda"
                    value={localSettings.store?.name || ''}
                    onChange={(e) => updateField('store.name', e.target.value)}
                  />
                  <div>
                    <label className="text-sm font-medium text-on-surface mb-2 block">Logo</label>
                    <ImageUpload
                      label="Logo"
                      currentImage={localSettings.store?.logo}
                      onUpload={(url) => updateField('store.logo', url)}
                      onRemove={() => updateField('store.logo', '')}
                    />
                  </div>
                  <Input
                    label="Moneda"
                    value={localSettings.store?.currency || 'USD'}
                    onChange={(e) => updateField('store.currency', e.target.value)}
                  />
                  <Input
                    label="Zona Horaria"
                    value={localSettings.store?.timezone || ''}
                    onChange={(e) => updateField('store.timezone', e.target.value)}
                  />
                </div>
              </SettingsCard>

              <SettingsCard title="Envíos" description="Configuración de envíos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Tarifa Plana"
                    type="number"
                    value={localSettings.store?.shipping?.flatRate || 0}
                    onChange={(e) => updateField('store.shipping.flatRate', parseFloat(e.target.value))}
                  />
                  <Input
                    label="Envío Gratis Desde"
                    type="number"
                    value={localSettings.store?.shipping?.freeShippingOver || 0}
                    onChange={(e) => updateField('store.shipping.freeShippingOver', parseFloat(e.target.value))}
                  />
                </div>
              </SettingsCard>

              <SettingsCard title="Impuestos" description="Configuración de impuestos">
                <div className="space-y-4">
                  <ToggleSwitch
                    label="Impuestos Habilitados"
                    checked={localSettings.store?.taxEnabled || false}
                    onChange={(checked) => updateField('store.taxEnabled', checked)}
                  />
                  <Input
                    label="Tasa de Impuesto (%)"
                    type="number"
                    value={localSettings.store?.taxRate || 0}
                    onChange={(e) => updateField('store.taxRate', parseFloat(e.target.value))}
                    disabled={!localSettings.store?.taxEnabled}
                  />
                </div>
              </SettingsCard>
            </>
          )}

          {activeSection === 'payments' && (
            <>
              <SettingsCard title="Stripe" description="Configuración de pagos con Stripe">
                <div className="space-y-4">
                  <ToggleSwitch
                    label="Modo Test"
                    checked={localSettings.payments?.stripe?.testMode || false}
                    onChange={(checked) => updateField('payments.stripe.testMode', checked)}
                  />
                  <ApiKeyInput
                    label="Publishable Key"
                    value={localSettings.payments?.stripe?.publishableKey || ''}
                    onChange={(value) => updateField('payments.stripe.publishableKey', value)}
                  />
                  <ApiKeyInput
                    label="Secret Key"
                    value={localSettings.payments?.stripe?.secretKey || ''}
                    onChange={(value) => updateField('payments.stripe.secretKey', value)}
                    secret
                  />
                </div>
              </SettingsCard>
            </>
          )}

          {activeSection === 'notifications' && (
            <>
              <SettingsCard title="Email" description="Configuración de notificaciones">
                <div className="space-y-4">
                  <ToggleSwitch
                    label="Notificaciones de Pedidos"
                    checked={localSettings.notifications?.orderEmails || false}
                    onChange={(checked) => updateField('notifications.orderEmails', checked)}
                  />
                  <ToggleSwitch
                    label="Notificaciones de Stock Bajo"
                    checked={localSettings.notifications?.lowStockEmails || false}
                    onChange={(checked) => updateField('notifications.lowStockEmails', checked)}
                  />
                  <Input
                    label="Webhook URL"
                    placeholder="https://..."
                    value={localSettings.notifications?.webhookUrl || ''}
                    onChange={(e) => updateField('notifications.webhookUrl', e.target.value)}
                  />
                </div>
              </SettingsCard>
            </>
          )}

          {activeSection === 'appearance' && (
            <>
              <SettingsCard title="Tema" description="Personaliza la apariencia">
                <div className="space-y-4">
                  <ColorPicker
                    label="Color Primario"
                    value={localSettings.appearance?.primaryColor || '#1976d2'}
                    onChange={(value) => updateField('appearance.primaryColor', value)}
                  />
                  <ToggleSwitch
                    label="Tema Oscuro"
                    checked={localSettings.appearance?.darkMode || false}
                    onChange={(checked) => updateField('appearance.darkMode', checked)}
                  />
                </div>
              </SettingsCard>
            </>
          )}

          {activeSection === 'security' && (
            <>
              <SettingsCard title="Autenticación" description="Seguridad de la cuenta">
                <div className="space-y-4">
                  <ToggleSwitch
                    label="Autenticación de Dos Factores (2FA)"
                    checked={localSettings.security?.twoFactor || false}
                    onChange={(checked) => updateField('security.twoFactor', checked)}
                  />
                  <div className="border border-outline-variant/30 rounded-lg p-4">
                    <p className="text-sm text-on-surface-variant mb-2">API Keys</p>
                    <ApiKeyInput
                      label="Clave API"
                      value={localSettings.security?.apiKey || ''}
                      onChange={(value) => updateField('security.apiKey', value)}
                    />
                  </div>
                </div>
              </SettingsCard>
            </>
          )}

          {activeSection === 'social' && (
            <>
              <SettingsCard title="Redes Sociales" description="Enlaces a tus redes">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Instagram"
                    placeholder="https://instagram.com/..."
                    value={localSettings.social?.instagram || ''}
                    onChange={(e) => updateField('social.instagram', e.target.value)}
                  />
                  <Input
                    label="WhatsApp"
                    placeholder="+54911..."
                    value={localSettings.social?.whatsapp || ''}
                    onChange={(e) => updateField('social.whatsapp', e.target.value)}
                  />
                  <Input
                    label="Facebook"
                    placeholder="https://facebook.com/..."
                    value={localSettings.social?.facebook || ''}
                    onChange={(e) => updateField('social.facebook', e.target.value)}
                  />
                </div>
              </SettingsCard>
            </>
          )}

          {activeSection === 'policies' && (
            <>
              <SettingsCard title="Términos y Condiciones" description="Texto completo">
                <textarea
                  className="w-full h-40 p-3 rounded-lg border border-outline bg-white text-sm resize-vertical"
                  placeholder="Ingresa los términos y condiciones..."
                  value={localSettings.policies?.terms || ''}
                  onChange={(e) => updateField('policies.terms', e.target.value)}
                />
              </SettingsCard>
              <SettingsCard title="Política de Privacidad" description="Texto completo">
                <textarea
                  className="w-full h-40 p-3 rounded-lg border border-outline bg-white text-sm resize-vertical"
                  placeholder="Ingresa la política de privacidad..."
                  value={localSettings.policies?.privacy || ''}
                  onChange={(e) => updateField('policies.privacy', e.target.value)}
                />
              </SettingsCard>
            </>
          )}
        </div>
      </div>

      {hasChanges && activeSection !== 'profile' && (
        <div className="fixed bottom-6 right-6 bg-surface-container-low rounded-lg shadow-lg p-4 border border-outline-variant/30">
          <div className="flex items-center gap-3">
            <Badge variant="warning" size="sm">Cambios sin guardar</Badge>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}