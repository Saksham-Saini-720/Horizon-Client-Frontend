/**
 * Role helpers for the client app.
 *
 * Staff (admins, managers) may use the client portal with their own credentials
 * to reach the full client interface. They are treated as privileged so the
 * client-only gates — email verification in particular — don't block them.
 *
 * The decision comes from `user.profileType`, which the API ships on login and
 * on /auth/me. It used to be a local `PRIVILEGED_ROLES = ["admin", "manager"]`
 * list, which was a copy of a backend rule with no link to it: roles are
 * creatable at runtime now, so a new staff role would have been treated as a
 * client here and asked to verify an email nobody ever sent it.
 *
 * `profileType` is the same predicate the API's own `requireVerifiedEmail` uses:
 *   "agent"  — an agent account
 *   "client" — a client account, subject to the client gates
 *   null     — pure staff (admin, manager, and any role like them)
 *
 * One difference this resolves: the old list excluded agents, so the two ends
 * disagreed — the API's `requireVerifiedEmail` trusted agents while this file
 * did not. No practical effect, since agents are admin-provisioned with
 * `emailVerification: true` and so never tripped the gate, but the two now
 * agree by construction rather than by coincidence.
 */

// Kept only for a stored user snapshot written before the API shipped
// profileType. Remove once sessions have turned over.
const LEGACY_PRIVILEGED_ROLES = ["admin", "manager"];

/**
 * Whether this account is staff rather than a client.
 *
 * Falls back to the old role-name list only when `profileType` is absent —
 * which means an older localStorage snapshot, not a new role.
 */
export const isPrivilegedRole = (roleOrUser) => {
  // Accepts either a user object (preferred) or a bare role string, since
  // callers pass both.
  const user =
    typeof roleOrUser === "object" && roleOrUser !== null
      ? roleOrUser
      : { role: roleOrUser };

  // `null` is a real value here (pure staff), so the check is against
  // `undefined` alone — the field being absent, not the field being null.
  if (user.profileType !== undefined) {
    return user.profileType !== "client";
  }

  return LEGACY_PRIVILEGED_ROLES.includes(user.role);
};

/**
 * Whether the API has told us this account has no role at all — its role was
 * deleted and it was moved to `unassigned`.
 *
 * Worth surfacing rather than letting the app render an empty shell: the user
 * would otherwise conclude the site is broken instead of contacting an admin.
 */
export const isUnassignedAccount = (user) => user?.accountState === "unassigned";

/** The message to show an unassigned account, from the API. */
export const unassignedMessage = (user) =>
  user?.accountMessage ??
  "Your account does not currently have a role assigned. Please contact your administrator.";

/**
 * Single source of truth for the email-verification gate.
 *
 * Only a definite `false` blocks. A user object that simply doesn't carry the
 * field (older stored snapshot, a trimmed API response) is "unknown", not
 * "unverified" — treating unknown as unverified used to bounce already-verified
 * users to /verify-email.
 */
export const needsEmailVerification = (user) =>
  user?.emailVerification === false && !isPrivilegedRole(user);

/**
 * A user counts as verified for client-portal gating unless we positively know
 * their email is unverified, or they are a staff account.
 */
export const isVerifiedForClientPortal = (user) => !needsEmailVerification(user);
