# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlexSignature is a Mendix pluggable widget built with React 18 and TypeScript that provides a **signature capture pad**.
Users draw signatures on a canvas, and the widget stores the result as a base64 PNG data URL in a Mendix string attribute.
It produces an `.mpk` file for deployment into a Mendix application. The widget namespace is
`kobeon.flexsignature.FlexSignature`.

## Build & Development Commands

```bash
npm install --legacy-peer-deps   # Required for npm v7+
npm start                        # Watch mode — rebuilds on change, outputs to dist/ and test project
npm run dev                      # Start web dev server (localhost:3000, proxies to Mendix at localhost:8080)
npm run build                    # Production build (outputs .mpk to dist/<version>/)
npm run lint                     # Run ESLint
npm run lint:fix                 # Auto-fix lint issues
npm run release                  # Full release build
```

No test framework is configured.

## Mendix Documentation

-   [Property types for widget XML](https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-property-types-10/)
    — Reference for all property types available in `FlexSignature.xml`.
-   [Client APIs](https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-client-apis-10/) — Mendix client API
    available to pluggable widgets at runtime.

## Architecture

This is a **Mendix pluggable widget**, not a standalone React app. All tooling (webpack, Jest config, ESLint base, TS
config) is abstracted behind `@mendix/pluggable-widgets-tools`.

### Key files

-   **`src/FlexSignature.xml`** — Widget definition. Declares properties, data types, and platform support. Changing
    this regenerates `typings/FlexSignatureProps.d.ts` on build.
-   **`typings/FlexSignatureProps.d.ts`** — Auto-generated from the XML. Do not edit manually.
-   **`src/FlexSignature.tsx`** — Main widget entry point. Unwraps Mendix `DynamicValue`/`EditableValue` props and
    renders the `SignaturePad` component.
-   **`src/components/SignaturePad.tsx`** — Core signature drawing component. Wraps `react-signature-canvas` with
    clear/undo functionality, read-only overlay, and base64 PNG export.
-   **`src/FlexSignature.editorConfig.ts`** — Controls property visibility/validation in Mendix Studio.
-   **`src/ui/FlexSignature.css`** — Widget styles (canvas layout, buttons, read-only overlay).
-   **`src/package.xml`** — Mendix package manifest (defines widget path as `kobeon/`).

### Widget properties (defined in FlexSignature.xml)

-   **`imageData`** — `EditableValue<string>` attribute storing the base64 PNG data URL. Linked to `onSaveSignature`
    via `onChange`, so `setValue()` auto-triggers the action.
-   **`onSaveSignature`** — Optional action triggered when signature data changes.
-   **`canvasWidth` / `canvasHeight`** — String properties for CSS dimensions (e.g., `"100%"`, `"400px"`, `"50vh"`).
-   **`penColor` / `penWidth` / `backgroundColor`** — Expression properties for drawing appearance.
-   **`showClearButton` / `showUndoButton`** — Boolean expression properties for button visibility.
-   System properties: `Label`, `TabIndex`, `Editability` (drives read-only state).

### Mendix widget conventions

-   The widget requires **entity context** (set in XML: `needsEntityContext="true"`).
-   The widget is **offline-capable** and targets **web** platform only.
-   Props flow: XML definition → auto-generated TypeScript types → React component props.
-   Build output goes to `dist/<version>/kobeon.FlexSignature.mpk`.
-   The project path (`../../`) should point to the Mendix project root for `npm start` to deploy the widget
    automatically.

## Dependencies

-   **Runtime:** `react-signature-canvas` (wraps `signature_pad`) for the signature drawing canvas. `classnames` for
    conditional CSS class joining.
-   **Dev:** `@mendix/pluggable-widgets-tools` handles all build tooling. `@types/react-signature-canvas` and
    `@types/big.js` for type support.

## Code Style

ESLint and Prettier configs both extend Mendix base configurations. XML files are formatted via `@prettier/plugin-xml`.
Line endings are enforced as LF via `.gitattributes`.

## Mendix integration notes

-   The widget must be placed inside a **data view** backed by an entity with an **Unlimited String** attribute.
-   The `imageData` attribute stores the full base64 PNG data URL (can be 10–100 KB).
-   To persist as a `System.Image`, the Mendix developer configures the `onSaveSignature` action with a nanoflow that
    decodes the base64 string (e.g., using Community Commons `Base64DecodeToFile` or a custom Java action).
-   The auto-generated `typings/FlexSignatureProps.d.ts` does **not** include `class` or `style` props — these are
    not available in the generated types for this widget configuration.
