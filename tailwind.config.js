/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Anything below this is an ultra-narrow device — a Z Fold cover screen
      // (344px), a Galaxy Fold (280px), older small Androids. Tailwind is
      // mobile-first, so write the cramped case as the base and restore normal
      // spacing at `xs:` and up: `px-4 xs:px-6`.
      screens: {
        xs: '360px',
      },
      colors: {
        primary: {
          DEFAULT: '#171C26',
          light:   '#C96C38',
        },
        secondary: '#2D368E',
        surface: '#ffffff',
        // Page behind white cards. A card layout reads because of the tonal
        // step between canvas and card — on white-against-white even a correct
        // shadow disappears, which is what made the detail sheet look flat.
        // Warm rather than a cool grey, to sit with the brand's orange.
        canvas: '#F7F6F3',
        // Scrim behind modals, sheets and media overlays. 16 call sites already
        // used `bg-bold/50` and friends, but the colour was never defined — so
        // every one of them compiled to nothing and those backdrops rendered
        // with a blur but no dim at all. Near-black rather than pure black so
        // the scrim sits in the brand's navy family.
        bold: '#171C26',
      },
      fontFamily: {
        // Manrope is the UI/body face. The key stays `myriad` so the ~80 files
        // already using `font-myriad` keep working — treat that class name as a
        // legacy alias for "the UI font", not a claim about which font it is.
        myriad:  ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        manrope: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        // One elevation for every property card. Tinted toward the header blue
        // rather than neutral grey: these cards sit on the blue band as often as
        // on white, and a grey shadow goes muddy over blue.
        //
        // Layered rather than a single blur. One wide 34px shadow spreads its
        // opacity over so much area that on white it reads as haze and the card
        // looks flat — what makes an edge look lifted is the tight contact
        // shadow right under it. So: a crisp 2px contact layer, a 12px mid, and
        // a broad ambient for the actual sense of height.
        card: [
          '0 1px 2px rgba(12,22,74,0.14)',
          '0 4px 12px rgba(12,22,74,0.13)',
          '0 16px 36px rgba(12,22,74,0.20)',
        ].join(', '),
        'card-hover': [
          '0 2px 4px rgba(12,22,74,0.16)',
          '0 8px 20px rgba(12,22,74,0.18)',
          '0 24px 52px rgba(12,22,74,0.26)',
        ].join(', '),
        // Lighter step for elements sitting inside a card or sheet — stat
        // tiles, chips — where the full card elevation would overpower them.
        // Same layering: a tight contact shadow so the edge reads as lifted,
        // plus a soft ambient for depth.
        'card-sm': [
          '0 1px 2px rgba(12,22,74,0.12)',
          '0 5px 16px rgba(12,22,74,0.14)',
        ].join(', '),
      },
    },
  },
  plugins: [],
}