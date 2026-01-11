# NanoCars - Stadtplan-Designer

Eine interaktive Programmierlerumgebung für Kinder und Jugendliche zum Erstellen und Programmieren von NanoCar-Stadtplänen.

## Features

- 🏙️ **Visueller Stadtplan-Editor** - 16x16 Feld-Grid
- 🚏 **Interaktive Elemente** - Haltestellen, Tankstellen, Ampeln, Werkstätten
- 🚐 **NanoCars** - Platzierbare elektrische Minibusse
- 💾 **Speichern/Laden** - JSON-basierte Stadtpläne
- 🎮 **Steuerung** - Interaktive Kontrolle für Haltestellen (Passagiere ±) und Ampeln (Farbe ±)

## Lokale Entwicklung

### Installation

```bash
npm install
```

### Development Server starten

```bash
npm run dev
```

Die App läuft dann auf `http://localhost:5173`

### Build für Produktion

```bash
npm run build
```

Der Build-Ordner ist `dist/`

## Deployment auf Vercel

### Option 1: Vercel CLI

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployment
vercel
```

### Option 2: GitHub Integration

1. Pushe dieses Projekt auf GitHub
2. Gehe zu [vercel.com](https://vercel.com)
3. Klicke auf "New Project"
4. Importiere dein GitHub Repository
5. Vercel erkennt automatisch Vite und konfiguriert alles
6. Klicke auf "Deploy"

### Vercel Einstellungen

Vercel erkennt automatisch die richtigen Einstellungen:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Verwendung

1. **Werkzeug auswählen** - Klicke auf ein Werkzeug in der linken Sidebar
2. **Element platzieren** - Klicke auf ein Feld im Grid
3. **Steuerung** - Nutze das rechte Panel für Haltestellen und Ampeln
4. **Speichern** - Exportiere deinen Stadtplan als JSON
5. **Laden** - Importiere einen gespeicherten Stadtplan

## Technologie-Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Canvas API** - Grid-Rendering

## Lizenz

MIT
