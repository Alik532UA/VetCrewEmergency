# VetCrewEmergency — Інструкції для AI

Див. повний канонічний контекст у [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md) та практичні правила для агентів у [AGENTS.md](AGENTS.md).

## Швидкі команди

- **Розробка**: `npm run dev`
- **Перевірка типів**: `npm run check`
- **Перевірка i18n**: `npm run check:i18n`
- **Юніт-тести**: `npm test` або `npx vitest run`
- **E2E тести**: `npm run test:e2e`
- **Лінтинг**: `npm run lint` (`lint:format` + `lint:code`)
- **Аудит безпеки**: `npm run audit:ci`
- **Збірка**: `npm run build`
- **Перевірка збірки та бандла**: `npm run check:build && npm run check:bundle`

## Ключові інваріанти

- **Префікс сховища**: `vetcrewemergency_` (доступ виключно через `$lib/services/storage.ts`).
- **Мови**: 4 локалі (`uk`, `en`, `de`, `nl`), маршрутизація `src/routes/[[lang=lang]]/`.
- **Дані контенту**: типізовані та валідовані через Zod.
- **CSP**: Хешування інлайн-скриптів у `svelte.config.js` (`mode: 'hash'`).
