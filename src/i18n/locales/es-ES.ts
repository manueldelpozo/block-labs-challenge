import type { TTranslationMap } from '@/config/i18n.config';

export const esES: TTranslationMap = {
  'nav.dashboard': 'Panel',
  'nav.profile': 'Perfil',
  'nav.settings': 'Ajustes',

  'page.dashboard.title': 'Panel',
  'page.dashboard.description':
    'Métricas de rendimiento en tiempo real y resumen de negocio de la plataforma multiinquilino.',
  'page.dashboard.betaBanner.title': 'Vista previa de funciones beta activada',
  'page.dashboard.betaBanner.message':
    'Actualmente estás previsualizando un diseño de interfaz beta. Ciertos informes avanzados están en desarrollo.',
  'page.dashboard.errorLoading': 'Error al cargar métricas',
  'page.dashboard.errorLoading.message':
    'No se pudieron cargar los datos de rendimiento del panel:',
  'page.dashboard.analytics.title': 'Analíticas Operativas Avanzadas',
  'page.dashboard.analytics.enabled':
    'La visualización de analíticas operativas está activada para tu inquilino. A continuación se muestra un gráfico de distribución de ejemplo.',
  'page.dashboard.analytics.disabled':
    '⚠️ Las analíticas operativas avanzadas están desactivadas para tu inquilino. Ponte en contacto con soporte o mejora tu suscripción para desbloquear los gráficos.',
  'page.dashboard.trendVsLastPeriod': 'vs periodo anterior',
  'page.dashboard.stat.totalRevenue': 'Ingresos Totales',
  'page.dashboard.stat.activeUsers': 'Usuarios Activos',
  'page.dashboard.stat.conversionRate': 'Tasa de Conversión',
  'page.dashboard.stat.avgResponseTime': 'Tiempo Resp. Promedio',

  'page.profile.title': 'Perfil de Usuario',
  'page.profile.description': 'Gestiona tus preferencias de apariencia e información personal.',
  'page.profile.appearance': 'Apariencia',
  'page.profile.colorScheme': 'Esquema de color',
  'page.profile.colorSchemeDescription':
    'Elige tu esquema de color preferido. Automático sigue la configuración de tu sistema.',
  'page.profile.profileInfo': 'Información del Perfil',
  'page.profile.fullName': 'Nombre completo',
  'page.profile.fullNameDescription': 'Tu nombre visible en toda la plataforma',
  'page.profile.fullNamePlaceholder': 'Introduce tu nombre completo',
  'page.profile.email': 'Correo electrónico',
  'page.profile.emailDescription': 'Se usa para notificaciones y recuperación de cuenta',
  'page.profile.emailPlaceholder': 'Introduce tu correo electrónico',
  'page.profile.bio': 'Biografía',
  'page.profile.bioDescription': 'Una breve descripción sobre ti (máx. 200 caracteres)',
  'page.profile.bioPlaceholder': 'Cuéntanos algo sobre ti',
  'page.profile.saveChanges': 'Guardar Cambios',

  'page.settings.title': 'Ajustes',
  'page.settings.description':
    'Visualiza y personaliza las variables de entorno del inquilino, funciones activas y perfiles de configuración.',
  'page.settings.tenantSpecs': 'Especificaciones del Inquilino',
  'page.settings.activeFeatures': 'Funciones Activas',
  'page.settings.simulator': 'Simulador de Configuración Interactivo',
  'page.settings.officialName': 'Nombre Oficial',
  'page.settings.resolvedId': 'Identificador Resuelto',
  'page.settings.apiEndpoint': 'Endpoint de API',
  'page.settings.themeFont': 'Fuente del Tema',
  'page.settings.borderRadius': 'Radio de Borde',
  'page.settings.analyticsSuite': 'Suite de Analíticas',
  'page.settings.settingsConsole': 'Consola de Ajustes',
  'page.settings.darkMode': 'Modo Oscuro',
  'page.settings.betaBanner': 'Alertas de Banner Beta',
  'page.settings.active': 'Activo',
  'page.settings.suspended': 'Suspendido',
  'page.settings.adminHandle': 'Usuario Administrador',
  'page.settings.adminHandleDescription':
    'Cambia el nombre del administrador local para esta sesión',
  'page.settings.adminHandlePlaceholder': 'Introduce usuario administrador',
  'page.settings.emailDispatch': 'Activar envíos automáticos de correo',
  'page.settings.emailDispatchDescription':
    'Simula el estado de activación de alertas de correo para anulaciones de configuración',
  'page.settings.applyOverrides': 'Aplicar Anulaciones',

  'page.notFound.title': 'Página No Encontrada',
  'page.notFound.description':
    'El enlace que seguiste puede estar roto, o la página puede haber sido movida o desactivada para tu suscripción de inquilino.',
  'page.notFound.returnHome': 'Volver al Panel',

  'common.trend.increase': 'Aumentó en',
  'common.trend.decrease': 'Disminuyó en',
};
