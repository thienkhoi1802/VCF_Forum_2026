# Design QA — About hero

## Source visual truth

- Reference: `/var/folders/8b/3vmw41g11tv94qwhq72bt7k40000gn/T/codex-clipboard-9d008b45-dfb5-481b-8da9-554e55bd9a47.png`
- Reference pixels: 1983 × 793.
- Target state: trang “Giới thiệu”, desktop hero.

## Rendered implementation

- Desktop screenshot: `/tmp/vcf-about-hero-qa/implementation-desktop-new.png`.
- Mobile screenshot: `/tmp/vcf-about-hero-qa/implementation-mobile-new.png`.
- Previous comparison input: `/tmp/vcf-about-hero-qa/comparison.png`.
- Desktop CSS viewport: 1365 × 1024; captured content pixels: 1352 × 996.
- Mobile CSS viewport: 390 × 844.
- Latest mobile hero minimum height: 560px at widths below 768px, reduced from 720px to remove excess lower whitespace.
- Mobile hero copy uses a 200px top offset, and the background uses a shared bottom-to-top black fade from 100% opacity at the bottom to transparent at the top.
- The source and desktop capture use different aspect ratios, so both were normalized into the comparison image without stretching before review.

## State and interactions

- About route loaded with the existing global header.
- Latest hero state contains no subtitle or CTA, per the update request.
- Mobile menu was opened and the About route was loaded at 390 × 844.
- No form submission or external side effect was used.

## Findings

- Typography: headline hierarchy follows the requested white first line and brand-red second line; body copy uses the existing Inter-based display and body tokens; mobile scales to a content-based composition.
- Spacing and layout: hero is full bleed below the header, desktop content is aligned to the existing 1280px container, and the first content section starts with the requested responsive gap.
- Colors and tokens: the red/black/white palette uses existing VCF brand variables with a directional overlay for desktop and a stronger vertical overlay for mobile.
- Image fidelity: `public/images/about/about-hero-leadership.png` supplies the conference, audience, world-map and leadership imagery; the crop preserves the leadership group on the right.
- Copy and content: eyebrow and two-line headline remain; the latest request removes the subtitle and CTA; lower sections remain structurally unchanged.

## Comparison history

1. Initial desktop render showed the leftmost leader entering the headline area at approximately 1365px wide. This was a P2 composition issue because it reduced separation between copy and the main visual.
2. Added a desktop-only image translation and scale to move the leadership group right while preserving the mobile crop. The revised desktop comparison has a readable dark copy area and the requested right-weighted visual composition.
3. Replaced the background with `about-hero-leadership.png` and removed the subtitle/CTA markup and styles. The updated render shows the requested headline-only hero.
4. Replaced the hero background with the latest supplied 1983 × 793 asset. Desktop and mobile crops were rechecked with the new right-weighted leadership composition.
5. Added the requested bottom black fade and moved the mobile hero copy down to a 200px top offset.

## Implementation checklist

- [x] Full-bleed cinematic hero below the global header.
- [x] Responsive desktop, tablet and mobile composition.
- [x] Accessible semantic `h1` and descriptive image alt text.
- [x] Latest hero state verified without subtitle and CTA.
- [x] Lower About sections preserved.

## Follow-up polish

- The supplied reference uses a wider desktop frame than the local browser capture, so exact line wrapping will vary between viewport widths by design.

final result: passed
