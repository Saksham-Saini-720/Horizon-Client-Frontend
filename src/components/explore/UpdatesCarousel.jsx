import { memo, useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdates } from "../../hooks/updates/useUpdates";
import SectionHeader from "./SectionHeader";

// News and updates on the landing page — the way in to /updates.
//
// ── Why this scrolls natively instead of translating a track ─────────────────
// MostViewedCarousel drives itself with a transform on a flex track and advances
// only from two 40px tap zones at the screen edges. That is fine for a 360px
// card with its neighbours peeking, and it was the wrong model here for two
// reasons that made the first version of this component feel broken:
//
//   1. A full-gutter card invites a drag across the middle, and a transform
//      track has nothing listening there. Hand-rolling the gesture did not
//      really fix it — a threshold that needs 44px of travel and more
//      horizontal than vertical movement rejects the slightly diagonal drag
//      most people actually make.
//   2. Pausing auto-advance on mouseenter latches on a touchscreen. Phones
//      fire an emulated mouseenter on tap and frequently never fire
//      mouseleave, so the carousel stopped for good after the first touch.
//
// A scroll-snap container has none of that: the browser gives us momentum
// swipe, trackpad scrolling, keyboard arrows and correct pointer capture, and
// the active card is read back from scrollLeft rather than tracked in state
// that can disagree with what is on screen.
//
// ── Why there is no category label ──────────────────────────────────────────
// The Update model carries title, slug, excerpt, body, heroImage and status —
// there is no category or tag field, so there is nothing to put in an eyebrow.
// The date is the only real metadata an article has. "LATEST" sits on the first
// card only, where it is a true statement about ordering rather than invented
// taxonomy.
//
// ── Why this renders nothing when empty ─────────────────────────────────────
// Every other rail on Explore shows an EmptyState when it has nothing, which is
// right for properties: someone searching for homes needs to know the search
// came back empty. Nobody arrives on the landing page looking for news, so "No
// updates yet" would be a section-sized hole apologising for nothing. Same for
// an error — a failed news fetch must not drop a retry button into the middle
// of someone's property browsing.

// Every section on Explore lines up on this inset. Matching it is what keeps the
// first card's left edge under the section heading.
const GUTTER = 24;
const CARD_GAP = 8;
// Wide enough to be the page's lead element on a phone, capped so it does not
// become a billboard in a desktop window. Past this the track centres instead.
const CARD_MAX = 560;
const CARD_H = 216;
const ADVANCE_MS = 6000;
// How many articles the carousel holds. Older pieces are behind SEE ALL.
const LIMIT = 10;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

// ─── One article ──────────────────────────────────────────────────────────────

const UpdateCard = memo(({ article, width, isFirst, onOpen }) => {
  const hero = article.heroImage?.url;

  return (
    <article
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Read: ${article.title}`}
      className="relative snap-start flex-shrink-0 rounded-3xl overflow-hidden bg-white
                 border border-black/5 shadow-card cursor-pointer
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
      style={{ width, height: CARD_H }}
    >
      {hero ? (
        <img
          src={hero}
          alt={article.heroImage.alt ?? ""}
          // draggable off, or dragging the card in a desktop browser picks the
          // image up as a drag payload instead of scrolling the carousel.
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      ) : (
        // heroImage is optional on the model. Rather than drop the article or
        // leave a white gap, the card becomes a typographic one: the same navy
        // the brand already uses, warmed at one corner so it reads as a
        // designed surface rather than an empty box.
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(150% 100% at 72% 8%, rgba(201,108,56,0.5), transparent 55%)," +
              "linear-gradient(148deg, #41508F, #26306E 48%, #1A2050)",
          }}
        />
      )}

      {/* Two stops, not one: a near-opaque foot for the text to sit on and a
          long soft ramp, so the photograph stays readable in its top two thirds. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(16,20,44,0.92) 4%, rgba(16,20,44,0.42) 46%, transparent 78%)",
        }}
      />

      <div className="absolute inset-0 p-[17px] flex flex-col justify-between pointer-events-none">
        {isFirst ? (
          <span
            className="self-start text-[9.5px] font-bold tracking-[0.18em] uppercase font-myriad
                       rounded-full px-[9px] py-[3px]"
            style={{ color: "#F1C7A8", border: "1px solid rgba(241,199,168,0.5)" }}
          >
            Latest
          </span>
        ) : (
          <span aria-hidden="true" />
        )}

        <div>
          <h3
            className="font-display text-[21px] font-semibold leading-[1.18] tracking-[-0.014em]
                       text-white line-clamp-3"
          >
            {article.title}
          </h3>

          <div className="flex items-center justify-between mt-[9px]">
            {article.postedLabel ? (
              <span
                className="text-[11px] font-myriad text-white/60"
                title={article.postedExact ? `Posted ${article.postedExact}` : undefined}
              >
                {article.postedLabel}
              </span>
            ) : (
              <span aria-hidden="true" />
            )}
            <span
              className="text-[11.5px] font-bold tracking-[0.14em] uppercase font-myriad"
              style={{ color: "#F0B98E" }}
            >
              Read →
            </span>
          </div>
        </div>
      </div>
    </article>
  );
});
UpdateCard.displayName = "UpdateCard";

// ─── Loading ──────────────────────────────────────────────────────────────────

const CardSkeleton = ({ width }) => (
  <div
    className="rounded-3xl bg-gray-100 animate-pulse border border-black/5 flex-shrink-0"
    style={{ width, height: CARD_H }}
  />
);

// ─── The section ──────────────────────────────────────────────────────────────

export default function UpdatesCarousel() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useUpdates({ limit: LIMIT });
  const updates = data?.updates ?? [];
  const count = updates.length;

  const scrollerRef = useRef(null);
  const measureRef = useRef(null);
  const [index, setIndex] = useState(0);

  // Auto-advance stops for good at the first deliberate interaction. A "pause
  // then resume" needs a resume event to fire, and on a touchscreen the
  // matching mouseleave often never arrives — which is exactly how the previous
  // version got stuck paused. Someone who has started browsing the carousel
  // does not need it moving under them anyway.
  const [userTook, setUserTook] = useState(false);

  const [reduceMotion] = useState(prefersReducedMotion);

  // Seeded from the viewport, not 0 — at 0 the width below falls back to
  // CARD_MAX, and on a 344px cover screen a 560px card overflows on first paint.
  const [containerWidth, setContainerWidth] = useState(() =>
    typeof window === "undefined" ? 0 : window.innerWidth,
  );

  // Measured on a plain full-width div that is always in the tree, rather than
  // on the scroller itself: the scroller's offsetWidth is what we are trying to
  // fill, and observing the element whose size depends on the value being
  // computed is how the first version ended up a frame behind.
  //
  // useLayoutEffect so this lands before paint, or the first frame draws at the
  // seeded guess instead of the real width.
  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      if (measureRef.current) setContainerWidth(measureRef.current.offsetWidth);
    });
    observer.observe(el);
    setContainerWidth(el.offsetWidth);
    return () => observer.disconnect();
  }, []);

  // The card never exceeds the space between the gutters, so a narrow phone
  // shrinks it to fit instead of running it off the right edge.
  const innerWidth = Math.max(0, containerWidth - GUTTER * 2);
  const cardWidth = containerWidth > 0 ? Math.min(CARD_MAX, innerWidth) : CARD_MAX;
  // Where the card is narrower than the space available, the whole run centres
  // instead of hugging the left.
  const leadIn = GUTTER + Math.max(0, (innerWidth - cardWidth) / 2);
  const step = cardWidth + CARD_GAP;

  const scrollToIndex = useCallback(
    (i, smooth = true) => {
      const el = scrollerRef.current;
      if (!el || step <= 0) return;
      el.scrollTo({
        left: i * step,
        behavior: smooth && !reduceMotion ? "smooth" : "auto",
      });
    },
    [step, reduceMotion],
  );

  // The active card is read back from scroll position rather than held in state
  // the scroller could disagree with — a swipe, a dot, a keyboard arrow and the
  // auto-advance all land in the same place.
  const rafRef = useRef(0);
  const onScroll = () => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const el = scrollerRef.current;
      if (!el || step <= 0) return;
      setIndex(Math.max(0, Math.min(Math.round(el.scrollLeft / step), count - 1)));
    });
  };
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  useEffect(() => {
    if (reduceMotion || userTook || count <= 1) return;
    const id = setInterval(() => {
      const el = scrollerRef.current;
      if (!el || step <= 0) return;
      const at = Math.round(el.scrollLeft / step);
      const next = at >= count - 1 ? 0 : at + 1;
      el.scrollTo({ left: next * step, behavior: "smooth" });
    }, ADVANCE_MS);
    return () => clearInterval(id);
  }, [reduceMotion, userTook, count, step]);

  const header = (
    // "Latest Updates", two words, deliberately. SectionHeader builds its
    // two-tone heading from title.split(" ") and reads only [0] and [1], so the
    // page's own "News & Updates" would render as "News &" and drop the subject
    // silently. Fixing that component affects every section here, so it is its
    // own change.
    <SectionHeader title="Latest Updates" onSeeAll={() => navigate("/updates")} />
  );

  // Always rendered, in every branch, so the observer above has something stable
  // to measure whatever the query is doing.
  const measure = <div ref={measureRef} className="h-0" aria-hidden="true" />;

  if (isLoading) {
    return (
      <div className="mt-4 mb-6">
        {measure}
        {header}
        <div className="flex" style={{ paddingLeft: leadIn }}>
          <CardSkeleton width={cardWidth} />
        </div>
      </div>
    );
  }

  if (isError || count === 0) return <>{measure}</>;

  return (
    <div className="mt-4 mb-6">
      {measure}
      {header}

      <div
        ref={scrollerRef}
        onScroll={onScroll}
        onPointerDown={() => setUserTook(true)}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-x-contain"
        style={{
          gap: CARD_GAP,
          // The gutter is padding on the scroller, not a margin on the cards, so
          // the first and last card can both reach their snap position. The
          // matching scroll-padding is what makes snap-start align to the gutter
          // rather than to the very edge of the scrollport.
          paddingLeft: leadIn,
          paddingRight: leadIn,
          scrollPaddingLeft: leadIn,
          // Vertical page scrolling must still work when the gesture starts on a
          // card, so only the horizontal axis is claimed here.
          touchAction: "pan-x pan-y",
        }}
      >
        {updates.map((article, idx) => (
          <UpdateCard
            key={article.id}
            article={article}
            width={cardWidth}
            isFirst={idx === 0}
            onOpen={() => navigate(`/updates/${article.slug}`)}
          />
        ))}
      </div>

      {count > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 px-6 flex-wrap">
          {updates.map((article, i) => (
            <button
              key={article.id}
              onClick={() => {
                setUserTook(true);
                scrollToIndex(i);
              }}
              aria-label={`Show update ${i + 1} of ${count}`}
              aria-current={i === index}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? 18 : 6,
                height: 6,
                // Copper for the active dot, the same accent the nav bar and the
                // section rule use; inactive dots take the page's warm hairline
                // rather than a cool grey.
                background: i === index ? "#C96C38" : "#CFC9BC",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
