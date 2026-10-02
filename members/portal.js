// Shared helpers for the ACTA Members Portal.
import { firebaseConfig } from "./firebase-config.js?v=4";

const V = "10.12.2";
export const configured = !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("PASTE");

let app = null, auth = null, db = null, fb = {};
if (configured) {
  const [appMod, authMod, fsMod] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`)
  ]);
  app = appMod.initializeApp(firebaseConfig);
  auth = authMod.getAuth(app);
  db = fsMod.getFirestore(app);
  fb = { ...authMod, ...fsMod };
}
export { auth, db, fb };

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];

export function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function fmtDate(v) {
  if (!v) return "";
  const d = v.toDate ? v.toDate() : new Date(v);
  if (isNaN(d)) return esc(v);
  return d.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
}

export const normId = s => String(s || "").trim().toUpperCase().replace(/\s+/g, "");

// Only allow http(s) or site-relative links (blocks javascript: URLs).
export function safeUrl(u) {
  u = String(u || "").trim();
  if (/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(u)) return u;
  if (/^https?:\/\//i.test(u) || /^(\.\.?\/|\/|#)/.test(u) || /^[\w\-./]+$/.test(u)) return u;
  return "#";
}

export function setupBanner(el) {
  if (configured || !el) return;
  el.innerHTML = `<div class="notice warn"><b>Portal setup pending.</b> Member login, ID verification, announcements and applications will work once the Firebase project is connected (see PORTAL-SETUP.md).</div>`;
}

export function toast(msg, type = "ok") {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.className = `toast ${type} show`; t.textContent = msg;
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 3800);
}

const roleOf = snap => String(snap.data()?.role || "").trim().toLowerCase();

// Resolve the signed-in user's role: { user, profile, admin, signup }
export async function getRole(user) {
  if (!user) return { user: null };
  const [p, a, s] = await Promise.all([
    fb.getDoc(fb.doc(db, "profiles", user.uid)).catch(() => null),
    fb.getDoc(fb.doc(db, "admins", user.uid)).catch(() => null),
    fb.getDoc(fb.doc(db, "signups", user.uid)).catch(() => null)
  ]);
  return {
    user,
    profile: p?.exists() ? p.data() : null,
    admin: !!a?.exists(),
    adminRole: a?.exists() ? (["founder", "admin"].includes(roleOf(a)) ? "founder" : "coordinator") : null,
    adminLabel: a?.exists() ? ({ founder: "Founder", admin: "Admin" }[roleOf(a)] || "Coordinator") : null,
    signup: s?.exists() ? s.data() : null
  };
}

export function onUser(cb) {
  if (!configured) { cb(null); return; }
  fb.onAuthStateChanged(auth, cb);
}

export async function signOut() {
  await fb.signOut(auth);
  location.href = "./";
}

export function friendlyError(e) {
  const c = e?.code || "";
  const map = {
    "auth/invalid-credential": "Wrong email or password.",
    "auth/wrong-password": "Wrong email or password.",
    "auth/user-not-found": "No account found with that email.",
    "auth/email-already-in-use": "An account with that email already exists. Try signing in instead.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
    "auth/network-request-failed": "No internet connection. Please try again.",
    "permission-denied": "You don't have permission to do that. Approvals and member records can only be changed by the Founder."
  };
  return map[c] || e?.message || "Something went wrong. Please try again.";
}

// Mobile menu + header login link
export function initHeader() {
  const menu = $(".menu"), nav = $("#navlinks");
  menu?.addEventListener("click", () => nav.classList.toggle("open"));
  $$("#navlinks a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  const link = $("#nav-account");
  if (link) onUser(u => {
    link.textContent = u ? "My Account" : "Member Login";
    link.href = u ? "dashboard.html" : "login.html";
  });
}

export const STATUS_CLASS = { Active: "ok", Inactive: "muted", Suspended: "warn", Expelled: "bad" };
