import type { TenantBranding } from '@tenant/domain/types/tenant.types'

/**
 * Utilidades para aplicar theming dinámico basado en tenant
 */
export class ThemeManager {
  /**
   * Aplica el branding del tenant al DOM
   */
  static applyBranding(branding: TenantBranding): void {
    // 1. Aplicar colores CSS como variables
    this.applyCSSVariables(branding)

    // 2. Cambiar favicon
    if (branding.favicon) {
      this.changeFavicon(branding.favicon)
    }

    // 3. Cambiar título de la página
    this.changeTitle(branding.companyName)

    // 4. Aplicar meta tags
    this.applyMetaTags(branding)
  }

  /**
   * Aplica variables CSS al root
   */
  private static applyCSSVariables(branding: TenantBranding): void {
    const root = document.documentElement

    // Colores primarios
    root.style.setProperty('--color-primary', branding.primaryColor)
    root.style.setProperty('--color-secondary', branding.secondaryColor)

    // Generar variantes automáticamente
    const variants = this.generateColorVariants(branding.primaryColor)
    Object.entries(variants).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value)
    })
  }

  /**
   * Genera variantes de un color (lighter, darker, etc)
   */
  private static generateColorVariants(color: string): Record<string, string> {
    // Convertir hex a RGB
    const rgb = this.hexToRgb(color)
    if (!rgb) return {}

    return {
      '50': this.rgbToHex(this.lighten(rgb, 0.95)),
      '100': this.rgbToHex(this.lighten(rgb, 0.9)),
      '200': this.rgbToHex(this.lighten(rgb, 0.75)),
      '300': this.rgbToHex(this.lighten(rgb, 0.6)),
      '400': this.rgbToHex(this.lighten(rgb, 0.3)),
      '500': color,
      '600': this.rgbToHex(this.darken(rgb, 0.1)),
      '700': this.rgbToHex(this.darken(rgb, 0.2)),
      '800': this.rgbToHex(this.darken(rgb, 0.3)),
      '900': this.rgbToHex(this.darken(rgb, 0.4)),
    }
  }

  /**
   * Cambia el favicon
   */
  private static changeFavicon(faviconUrl: string): void {
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement

    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }

    link.href = faviconUrl
  }

  /**
   * Cambia el título de la página
   */
  private static changeTitle(companyName: string): void {
    document.title = companyName
  }

  /**
   * Aplica meta tags dinámicos
   */
  private static applyMetaTags(branding: TenantBranding): void {
    // Theme color para mobile browsers
    this.setMetaTag('theme-color', branding.primaryColor)

    // Description
    if (branding.tagline) {
      this.setMetaTag('description', branding.tagline)
    }

    // Apple mobile web app
    this.setMetaTag('apple-mobile-web-app-title', branding.companyName)
  }

  /**
   * Set o actualiza un meta tag
   */
  private static setMetaTag(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement

    if (!meta) {
      meta = document.createElement('meta')
      meta.name = name
      document.head.appendChild(meta)
    }

    meta.content = content
  }

  // ==================== COLOR UTILITIES ====================

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  private static rgbToHex(rgb: { r: number; g: number; b: number }): string {
    return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)
  }

  private static lighten(rgb: { r: number; g: number; b: number }, factor: number) {
    return {
      r: Math.round(rgb.r + (255 - rgb.r) * factor),
      g: Math.round(rgb.g + (255 - rgb.g) * factor),
      b: Math.round(rgb.b + (255 - rgb.b) * factor),
    }
  }

  private static darken(rgb: { r: number; g: number; b: number }, factor: number) {
    return {
      r: Math.round(rgb.r * (1 - factor)),
      g: Math.round(rgb.g * (1 - factor)),
      b: Math.round(rgb.b * (1 - factor)),
    }
  }

  /**
   * Resetea el theming a valores por defecto
   */
  static reset(): void {
    const root = document.documentElement
    root.style.removeProperty('--color-primary')
    root.style.removeProperty('--color-secondary')

    document.title = 'Farmasys'
  }
}
