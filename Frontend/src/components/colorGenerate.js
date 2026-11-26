function nameToNumber(name = "") {
  let hash = 0;
  const normalized = name.trim().toLowerCase();

  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }

  return Math.abs(hash);
}

export default function nameToHexColor(name = "") {
  const num = nameToNumber(name);
  const hex = (num & 0xffffff).toString(16).padStart(6, "0");
  return `#${hex}`;
}

export function getInitials(name) {

  if(name==undefined)
    return "FC"

    let parts = name.trim().split(/\s+/);

    if (!name.trim()) return "FC";

    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }

    return (
        parts[0][0] + parts[parts.length - 1][0]
    ).toUpperCase();
}

