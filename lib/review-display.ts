// Public review display helpers — privacy-first.
// NEVER render reviewer emails on public pages. Names are masked to
// first name + last initial (e.g. "John M."), countries to flag emoji.

const COUNTRY_TO_ISO: Record<string, string> = {
  "Afghanistan": "AF", "Albania": "AL", "Algeria": "DZ", "Andorra": "AD", "Angola": "AO",
  "Argentina": "AR", "Armenia": "AM", "Australia": "AU", "Austria": "AT", "Azerbaijan": "AZ",
  "Bahamas": "BS", "Bahrain": "BH", "Bangladesh": "BD", "Barbados": "BB", "Belarus": "BY",
  "Belgium": "BE", "Belize": "BZ", "Benin": "BJ", "Bhutan": "BT", "Bolivia": "BO",
  "Bosnia and Herzegovina": "BA", "Botswana": "BW", "Brazil": "BR", "Brunei": "BN",
  "Bulgaria": "BG", "Burkina Faso": "BF", "Burundi": "BI", "Cambodia": "KH", "Cameroon": "CM",
  "Canada": "CA", "Cape Verde": "CV", "Central African Republic": "CF", "Chad": "TD",
  "Chile": "CL", "China": "CN", "Colombia": "CO", "Comoros": "KM", "Congo": "CG",
  "Costa Rica": "CR", "Croatia": "HR", "Cuba": "CU", "Cyprus": "CY", "Czech Republic": "CZ",
  "Denmark": "DK", "Djibouti": "DJ", "Dominica": "DM", "Dominican Republic": "DO",
  "Ecuador": "EC", "Egypt": "EG", "El Salvador": "SV", "Equatorial Guinea": "GQ",
  "Eritrea": "ER", "Estonia": "EE", "Eswatini": "SZ", "Ethiopia": "ET", "Fiji": "FJ",
  "Finland": "FI", "France": "FR", "Gabon": "GA", "Gambia": "GM", "Georgia": "GE",
  "Germany": "DE", "Ghana": "GH", "Greece": "GR", "Grenada": "GD", "Guatemala": "GT",
  "Guinea": "GN", "Guinea-Bissau": "GW", "Guyana": "GY", "Haiti": "HT", "Honduras": "HN",
  "Hungary": "HU", "Iceland": "IS", "India": "IN", "Indonesia": "ID", "Iran": "IR",
  "Iraq": "IQ", "Ireland": "IE", "Israel": "IL", "Italy": "IT", "Ivory Coast": "CI",
  "Jamaica": "JM", "Japan": "JP", "Jordan": "JO", "Kazakhstan": "KZ", "Kenya": "KE",
  "Kiribati": "KI", "Kosovo": "XK", "Kuwait": "KW", "Kyrgyzstan": "KG", "Laos": "LA",
  "Latvia": "LV", "Lebanon": "LB", "Lesotho": "LS", "Liberia": "LR", "Libya": "LY",
  "Liechtenstein": "LI", "Lithuania": "LT", "Luxembourg": "LU", "Madagascar": "MG",
  "Malawi": "MW", "Malaysia": "MY", "Maldives": "MV", "Mali": "ML", "Malta": "MT",
  "Marshall Islands": "MH", "Mauritania": "MR", "Mauritius": "MU", "Mexico": "MX",
  "Micronesia": "FM", "Moldova": "MD", "Monaco": "MC", "Mongolia": "MN", "Montenegro": "ME",
  "Morocco": "MA", "Mozambique": "MZ", "Myanmar": "MM", "Namibia": "NA", "Nauru": "NR",
  "Nepal": "NP", "Netherlands": "NL", "New Zealand": "NZ", "Nicaragua": "NI", "Niger": "NE",
  "Nigeria": "NG", "North Korea": "KP", "North Macedonia": "MK", "Norway": "NO", "Oman": "OM",
  "Pakistan": "PK", "Palau": "PW", "Palestine": "PS", "Panama": "PA", "Papua New Guinea": "PG",
  "Paraguay": "PY", "Peru": "PE", "Philippines": "PH", "Poland": "PL", "Portugal": "PT",
  "Qatar": "QA", "Romania": "RO", "Russia": "RU", "Rwanda": "RW", "Saint Kitts and Nevis": "KN",
  "Saint Lucia": "LC", "Saint Vincent and the Grenadines": "VC", "Samoa": "WS", "San Marino": "SM",
  "Saudi Arabia": "SA", "Senegal": "SN", "Serbia": "RS", "Seychelles": "SC", "Sierra Leone": "SL",
  "Singapore": "SG", "Slovakia": "SK", "Slovenia": "SI", "Solomon Islands": "SB", "Somalia": "SO",
  "South Africa": "ZA", "South Korea": "KR", "South Sudan": "SS", "Spain": "ES", "Sri Lanka": "LK",
  "Sudan": "SD", "Suriname": "SR", "Sweden": "SE", "Switzerland": "CH", "Syria": "SY",
  "Taiwan": "TW", "Tajikistan": "TJ", "Tanzania": "TZ", "Thailand": "TH", "Togo": "TG",
  "Tonga": "TO", "Trinidad and Tobago": "TT", "Tunisia": "TN", "Turkey": "TR", "Turkmenistan": "TM",
  "Tuvalu": "TV", "Uganda": "UG", "Ukraine": "UA", "United Arab Emirates": "AE",
  "United Kingdom": "GB", "United States": "US", "Uruguay": "UY", "Uzbekistan": "UZ",
  "Vanuatu": "VU", "Vatican City": "VA", "Venezuela": "VE", "Vietnam": "VN", "Yemen": "YE",
  "Zambia": "ZM", "Zimbabwe": "ZW",
};

/** "John Michael Doe" -> "John D." ; "Madonna" -> "Madonna" */
export function maskName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Guest";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

/** "United Kingdom" -> "🇬🇧" ; unknown -> "" */
export function countryFlag(country: string | null | undefined): string {
  if (!country) return "";
  const iso = COUNTRY_TO_ISO[country.trim()];
  if (!iso) return "";
  return String.fromCodePoint.apply(null, iso.split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/** "United Kingdom" -> "🇬🇧 United Kingdom" */
export function countryWithFlag(country: string | null | undefined): string {
  if (!country) return "";
  const flag = countryFlag(country);
  return flag ? `${flag} ${country}` : country;
}

/** 5 -> "★★★★★" */
export function starString(rating: number): string {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(r) + "☆".repeat(5 - r);
}
