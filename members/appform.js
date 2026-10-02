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

// Shrink a photo to a small 2x2-style JPEG (stored in the database, so no paid file storage is needed).
export function shrinkPhoto(file, size = 360) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) return reject(new Error("Please choose a photo (JPG or PNG)."));
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(img.width, img.height), c = document.createElement("canvas");
      c.width = c.height = size;
      c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      let q = 0.82, out = c.toDataURL("image/jpeg", q);
      while (out.length > 150000 && q > 0.4) { q -= 0.1; out = c.toDataURL("image/jpeg", q); }
      resolve(out);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That photo couldn't be read. Try a JPG or PNG.")); };
    img.src = url;
  });
}

export const APP_STATUS = {
  new: ["New", ""], contacted: ["Contacted", "muted"], endorsed: ["Endorsed by Coordinator", "warn"],
  approved: ["Approved by Founder", "ok"], declined: ["Declined", "bad"]
};
