# Design Brief

## Direction

Global Gamers — Dark-themed gaming video platform optimized for bus simulator community engagement with premium tier differentiation.

## Tone

Bold, energetic, gameplay-forward. Dark mode throughout to match gaming culture vernacular and protect eyes during extended viewing sessions.

## Differentiation

Premium users wear a glowing electric cyan badge with golden accent text, instantly visible on profiles and video cards, creating a status symbol for the competitive gaming community.

## Color Palette

| Token      | OKLCH          | Role                                    |
| ---------- | -------------- | --------------------------------------- |
| background | 0.11 0.01 260  | Deep dark neutral base                  |
| foreground | 0.93 0.01 260  | Light text for maximum contrast         |
| card       | 0.15 0.015 260 | Elevated content surfaces               |
| primary    | 0.72 0.2 190   | Electric cyan — primary interactive     |
| accent     | 0.68 0.22 55   | Golden orange — premium badge highlight |
| muted      | 0.19 0.02 260  | Secondary surfaces                      |

## Typography

- Display: Bricolage Grotesque — headlines, badges, premium treatment
- Body: DM Sans — content, descriptions, meta information
- Scale: H1 `text-4xl font-display font-bold`, H2 `text-2xl font-display font-bold`, labels `text-sm font-display`, body `text-base font-body`

## Elevation & Depth

Video cards and UI containers elevated via subtle border treatment on muted background, with darker background for content sections creating distinct layering without heavy shadows.

## Structural Zones

| Zone          | Background        | Border              | Notes                           |
| ------------- | ----------------- | ------------------- | ------------------------------- |
| Header        | `bg-card`         | `border-b border-border` | Sticky navigation with logo     |
| Feed/Content  | `bg-background`   | —                   | Alternating card sections       |
| Video Cards   | `bg-muted/30`     | `border border-border` | Rounded, video preview overlay  |
| Video Detail  | `bg-background`   | —                   | Hero player + sidebar metadata  |
| Footer        | `bg-muted/40`     | `border-t border-border` | Secondary information           |

## Spacing & Rhythm

Grid-based with 1rem base spacing unit. Sections separated by 2rem vertical gap. Video cards in 3-column grid on desktop (md), 2-column on tablet (sm), 1-column mobile. Premium badges nested within card/profile surfaces with 0.5rem internal padding.

## Component Patterns

- Buttons: Rounded (8px), primary cyan bg, white text, hover opacity 90%, transition-smooth
- Cards: Rounded (8px), muted background, border border-color, shadow-xs on hover
- Badges: Premium = border cyan outline, golden text, pill-shaped, `.badge-premium` utility class

## Motion

- Entrance: cards fade-in with 200ms ease on feed load
- Hover: card lift with subtle shadow, button opacity change
- Decorative: none — keep UI crisp for competitive gaming aesthetic

## Constraints

- Video thumbnails must be full-width with 16:9 aspect ratio and dark overlay gradient
- Premium badge must be visible on both profile avatars and video cards
- Cyan and orange are accent-only — never used for primary text or backgrounds
- All text must maintain minimum 4.5:1 contrast ratio for accessibility

## Signature Detail

Video cards feature a semi-transparent dark gradient overlay (`bg-gradient-to-t from-black/80 via-transparent to-transparent`) that protects text legibility over video thumbnails while preserving video preview context — a hallmark of modern gaming UI.

