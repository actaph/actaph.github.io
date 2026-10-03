// ACTA Membership Application Form — field list shared by the online form, admin page and printable form.
// Mirrors the official paper "Membership Application Form".

export const CIVIL = ["Single", "Married", "Separated", "Widow/er"];
export const MAX_CHILDREN = 8;

// [key, label, maxLength, required]
export const TEXT_FIELDS = {
  firstName: ["First name", 60, true], nickname: ["Nickname", 40], middleName: ["Middle name", 60], lastName: ["Last name", 60, true],
  birthPlace: ["Place of birth", 120, true], birthdate: ["Date of birth", 10, true], civilStatus: ["Civil status", 20, true],
  height: ["Height", 20], weight: ["Weight", 20], citizenship: ["Citizenship", 40, true], religion: ["Religion", 60], bloodType: ["Blood type", 10],
  street: ["Street no.", 120], barangay: ["Barangay", 80, true], city: ["Municipality / City", 80, true], province: ["Province", 80, true], zip: ["Zip code", 10],
  telephone: ["Telephone no.", 30], phone: ["Cellphone no.", 30, true], email: ["Email", 120],
  chapter: ["Preferred chapter", 80, true],
  employer: ["Name of office / line of business", 120], employerAddress: ["Office address", 200], jobTitle: ["Title and position", 80], workTel: ["Office tel. no.", 30], workFax: ["Fax no.", 30],
  spouseName: ["Spouse name", 120], spouseBirthdate: ["Spouse date of birth", 10],
  elementary: ["Elementary", 120], elementaryYear: ["Date graduated", 20],
  highSchool: ["High school", 120], highSchoolYear: ["Date graduated", 20],
  college: ["College", 120], collegeYear: ["Date graduated", 20],
  course: ["Course", 120], hobbies: ["Hobbies", 200], skills: ["Special skills", 200],
  sponsorName: ["Sponsor (existing ACTA member)", 120]
};

export const fullName = a => [a.firstName, a.nickname ? `“${a.nickname}”` : "", a.middleName, a.lastName].filter(Boolean).join(" ") || a.fullName || "";
export const address = a => [a.street, a.barangay, a.city, a.province, a.zip].filter(Boolean).join(", ") || a.address || "";

export function age(dob) {
  if (!dob) return "";
  const d = new Date(dob), n = new Date();
  if (isNaN(d)) return "";
  let y = n.getFullYear() - d.getFullYear();
  if (n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) y--;
  return y >= 0 && y < 130 ? String(y) : "";
}

// Load an image file. Transparent areas are later filled with white.
function loadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) return reject(new Error("Please choose a photo (JPG or PNG)."));
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That photo couldn't be read. Try a JPG or PNG.")); };
    img.src = url;
  });
}
function toJpeg(c) {
  let q = 0.85, out = c.toDataURL("image/jpeg", q);
  while (out.length > 150000 && q > 0.4) { q -= 0.1; out = c.toDataURL("image/jpeg", q); }
  return out;
}

// Quick square crop (no editor). Kept for compatibility.
export async function shrinkPhoto(file, size = 360) {
  const img = await loadImage(file), s = Math.min(img.width, img.height), c = document.createElement("canvas");
  c.width = c.height = size;
  const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, size, size);
  x.drawImage(img, (img.width - s) / 2, Math.max(0, (img.height - s) * 0.2), s, s, 0, 0, size, size);
  return toJpeg(c);
}

// Crop editor: the user zooms and drags the photo inside a frame (e.g. half-body ID photo).
// Returns a JPEG data URL with a white background, or null if cancelled.
export async function cropPhoto(file, { width = 320, height = 400, title = "Adjust photo", hint = "Zoom and drag so the frame shows head and shoulders (half-body), like an ID photo." } = {}) {
  const img = await loadImage(file);
  if (!document.getElementById("crop-style")) {
    const st = document.createElement("style"); st.id = "crop-style";
    st.textContent = `.crop-dlg{border:0;border-radius:10px;padding:0;width:min(420px,94vw);box-shadow:0 20px 50px rgba(0,0,0,.4)}.crop-dlg::backdrop{background:rgba(3,12,28,.7)}
.crop-dlg .in{padding:22px}.crop-dlg h3{font-family:"Barlow Condensed",sans-serif;font-size:26px;margin:0 0 4px;color:#0b1d3a}.crop-dlg p{font-size:13px;color:#4e5d73;margin:0 0 14px;line-height:1.5}
.crop-frame{position:relative;margin:0 auto;overflow:hidden;background:#fff;border-radius:6px;touch-action:none;cursor:grab;box-shadow:0 0 0 2px #e8b92e}
.crop-frame canvas{display:block}.crop-guide{position:absolute;left:50%;top:10%;width:46%;height:52%;transform:translateX(-50%);border:2px dashed rgba(39,86,163,.55);border-radius:50% 50% 45% 45%;pointer-events:none}
.crop-zoom{display:flex;align-items:center;gap:10px;margin:14px 0 4px;font-size:13px;color:#31445f}.crop-zoom input{flex:1}
.crop-btns{display:flex;justify-content:flex-end;gap:10px;margin-top:16px}`;
    document.head.appendChild(st);
  }
  const fw = Math.min(300, window.innerWidth - 90), fh = Math.round(fw * height / width);
  const d = document.createElement("dialog"); d.className = "crop-dlg";
  d.innerHTML = `<div class="in"><h3>${title}</h3><p>${hint}</p>
    <div class="crop-frame" style="width:${fw}px;height:${fh}px"><canvas width="${fw * 2}" height="${fh * 2}" style="width:${fw}px;height:${fh}px"></canvas><div class="crop-guide"></div></div>
    <div class="crop-zoom"><span>Zoom</span><input type="range" min="1" max="4" step="0.01" value="1"></div>
    <p style="margin:0">Drag the photo to move it. Transparent backgrounds become white.</p>
    <div class="crop-btns"><button type="button" class="btn line small" data-x="cancel">Cancel</button><button type="button" class="btn primary small" data-x="ok">Use photo</button></div></div>`;
  document.body.appendChild(d);
  const cv = d.querySelector("canvas"), ctx = cv.getContext("2d"), zoom = d.querySelector("input[type=range]");
  const base = Math.max(cv.width / img.width, cv.height / img.height);
  let z = 1, ox = 0, oy = 0;
  // Start zoomed on the upper part of tall photos (where the face usually is).
  if (img.height / img.width > height / width * 1.15) { z = 1.6; zoom.value = z; }
  function clamp() {
    const s = base * z, w = img.width * s, h = img.height * s;
    ox = Math.min(0, Math.max(cv.width - w, ox)); oy = Math.min(0, Math.max(cv.height - h, oy));
  }
  function center(top) { const s = base * z; ox = (cv.width - img.width * s) / 2; oy = top ? 0 : (cv.height - img.height * s) / 2; clamp(); }
  function draw() { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height); const s = base * z; ctx.drawImage(img, ox, oy, img.width * s, img.height * s); }
  center(z > 1); draw();
  zoom.oninput = () => {
    const cx = cv.width / 2, cy = cv.height / 2, s0 = base * z;
    const ix = (cx - ox) / s0, iy = (cy - oy) / s0;
    z = +zoom.value; const s1 = base * z; ox = cx - ix * s1; oy = cy - iy * s1; clamp(); draw();
  };
  let drag = null;
  const frame = d.querySelector(".crop-frame"), ratio = cv.width / fw;
  frame.addEventListener("pointerdown", e => { drag = { x: e.clientX, y: e.clientY, ox, oy }; frame.setPointerCapture(e.pointerId); frame.style.cursor = "grabbing"; });
  frame.addEventListener("pointermove", e => { if (!drag) return; ox = drag.ox + (e.clientX - drag.x) * ratio; oy = drag.oy + (e.clientY - drag.y) * ratio; clamp(); draw(); });
  frame.addEventListener("pointerup", () => { drag = null; frame.style.cursor = "grab"; });
  frame.addEventListener("wheel", e => { e.preventDefault(); zoom.value = Math.min(4, Math.max(1, z - e.deltaY * 0.002)); zoom.oninput(); }, { passive: false });
  d.showModal();
  return new Promise(resolve => {
    const done = v => { d.close(); d.remove(); resolve(v); };
    d.addEventListener("cancel", e => { e.preventDefault(); done(null); });
    d.querySelector("[data-x=cancel]").onclick = () => done(null);
    d.querySelector("[data-x=ok]").onclick = () => {
      const out = document.createElement("canvas"); out.width = width; out.height = height;
      const o = out.getContext("2d"), k = width / cv.width, s = base * z * k;
      o.fillStyle = "#fff"; o.fillRect(0, 0, width, height);
      o.drawImage(img, ox * k, oy * k, img.width * s, img.height * s);
      done(toJpeg(out));
    };
  });
}

export const APP_STATUS = {
  new: ["New", ""], contacted: ["Contacted", "muted"], endorsed: ["Endorsed by Coordinator", "warn"],
  approved: ["Approved by Founder", "ok"], declined: ["Declined", "bad"]
};
