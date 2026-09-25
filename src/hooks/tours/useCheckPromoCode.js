import { useEffect, useState } from 'react';

import { checkPromoCode } from '../../api/tourApi';

/**
 * Live validation for the promo code field on the tour booking form.
 *
 * ## Why this re-runs on the visit type, not just on typing
 *
 * The answer depends on two inputs and only one of them is typed: a code valid
 * for an in-person visit is invalid for a virtual one. So the check follows the
 * visit type too — which is precisely why the field lives in step 1 of the
 * modal, below the visit type picker, where both are on screen together.
 *
 * ## Why idle and checking are derived rather than stored
 *
 * Only the *resolved* answer is state. Whether we are idle (too short to be a
 * code) or still checking is a function of the current input and whether the
 * stored answer belongs to it — so neither needs a synchronous setState inside
 * the effect, which would cascade a render on every keystroke.
 *
 * Storing the key alongside the answer is what makes that work, and it also
 * removes a race for free: an answer that arrives for an input the user has
 * already changed no longer matches the key and is simply ignored.
 *
 * ## States
 *
 *   idle      nothing typed, or too short. Never an error — the field is
 *             optional and an empty one is not a mistake.
 *   checking  debouncing, or a request in flight
 *   valid     usable, and `perkLabel` says what for
 *   invalid   unusable, and `message` is the server's own wording, which names
 *             the visit type when that is the problem
 *   error     the check itself failed (offline, auth). Deliberately distinct
 *             from `invalid`: blaming someone's typing for a network problem
 *             sends them to fix something that is not wrong.
 */
const MIN_LENGTH = 3;
const DEBOUNCE_MS = 500;

const IDLE = { status: 'idle' };
const CHECKING = { status: 'checking' };

export default function useCheckPromoCode(code, visitType) {
  const trimmed = (code ?? '').trim();
  const tooShort = trimmed.length < MIN_LENGTH;
  const key = `${trimmed}|${visitType}`;

  // { key, value } — the answer, and the input it is an answer to.
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    if (tooShort) return undefined;

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const result = await checkPromoCode({ code: trimmed, visitType });
        if (cancelled) return;

        setAnswer({
          key,
          value: result.valid
            ? { status: 'valid', perkLabel: result.perkLabel }
            : {
                status: 'invalid',
                message: result.message,
                reason: result.reason,
              },
        });
      } catch (err) {
        if (cancelled) return;
        setAnswer({ key, value: { status: 'error', message: err.message } });
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [key, trimmed, visitType, tooShort]);

  if (tooShort) return IDLE;
  return answer?.key === key ? answer.value : CHECKING;
}
