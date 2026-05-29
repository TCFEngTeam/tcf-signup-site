// Country phone codes from https://gist.github.com/gugazimmermann/635dac160396fc9b5e5d75d1b03c1194
export type PhoneCountryEntry = {
  isoCode: string
  name: string
  dialCode: string
}

export const DEFAULT_PHONE_COUNTRY_ISO = 'US'

export const PHONE_COUNTRIES: PhoneCountryEntry[] = [
  {
    "isoCode": "US",
    "name": "United States",
    "dialCode": "1"
  },
  {
    "isoCode": "AF",
    "name": "Afghanistan",
    "dialCode": "93"
  },
  {
    "isoCode": "AX",
    "name": "Aland Islands",
    "dialCode": "358"
  },
  {
    "isoCode": "AL",
    "name": "Albania",
    "dialCode": "355"
  },
  {
    "isoCode": "DZ",
    "name": "Algeria",
    "dialCode": "213"
  },
  {
    "isoCode": "AS",
    "name": "AmericanSamoa",
    "dialCode": "1684"
  },
  {
    "isoCode": "AD",
    "name": "Andorra",
    "dialCode": "376"
  },
  {
    "isoCode": "AO",
    "name": "Angola",
    "dialCode": "244"
  },
  {
    "isoCode": "AI",
    "name": "Anguilla",
    "dialCode": "1264"
  },
  {
    "isoCode": "AQ",
    "name": "Antarctica",
    "dialCode": "672"
  },
  {
    "isoCode": "AG",
    "name": "Antigua and Barbuda",
    "dialCode": "1268"
  },
  {
    "isoCode": "AR",
    "name": "Argentina",
    "dialCode": "54"
  },
  {
    "isoCode": "AM",
    "name": "Armenia",
    "dialCode": "374"
  },
  {
    "isoCode": "AW",
    "name": "Aruba",
    "dialCode": "297"
  },
  {
    "isoCode": "AU",
    "name": "Australia",
    "dialCode": "61"
  },
  {
    "isoCode": "AT",
    "name": "Austria",
    "dialCode": "43"
  },
  {
    "isoCode": "AZ",
    "name": "Azerbaijan",
    "dialCode": "994"
  },
  {
    "isoCode": "BS",
    "name": "Bahamas",
    "dialCode": "1242"
  },
  {
    "isoCode": "BH",
    "name": "Bahrain",
    "dialCode": "973"
  },
  {
    "isoCode": "BD",
    "name": "Bangladesh",
    "dialCode": "880"
  },
  {
    "isoCode": "BB",
    "name": "Barbados",
    "dialCode": "1246"
  },
  {
    "isoCode": "BY",
    "name": "Belarus",
    "dialCode": "375"
  },
  {
    "isoCode": "BE",
    "name": "Belgium",
    "dialCode": "32"
  },
  {
    "isoCode": "BZ",
    "name": "Belize",
    "dialCode": "501"
  },
  {
    "isoCode": "BJ",
    "name": "Benin",
    "dialCode": "229"
  },
  {
    "isoCode": "BM",
    "name": "Bermuda",
    "dialCode": "1441"
  },
  {
    "isoCode": "BT",
    "name": "Bhutan",
    "dialCode": "975"
  },
  {
    "isoCode": "BO",
    "name": "Bolivia, Plurinational State of",
    "dialCode": "591"
  },
  {
    "isoCode": "BA",
    "name": "Bosnia and Herzegovina",
    "dialCode": "387"
  },
  {
    "isoCode": "BW",
    "name": "Botswana",
    "dialCode": "267"
  },
  {
    "isoCode": "BR",
    "name": "Brazil",
    "dialCode": "55"
  },
  {
    "isoCode": "IO",
    "name": "British Indian Ocean Territory",
    "dialCode": "246"
  },
  {
    "isoCode": "BN",
    "name": "Brunei Darussalam",
    "dialCode": "673"
  },
  {
    "isoCode": "BG",
    "name": "Bulgaria",
    "dialCode": "359"
  },
  {
    "isoCode": "BF",
    "name": "Burkina Faso",
    "dialCode": "226"
  },
  {
    "isoCode": "BI",
    "name": "Burundi",
    "dialCode": "257"
  },
  {
    "isoCode": "KH",
    "name": "Cambodia",
    "dialCode": "855"
  },
  {
    "isoCode": "CM",
    "name": "Cameroon",
    "dialCode": "237"
  },
  {
    "isoCode": "CA",
    "name": "Canada",
    "dialCode": "1"
  },
  {
    "isoCode": "CV",
    "name": "Cape Verde",
    "dialCode": "238"
  },
  {
    "isoCode": "KY",
    "name": "Cayman Islands",
    "dialCode": "345"
  },
  {
    "isoCode": "CF",
    "name": "Central African Republic",
    "dialCode": "236"
  },
  {
    "isoCode": "TD",
    "name": "Chad",
    "dialCode": "235"
  },
  {
    "isoCode": "CL",
    "name": "Chile",
    "dialCode": "56"
  },
  {
    "isoCode": "CN",
    "name": "China",
    "dialCode": "86"
  },
  {
    "isoCode": "CX",
    "name": "Christmas Island",
    "dialCode": "61"
  },
  {
    "isoCode": "CC",
    "name": "Cocos (Keeling) Islands",
    "dialCode": "61"
  },
  {
    "isoCode": "CO",
    "name": "Colombia",
    "dialCode": "57"
  },
  {
    "isoCode": "KM",
    "name": "Comoros",
    "dialCode": "269"
  },
  {
    "isoCode": "CG",
    "name": "Congo",
    "dialCode": "242"
  },
  {
    "isoCode": "CD",
    "name": "Congo, The Democratic Republic of the Congo",
    "dialCode": "243"
  },
  {
    "isoCode": "CK",
    "name": "Cook Islands",
    "dialCode": "682"
  },
  {
    "isoCode": "CR",
    "name": "Costa Rica",
    "dialCode": "506"
  },
  {
    "isoCode": "CI",
    "name": "Cote d'Ivoire",
    "dialCode": "225"
  },
  {
    "isoCode": "HR",
    "name": "Croatia",
    "dialCode": "385"
  },
  {
    "isoCode": "CU",
    "name": "Cuba",
    "dialCode": "53"
  },
  {
    "isoCode": "CY",
    "name": "Cyprus",
    "dialCode": "357"
  },
  {
    "isoCode": "CZ",
    "name": "Czech Republic",
    "dialCode": "420"
  },
  {
    "isoCode": "DK",
    "name": "Denmark",
    "dialCode": "45"
  },
  {
    "isoCode": "DJ",
    "name": "Djibouti",
    "dialCode": "253"
  },
  {
    "isoCode": "DM",
    "name": "Dominica",
    "dialCode": "1767"
  },
  {
    "isoCode": "DO",
    "name": "Dominican Republic",
    "dialCode": "1849"
  },
  {
    "isoCode": "EC",
    "name": "Ecuador",
    "dialCode": "593"
  },
  {
    "isoCode": "EG",
    "name": "Egypt",
    "dialCode": "20"
  },
  {
    "isoCode": "SV",
    "name": "El Salvador",
    "dialCode": "503"
  },
  {
    "isoCode": "GQ",
    "name": "Equatorial Guinea",
    "dialCode": "240"
  },
  {
    "isoCode": "ER",
    "name": "Eritrea",
    "dialCode": "291"
  },
  {
    "isoCode": "EE",
    "name": "Estonia",
    "dialCode": "372"
  },
  {
    "isoCode": "ET",
    "name": "Ethiopia",
    "dialCode": "251"
  },
  {
    "isoCode": "FK",
    "name": "Falkland Islands (Malvinas)",
    "dialCode": "500"
  },
  {
    "isoCode": "FO",
    "name": "Faroe Islands",
    "dialCode": "298"
  },
  {
    "isoCode": "FJ",
    "name": "Fiji",
    "dialCode": "679"
  },
  {
    "isoCode": "FI",
    "name": "Finland",
    "dialCode": "358"
  },
  {
    "isoCode": "FR",
    "name": "France",
    "dialCode": "33"
  },
  {
    "isoCode": "GF",
    "name": "French Guiana",
    "dialCode": "594"
  },
  {
    "isoCode": "PF",
    "name": "French Polynesia",
    "dialCode": "689"
  },
  {
    "isoCode": "GA",
    "name": "Gabon",
    "dialCode": "241"
  },
  {
    "isoCode": "GM",
    "name": "Gambia",
    "dialCode": "220"
  },
  {
    "isoCode": "GE",
    "name": "Georgia",
    "dialCode": "995"
  },
  {
    "isoCode": "DE",
    "name": "Germany",
    "dialCode": "49"
  },
  {
    "isoCode": "GH",
    "name": "Ghana",
    "dialCode": "233"
  },
  {
    "isoCode": "GI",
    "name": "Gibraltar",
    "dialCode": "350"
  },
  {
    "isoCode": "GR",
    "name": "Greece",
    "dialCode": "30"
  },
  {
    "isoCode": "GL",
    "name": "Greenland",
    "dialCode": "299"
  },
  {
    "isoCode": "GD",
    "name": "Grenada",
    "dialCode": "1473"
  },
  {
    "isoCode": "GP",
    "name": "Guadeloupe",
    "dialCode": "590"
  },
  {
    "isoCode": "GU",
    "name": "Guam",
    "dialCode": "1671"
  },
  {
    "isoCode": "GT",
    "name": "Guatemala",
    "dialCode": "502"
  },
  {
    "isoCode": "GG",
    "name": "Guernsey",
    "dialCode": "44"
  },
  {
    "isoCode": "GN",
    "name": "Guinea",
    "dialCode": "224"
  },
  {
    "isoCode": "GW",
    "name": "Guinea-Bissau",
    "dialCode": "245"
  },
  {
    "isoCode": "GY",
    "name": "Guyana",
    "dialCode": "595"
  },
  {
    "isoCode": "HT",
    "name": "Haiti",
    "dialCode": "509"
  },
  {
    "isoCode": "VA",
    "name": "Holy See (Vatican City State)",
    "dialCode": "379"
  },
  {
    "isoCode": "HN",
    "name": "Honduras",
    "dialCode": "504"
  },
  {
    "isoCode": "HK",
    "name": "Hong Kong",
    "dialCode": "852"
  },
  {
    "isoCode": "HU",
    "name": "Hungary",
    "dialCode": "36"
  },
  {
    "isoCode": "IS",
    "name": "Iceland",
    "dialCode": "354"
  },
  {
    "isoCode": "IN",
    "name": "India",
    "dialCode": "91"
  },
  {
    "isoCode": "ID",
    "name": "Indonesia",
    "dialCode": "62"
  },
  {
    "isoCode": "IR",
    "name": "Iran, Islamic Republic of Persian Gulf",
    "dialCode": "98"
  },
  {
    "isoCode": "IQ",
    "name": "Iraq",
    "dialCode": "964"
  },
  {
    "isoCode": "IE",
    "name": "Ireland",
    "dialCode": "353"
  },
  {
    "isoCode": "IM",
    "name": "Isle of Man",
    "dialCode": "44"
  },
  {
    "isoCode": "IL",
    "name": "Israel",
    "dialCode": "972"
  },
  {
    "isoCode": "IT",
    "name": "Italy",
    "dialCode": "39"
  },
  {
    "isoCode": "JM",
    "name": "Jamaica",
    "dialCode": "1876"
  },
  {
    "isoCode": "JP",
    "name": "Japan",
    "dialCode": "81"
  },
  {
    "isoCode": "JE",
    "name": "Jersey",
    "dialCode": "44"
  },
  {
    "isoCode": "JO",
    "name": "Jordan",
    "dialCode": "962"
  },
  {
    "isoCode": "KZ",
    "name": "Kazakhstan",
    "dialCode": "77"
  },
  {
    "isoCode": "KE",
    "name": "Kenya",
    "dialCode": "254"
  },
  {
    "isoCode": "KI",
    "name": "Kiribati",
    "dialCode": "686"
  },
  {
    "isoCode": "KP",
    "name": "Korea, Democratic People's Republic of Korea",
    "dialCode": "850"
  },
  {
    "isoCode": "KR",
    "name": "Korea, Republic of South Korea",
    "dialCode": "82"
  },
  {
    "isoCode": "KW",
    "name": "Kuwait",
    "dialCode": "965"
  },
  {
    "isoCode": "KG",
    "name": "Kyrgyzstan",
    "dialCode": "996"
  },
  {
    "isoCode": "LA",
    "name": "Laos",
    "dialCode": "856"
  },
  {
    "isoCode": "LV",
    "name": "Latvia",
    "dialCode": "371"
  },
  {
    "isoCode": "LB",
    "name": "Lebanon",
    "dialCode": "961"
  },
  {
    "isoCode": "LS",
    "name": "Lesotho",
    "dialCode": "266"
  },
  {
    "isoCode": "LR",
    "name": "Liberia",
    "dialCode": "231"
  },
  {
    "isoCode": "LY",
    "name": "Libyan Arab Jamahiriya",
    "dialCode": "218"
  },
  {
    "isoCode": "LI",
    "name": "Liechtenstein",
    "dialCode": "423"
  },
  {
    "isoCode": "LT",
    "name": "Lithuania",
    "dialCode": "370"
  },
  {
    "isoCode": "LU",
    "name": "Luxembourg",
    "dialCode": "352"
  },
  {
    "isoCode": "MO",
    "name": "Macao",
    "dialCode": "853"
  },
  {
    "isoCode": "MK",
    "name": "Macedonia",
    "dialCode": "389"
  },
  {
    "isoCode": "MG",
    "name": "Madagascar",
    "dialCode": "261"
  },
  {
    "isoCode": "MW",
    "name": "Malawi",
    "dialCode": "265"
  },
  {
    "isoCode": "MY",
    "name": "Malaysia",
    "dialCode": "60"
  },
  {
    "isoCode": "MV",
    "name": "Maldives",
    "dialCode": "960"
  },
  {
    "isoCode": "ML",
    "name": "Mali",
    "dialCode": "223"
  },
  {
    "isoCode": "MT",
    "name": "Malta",
    "dialCode": "356"
  },
  {
    "isoCode": "MH",
    "name": "Marshall Islands",
    "dialCode": "692"
  },
  {
    "isoCode": "MQ",
    "name": "Martinique",
    "dialCode": "596"
  },
  {
    "isoCode": "MR",
    "name": "Mauritania",
    "dialCode": "222"
  },
  {
    "isoCode": "MU",
    "name": "Mauritius",
    "dialCode": "230"
  },
  {
    "isoCode": "YT",
    "name": "Mayotte",
    "dialCode": "262"
  },
  {
    "isoCode": "MX",
    "name": "Mexico",
    "dialCode": "52"
  },
  {
    "isoCode": "FM",
    "name": "Micronesia, Federated States of Micronesia",
    "dialCode": "691"
  },
  {
    "isoCode": "MD",
    "name": "Moldova",
    "dialCode": "373"
  },
  {
    "isoCode": "MC",
    "name": "Monaco",
    "dialCode": "377"
  },
  {
    "isoCode": "MN",
    "name": "Mongolia",
    "dialCode": "976"
  },
  {
    "isoCode": "ME",
    "name": "Montenegro",
    "dialCode": "382"
  },
  {
    "isoCode": "MS",
    "name": "Montserrat",
    "dialCode": "1664"
  },
  {
    "isoCode": "MA",
    "name": "Morocco",
    "dialCode": "212"
  },
  {
    "isoCode": "MZ",
    "name": "Mozambique",
    "dialCode": "258"
  },
  {
    "isoCode": "MM",
    "name": "Myanmar",
    "dialCode": "95"
  },
  {
    "isoCode": "NA",
    "name": "Namibia",
    "dialCode": "264"
  },
  {
    "isoCode": "NR",
    "name": "Nauru",
    "dialCode": "674"
  },
  {
    "isoCode": "NP",
    "name": "Nepal",
    "dialCode": "977"
  },
  {
    "isoCode": "NL",
    "name": "Netherlands",
    "dialCode": "31"
  },
  {
    "isoCode": "AN",
    "name": "Netherlands Antilles",
    "dialCode": "599"
  },
  {
    "isoCode": "NC",
    "name": "New Caledonia",
    "dialCode": "687"
  },
  {
    "isoCode": "NZ",
    "name": "New Zealand",
    "dialCode": "64"
  },
  {
    "isoCode": "NI",
    "name": "Nicaragua",
    "dialCode": "505"
  },
  {
    "isoCode": "NE",
    "name": "Niger",
    "dialCode": "227"
  },
  {
    "isoCode": "NG",
    "name": "Nigeria",
    "dialCode": "234"
  },
  {
    "isoCode": "NU",
    "name": "Niue",
    "dialCode": "683"
  },
  {
    "isoCode": "NF",
    "name": "Norfolk Island",
    "dialCode": "672"
  },
  {
    "isoCode": "MP",
    "name": "Northern Mariana Islands",
    "dialCode": "1670"
  },
  {
    "isoCode": "NO",
    "name": "Norway",
    "dialCode": "47"
  },
  {
    "isoCode": "OM",
    "name": "Oman",
    "dialCode": "968"
  },
  {
    "isoCode": "PK",
    "name": "Pakistan",
    "dialCode": "92"
  },
  {
    "isoCode": "PW",
    "name": "Palau",
    "dialCode": "680"
  },
  {
    "isoCode": "PS",
    "name": "Palestinian Territory, Occupied",
    "dialCode": "970"
  },
  {
    "isoCode": "PA",
    "name": "Panama",
    "dialCode": "507"
  },
  {
    "isoCode": "PG",
    "name": "Papua New Guinea",
    "dialCode": "675"
  },
  {
    "isoCode": "PY",
    "name": "Paraguay",
    "dialCode": "595"
  },
  {
    "isoCode": "PE",
    "name": "Peru",
    "dialCode": "51"
  },
  {
    "isoCode": "PH",
    "name": "Philippines",
    "dialCode": "63"
  },
  {
    "isoCode": "PN",
    "name": "Pitcairn",
    "dialCode": "872"
  },
  {
    "isoCode": "PL",
    "name": "Poland",
    "dialCode": "48"
  },
  {
    "isoCode": "PT",
    "name": "Portugal",
    "dialCode": "351"
  },
  {
    "isoCode": "PR",
    "name": "Puerto Rico",
    "dialCode": "1939"
  },
  {
    "isoCode": "QA",
    "name": "Qatar",
    "dialCode": "974"
  },
  {
    "isoCode": "RE",
    "name": "Reunion",
    "dialCode": "262"
  },
  {
    "isoCode": "RO",
    "name": "Romania",
    "dialCode": "40"
  },
  {
    "isoCode": "RU",
    "name": "Russia",
    "dialCode": "7"
  },
  {
    "isoCode": "RW",
    "name": "Rwanda",
    "dialCode": "250"
  },
  {
    "isoCode": "BL",
    "name": "Saint Barthelemy",
    "dialCode": "590"
  },
  {
    "isoCode": "SH",
    "name": "Saint Helena, Ascension and Tristan Da Cunha",
    "dialCode": "290"
  },
  {
    "isoCode": "KN",
    "name": "Saint Kitts and Nevis",
    "dialCode": "1869"
  },
  {
    "isoCode": "LC",
    "name": "Saint Lucia",
    "dialCode": "1758"
  },
  {
    "isoCode": "MF",
    "name": "Saint Martin",
    "dialCode": "590"
  },
  {
    "isoCode": "PM",
    "name": "Saint Pierre and Miquelon",
    "dialCode": "508"
  },
  {
    "isoCode": "VC",
    "name": "Saint Vincent and the Grenadines",
    "dialCode": "1784"
  },
  {
    "isoCode": "WS",
    "name": "Samoa",
    "dialCode": "685"
  },
  {
    "isoCode": "SM",
    "name": "San Marino",
    "dialCode": "378"
  },
  {
    "isoCode": "ST",
    "name": "Sao Tome and Principe",
    "dialCode": "239"
  },
  {
    "isoCode": "SA",
    "name": "Saudi Arabia",
    "dialCode": "966"
  },
  {
    "isoCode": "SN",
    "name": "Senegal",
    "dialCode": "221"
  },
  {
    "isoCode": "RS",
    "name": "Serbia",
    "dialCode": "381"
  },
  {
    "isoCode": "SC",
    "name": "Seychelles",
    "dialCode": "248"
  },
  {
    "isoCode": "SL",
    "name": "Sierra Leone",
    "dialCode": "232"
  },
  {
    "isoCode": "SG",
    "name": "Singapore",
    "dialCode": "65"
  },
  {
    "isoCode": "SK",
    "name": "Slovakia",
    "dialCode": "421"
  },
  {
    "isoCode": "SI",
    "name": "Slovenia",
    "dialCode": "386"
  },
  {
    "isoCode": "SB",
    "name": "Solomon Islands",
    "dialCode": "677"
  },
  {
    "isoCode": "SO",
    "name": "Somalia",
    "dialCode": "252"
  },
  {
    "isoCode": "ZA",
    "name": "South Africa",
    "dialCode": "27"
  },
  {
    "isoCode": "GS",
    "name": "South Georgia and the South Sandwich Islands",
    "dialCode": "500"
  },
  {
    "isoCode": "SS",
    "name": "South Sudan",
    "dialCode": "211"
  },
  {
    "isoCode": "ES",
    "name": "Spain",
    "dialCode": "34"
  },
  {
    "isoCode": "LK",
    "name": "Sri Lanka",
    "dialCode": "94"
  },
  {
    "isoCode": "SD",
    "name": "Sudan",
    "dialCode": "249"
  },
  {
    "isoCode": "SR",
    "name": "Suriname",
    "dialCode": "597"
  },
  {
    "isoCode": "SJ",
    "name": "Svalbard and Jan Mayen",
    "dialCode": "47"
  },
  {
    "isoCode": "SZ",
    "name": "Swaziland",
    "dialCode": "268"
  },
  {
    "isoCode": "SE",
    "name": "Sweden",
    "dialCode": "46"
  },
  {
    "isoCode": "CH",
    "name": "Switzerland",
    "dialCode": "41"
  },
  {
    "isoCode": "SY",
    "name": "Syrian Arab Republic",
    "dialCode": "963"
  },
  {
    "isoCode": "TW",
    "name": "Taiwan",
    "dialCode": "886"
  },
  {
    "isoCode": "TJ",
    "name": "Tajikistan",
    "dialCode": "992"
  },
  {
    "isoCode": "TZ",
    "name": "Tanzania, United Republic of Tanzania",
    "dialCode": "255"
  },
  {
    "isoCode": "TH",
    "name": "Thailand",
    "dialCode": "66"
  },
  {
    "isoCode": "TL",
    "name": "Timor-Leste",
    "dialCode": "670"
  },
  {
    "isoCode": "TG",
    "name": "Togo",
    "dialCode": "228"
  },
  {
    "isoCode": "TK",
    "name": "Tokelau",
    "dialCode": "690"
  },
  {
    "isoCode": "TO",
    "name": "Tonga",
    "dialCode": "676"
  },
  {
    "isoCode": "TT",
    "name": "Trinidad and Tobago",
    "dialCode": "1868"
  },
  {
    "isoCode": "TN",
    "name": "Tunisia",
    "dialCode": "216"
  },
  {
    "isoCode": "TR",
    "name": "Turkey",
    "dialCode": "90"
  },
  {
    "isoCode": "TM",
    "name": "Turkmenistan",
    "dialCode": "993"
  },
  {
    "isoCode": "TC",
    "name": "Turks and Caicos Islands",
    "dialCode": "1649"
  },
  {
    "isoCode": "TV",
    "name": "Tuvalu",
    "dialCode": "688"
  },
  {
    "isoCode": "UG",
    "name": "Uganda",
    "dialCode": "256"
  },
  {
    "isoCode": "UA",
    "name": "Ukraine",
    "dialCode": "380"
  },
  {
    "isoCode": "AE",
    "name": "United Arab Emirates",
    "dialCode": "971"
  },
  {
    "isoCode": "GB",
    "name": "United Kingdom",
    "dialCode": "44"
  },
  {
    "isoCode": "UY",
    "name": "Uruguay",
    "dialCode": "598"
  },
  {
    "isoCode": "UZ",
    "name": "Uzbekistan",
    "dialCode": "998"
  },
  {
    "isoCode": "VU",
    "name": "Vanuatu",
    "dialCode": "678"
  },
  {
    "isoCode": "VE",
    "name": "Venezuela, Bolivarian Republic of Venezuela",
    "dialCode": "58"
  },
  {
    "isoCode": "VN",
    "name": "Vietnam",
    "dialCode": "84"
  },
  {
    "isoCode": "VG",
    "name": "Virgin Islands, British",
    "dialCode": "1284"
  },
  {
    "isoCode": "VI",
    "name": "Virgin Islands, U.S.",
    "dialCode": "1340"
  },
  {
    "isoCode": "WF",
    "name": "Wallis and Futuna",
    "dialCode": "681"
  },
  {
    "isoCode": "YE",
    "name": "Yemen",
    "dialCode": "967"
  },
  {
    "isoCode": "ZM",
    "name": "Zambia",
    "dialCode": "260"
  },
  {
    "isoCode": "ZW",
    "name": "Zimbabwe",
    "dialCode": "263"
  }
]

const byIso = new Map(PHONE_COUNTRIES.map((country) => [country.isoCode, country]))

export function getPhoneCountryByIso(isoCode: string): PhoneCountryEntry | undefined {
  return byIso.get(isoCode)
}

export function getDialCodeFromIso(isoCode: string): string {
  return getPhoneCountryByIso(isoCode)?.dialCode ?? '1'
}

export function findPhoneCountryByDialCode(dialCode: string): PhoneCountryEntry | undefined {
  const normalized = dialCode.replace(/^\+/, '')
  const preferredIsoByDialCode: Record<string, string> = {
    '1': 'US',
    '44': 'GB',
    '61': 'AU',
  }
  const preferredIso = preferredIsoByDialCode[normalized]
  if (preferredIso) {
    return getPhoneCountryByIso(preferredIso)
  }
  return PHONE_COUNTRIES.find((country) => country.dialCode === normalized)
}

export function getUniqueDialCodesLongestFirst(): string[] {
  return [...new Set(PHONE_COUNTRIES.map((country) => country.dialCode))].sort(
    (a, b) => b.length - a.length
  )
}
