# ACTA Members Portal — Guide

The Members Portal lives in the `members/` folder of the ACTA website. Member logins and data are stored in **Firebase** (Google), on the free **Spark** plan. Do not click "Upgrade" in Firebase — nothing in the portal needs a paid plan.

**Status (October 2026):** set up and live. Firebase project `acta-members` is connected, security rules are published, and the first admin account is active.

## Pages

| Page | Address | Who uses it |
|---|---|---|
| Portal home | `actaph.github.io/members/` | Everyone: verify an ID, announcements, chapters, resources, online application |
| Verify one ID | `actaph.github.io/members/?id=CV-R7-0029` | Opened by scanning the QR code on a digital ID |
| Login | `actaph.github.io/members/login.html` | Members sign in, create an account, or reset a password |
| My Account | `actaph.github.io/members/dashboard.html` | Approved members: digital ID with QR code, contact details, members-only announcements and resources |
| Admin | `actaph.github.io/members/admin.html` | Admins: approvals, member registry, applications, announcements, resources |
| Printable form | `actaph.github.io/members/print.html` | Blank official Membership Application Form (print or save as PDF) |

---

## Roles

Admins are listed in the Firestore collection `admins`. Each document's ID is the person's **User UID**, with one text field `role`:

| `role` value | Can do |
|---|---|
| `founder` | Everything: final approval of applications and account requests; add, edit and remove members in the registry |
| `admin` | Same full access as `founder`. For the person who manages the portal |
| `coordinator` | Membership Coordinator: mark applications *contacted* and *endorsed*, post announcements and resources. Cannot approve, decline, or change member records |

Everyone else is either an approved **member** (has a digital ID) or an account **awaiting approval**.

The digital ID on **My Account** follows the printed ACTA ID card (flag, ACTA heading, photo, name, position, ID No., chapter, Central Visayas Region VII, Exp.Date as MM/YYYY, Corporate Adviser line) and adds a QR code that opens the member's *Verify ID* page. **Print / save ID** saves it as a PDF.

### Adding an admin or coordinator

1. The person creates an account at `actaph.github.io/members/login.html` → **Create account**.
2. In Firebase: **Security → Authentication → Users**. Hover over their **User UID** and click the copy icon. (Don't type it — capital `I` and lowercase `l`, `0` and `O` look alike.)
3. In **Firestore Database → Data → admins**: click **+ Add document**.
4. **Document ID:** paste the UID. Field `role`, type *string*, value `founder`, `admin` or `coordinator` (lowercase, no spaces). **Save**.
5. They sign in again (or refresh with **Ctrl+F5**); **Admin** appears in the top menu.

To remove someone's admin access, delete their document in `admins`. To change their role, edit the `role` value.

**When the Founder joins:** add him with `role` = `founder`. The current portal manager stays `admin`.

---

## How members join

### Existing members (already have an ACTA ID)

1. Member goes to `actaph.github.io/members/login.html` → **Create account**, and enters their full name, ACTA ID **exactly as printed** (e.g. `CV-R7-0029`), chapter, **personal email** and a password (8+ characters).
2. They see "Account awaiting approval".
3. Admin opens **Admin → Account requests**. The *Registry check* column shows whether the ID is already in the registry and whether the name matches.
4. Click **Review & approve**, check the ID, name, chapter, position and dates, then **Approve**. The member is added to the registry (if not already there) and gets their digital ID under **My Account**.
5. **Reject** removes the request; the person stays signed up but without member access.

### New applicants (no ACTA ID yet)

1. Applicant fills in the online **Membership Application Form** on the portal home (same sections as the paper form, with optional 2×2 photo), or prints the blank form.
2. **Admin → Applications:** the Coordinator clicks **Mark contacted**, then **Endorse**.
3. The Founder/Admin clicks **Approve** (or **Decline**).
4. On the approved application, click **Add to member registry**, enter the new ACTA ID number, and **Save**.
5. **View / print form** prints the filled-in official form on one A4 page for the applicant's, sponsor's, Membership Coordinator's and Founder's signatures at orientation.
6. The new member can then create a portal account (steps above) to get their digital ID.

---

## Everyday admin tasks

- **ID numbers:** enter them in one format, e.g. `CV-R7-046` (the printed cards vary: "CV - R7 046", "CV -R 7 080"). Verify ID only finds an exact match.
- **Member registry:** every ID listed here can be checked on *Verify ID*. Members don't need a portal account to be listed. Use **+ Add member** for current members. To suspend or expel someone, **Edit** and change **Status** (verification will show it) instead of removing them.
- **ID valid until:** the date boxes are month first (`MM/DD/YYYY`). `01/03/2028` means January 3, 2028.
- **Announcements:** choose *Everyone (public)* to show on the portal home, or *Members only* for signed-in members. Web addresses in posts show as plain text (not clickable links).
- **Resources:** links to files or pages, e.g. a Google Drive PDF shared as "Anyone with the link". *Members only* resources appear on members' dashboards.

### Member photos

Photos are uploaded directly in the portal, shrunk to a small square and saved in the database (no paid storage needed). They appear on the digital ID and the public *Verify ID* page, so only use photos the member agreed to. Without a photo, the ID shows the member's initials.

- **Admin upload:** **Member registry → Edit** (or the approval form) → **ID photo → Choose file** → **Save**. **Remove photo** clears it. A photo link can still be used under "Or use a photo link".
- **Approved applicants:** **Add to member registry** automatically uses the applicant's 2×2 photo from their application.
- **Members' own photos:** a member uploads a photo under **My Account → ID photo**. It does **not** go live until a Founder/Admin approves it in **Admin → Photo requests** (**Approve photo** or **Reject**). Coordinators can see requests but not approve them.

### Chapters and public resources

Chapter names, officers and the public resource links are in `members/data.js`. Edit the text between the quotes, then commit and push. Current chapters: Lapu-Lapu City (Founding Chapter), Liloan, Compostela, Danao.

---

## Updating the website

1. Make changes (or unzip an update) in `Documents\GitHub\actaph.github.io`.
2. GitHub Desktop → write a summary → **Commit to main** → **Push origin**.
3. On github.com/actaph/actaph.github.io, wait for the **green tick** next to the latest commit (1–2 minutes).
4. Open the page and press **Ctrl+F5**.

The `Claude outputs` folder is ignored by Git (see `.gitignore`) and never uploaded.

**If `firestore.rules` changes:** Firebase → **Firestore Database → Rules** → select all → paste the whole new file → **Publish**. Pushing to GitHub alone does not update the rules.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Page looks unchanged after an update | Wait for the green tick on GitHub, then **Ctrl+F5**, or open a private window (**Ctrl+Shift+N**) |
| Red ✕ on GitHub, "deploy" failed with *Request timeout* / *Failed to get ID Token* | GitHub glitch. Open the failed run → **Re-run jobs**. If it keeps failing, make a small commit (e.g. edit `README.txt`) to start a fresh deploy |
| Settings → Pages shows Source "GitHub Actions" | Change it to **Deploy from a branch**, branch **main**, folder **/(root)** |
| Admin page says "Coordinator" for a full admin | Check the `role` value in `admins` is exactly `admin` or `founder`, then **Ctrl+F5** |
| "You don't have permission to do that" when approving | Only `founder`/`admin` can approve. Also check the latest `firestore.rules` is published in Firebase |
| "Portal setup pending" banner | `members/firebase-config.js` is missing the Firebase values |
| Forgot password | Login page → **Forgot password** → enter email → open the email from `noreply@acta-members.firebaseapp.com` (check Spam). Or Firebase → Authentication → Users → ⋮ → *Reset password* |
| Login fails on the live site with a domain error | Firebase → **Security → Authentication → Settings → Authorized domains** must include `actaph.github.io` |

---

## Firebase setup reference (already done)

Kept for reference if the project ever has to be recreated.

1. **Project:** console.firebase.google.com → create project `acta-members` (Analytics off) → **Add app → Web (`</>`)**, nickname `ACTA website`, no Hosting → copy the `firebaseConfig` values into `members/firebase-config.js`. These values are not secret; access is controlled by the security rules.
2. **Login:** **Security → Authentication → Sign-in method** → enable **Email/Password** (leave Email link off) → **Settings → Authorized domains** → add `actaph.github.io`.
3. **Database:** **Databases & Storage → Firestore Database → Create database** → Standard edition, ID `(default)`, location **asia-southeast1 (Singapore)**, production mode, no scheduled backups → **Rules** tab → paste `firestore.rules` → **Publish**.
4. **First admin:** see *Adding an admin or coordinator* above.
5. **Owners:** add at least one more trusted Google account as **Owner** under **Settings → Project settings → Users and permissions** (e.g. actaph@gmail.com once it is accessible), so the project doesn't depend on one person.

### Database collections

| Collection | Contents | Who can read |
|---|---|---|
| `admins` | Admin roles (by User UID) | Each admin reads only their own |
| `registry` | Member records by ID number: name, chapter, position, status, dates, photo | Anyone can look up one ID; members/admins can list all |
| `profiles` | Approved members' accounts, including private contact details and any photo waiting for approval | The member themself and admins |
| `signups` | Account requests awaiting approval | The requester and admins |
| `applications` | Online membership applications | Admins only |
| `announcements`, `resources` | Posts and links, marked public or members-only | Public ones: everyone. Members-only: signed-in members and admins |

---

## Privacy notes

- Phone numbers, addresses and emails are **never** shown on public pages. Only name, ID, chapter, position, status and photo appear on *Verify ID*.
- The application form asks for certification and consent under the Data Privacy Act of 2012 (RA 10173). Delete applications you no longer need (Founder/Admin only).
- Delete any test members or test applications before announcing the portal.
- Free Firebase limits (about 50,000 reads and 20,000 writes per day) are far more than ACTA needs.
