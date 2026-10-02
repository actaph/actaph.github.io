# ACTA Members Portal — Setup Guide

The portal lives in the `members/` folder. It uses **Firebase** (free from Google) for member logins and data. The steps below take about 15 minutes and only need to be done once.

Pages:

| Page | Address | Who |
|---|---|---|
| Portal home | `actaph.github.io/members/` | Everyone — verify ID, announcements, chapters, resources, apply |
| Login | `actaph.github.io/members/login.html` | Members sign in or create an account |
| My Account | `actaph.github.io/members/dashboard.html` | Approved members — digital ID, details, members-only updates |
| Admin | `actaph.github.io/members/admin.html` | Admins (e.g. the Founder) — approve accounts, manage registry, posts, applications |

---

## 1. Create the Firebase project

1. Go to **console.firebase.google.com** and sign in with a Google account you can access. Afterwards add at least one more trusted owner under **Settings → Project settings → Users and permissions** (role *Owner*), e.g. actaph@gmail.com.
2. Click **Create a project**, name it `acta-members`, and finish the steps (Google Analytics can be turned off).
3. On the project home, click the **Web** icon (`</>`), name the app `ACTA website`, and click **Register app**. Do **not** tick Firebase Hosting.
4. Firebase shows a block of code with `const firebaseConfig = { ... }`. Keep this page open — you need these values in step 4.

## 2. Turn on email login

1. Left menu: **Build → Authentication → Get started**.
2. Under **Sign-in method**, choose **Email/Password**, switch it **on**, and **Save**.
3. Go to the **Settings** tab → **Authorized domains** → **Add domain** → type `actaph.github.io` → **Add**.

## 3. Create the database and security rules

1. Left menu: **Build → Firestore Database → Create database**.
2. Location: pick **asia-southeast1 (Singapore)**. Start in **production mode**.
3. Open the **Rules** tab, delete everything there, paste the full contents of the `firestore.rules` file from the website folder, and click **Publish**. Whenever `firestore.rules` is updated, paste and publish it again.

## 4. Connect the website

1. Open `members/firebase-config.js` in Notepad (or on GitHub with the pencil icon).
2. Replace each `PASTE_...` value with the matching value from step 1.4 (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
3. Save, then commit and push in GitHub Desktop. After the green tick, the "Portal setup pending" banner disappears.

These values are not secret — they only identify the project. What members can see or change is controlled by the security rules.

## 5. Make the Founder the first admin

Two admin roles mirror the paper form:

- **Founder** — final approval of applications and account requests, and the only one who can add, change or remove members in the registry.
- **Coordinator** (Membership Coordinator) — reviews and **endorses** applications, posts announcements and resources. Cannot approve.

1. On `actaph.github.io/members/login.html`, open **Create account** and sign up with the Founder's own email, name and ACTA ID.
2. In Firebase: **Security → Authentication → Users**. Copy the **User UID** of that account.
3. In **Firestore Database → Data**: click **+ Start collection**, Collection ID `admins`, click **Next**.
4. Document ID: paste the UID. Add a field named `role` (type string) with the value `founder`. Click **Save**.
5. Sign in on the website and open **Admin** (top menu). Under **Account requests**, approve the Founder's own request so he also gets a digital ID.

To add a Membership Coordinator, have them create an account, then repeat steps 2–4 with their UID and the value `coordinator`.

---

## Everyday use (Admin page)

- **Account requests** — existing members who signed up with their own email. The page shows whether the ID and name match the registry. Click **Review & approve** (they get member access and a digital ID) or **Reject**.
- **Member registry** — every ID that can be checked on *Verify ID*. Add all current members here (they don't need an account). To suspend someone, set **Status** to Suspended/Expelled instead of deleting — verification will show that status.
- **Applications** — submitted with the online version of the official form (with 2×2 photo). The Coordinator marks them *contacted* and *endorsed*; the Founder clicks *Approve* or *Decline*, then **Add to member registry** to assign an ACTA ID. **View / print form** prints the filled-in official form for the applicant's, sponsor's, Coordinator's and Founder's signatures. A blank printable form is at `actaph.github.io/members/print.html`.
- **Announcements** — post to *Everyone* (shown on the public portal) or *Members only* (shown after login).
- **Resources** — links to forms and files (e.g. a Google Drive PDF shared as "Anyone with the link"). *Members only* links appear in members' dashboards.

### Member photos

Save each photo in the website folder as `assets/members/ID-NUMBER.jpg` (for example `assets/members/CV-R7-0029.jpg`), commit and push, then in the member's record set **Photo link** to `../assets/members/CV-R7-0029.jpg`. Photos are public on the Verify page, so only use photos the member agreed to.

### Editing chapters and public resources

Chapter names, officers and the public resource links are in `members/data.js`. Edit the names between the quotes, then commit and push.

## Privacy notes

- Phone numbers, addresses and emails are **never** shown on public pages — only name, ID, chapter, position, status and photo.
- The application form asks for consent under the Data Privacy Act of 2012 (RA 10173). Delete applications you no longer need from the Admin page.
- Free Firebase limits (50,000 reads and 20,000 writes per day) are far more than ACTA needs.
