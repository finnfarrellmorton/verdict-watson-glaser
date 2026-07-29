const universityPools = {
  broad: ['Oxford', 'Cambridge', 'UCL', 'LSE', "King's College London", 'Durham', 'Warwick', 'Bristol', 'Nottingham', 'Manchester', 'Leeds', 'Edinburgh', 'Exeter', 'Birmingham', 'Queen Mary', 'York'],
  city: ['Oxford', 'Cambridge', 'UCL', 'LSE', "King's College London", 'Durham', 'Warwick', 'Bristol', 'Nottingham', 'Manchester', 'Queen Mary', 'Exeter'],
  regional: ['Manchester', 'Leeds', 'Birmingham', 'Nottingham', 'Sheffield', 'Liverpool', 'Cardiff', 'Newcastle', 'Bristol', 'Exeter', 'York', 'Durham'],
  us: ['Oxford', 'Cambridge', 'UCL', 'LSE', "King's College London", 'Durham', 'Warwick', 'Bristol', 'Nottingham', 'Manchester'],
  specialist: ['Oxford', 'Cambridge', 'UCL', 'LSE', "King's College London", 'Queen Mary', 'Bristol', 'Durham', 'Warwick', 'Nottingham']
};

const seatPools = {
  global: ['Corporate/M&A', 'Banking & Finance', 'Capital Markets', 'Litigation/Arbitration', 'Competition', 'Employment', 'Real Estate', 'Tax', 'IP/Tech', 'Funds'],
  disputes: ['Commercial Litigation', 'International Arbitration', 'Competition Disputes', 'Employment', 'Insurance', 'Construction', 'Public Law/Regulatory', 'Professional Negligence'],
  us: ['M&A/Private Equity', 'Finance', 'Capital Markets', 'Funds', 'Litigation/Arbitration', 'Tax', 'Antitrust', 'Restructuring'],
  midcity: ['Corporate', 'Commercial Disputes', 'Real Estate', 'Employment', 'Private Client', 'IP/Tech', 'Tax', 'Finance'],
  regional: ['Corporate', 'Real Estate', 'Employment', 'Commercial Disputes', 'Private Client', 'Projects', 'Banking', 'Commercial/Tech']
};

const seatCategories = {
  transactional: ['Corporate/M&A', 'Corporate', 'M&A/Private Equity', 'Private Equity', 'Banking & Finance', 'Finance', 'Capital Markets', 'Funds', 'Real Estate', 'Projects'],
  contentious: ['Litigation/Arbitration', 'Commercial Litigation', 'International Arbitration', 'Competition Disputes', 'Commercial Disputes', 'Insurance', 'Construction', 'Public Law/Regulatory', 'Professional Negligence', 'Restructuring'],
  regulatory: ['Competition', 'Antitrust', 'Employment', 'Tax', 'IP/Tech', 'Commercial/Tech'],
  advisory: ['Private Client', 'Technology', 'Commercial/Tech', 'IP/Tech', 'Tax', 'Employment']
};

const firmBlueprints = [
  ['clifford-chance','Clifford Chance','Magic Circle','global',95,100,92,88,58,96,100,32,'London + global network','Very large intake, global clients, finance and corporate depth.'],
  ['linklaters','Linklaters','Magic Circle','global',95,100,92,90,56,96,100,31,'London + global network','Elite global transactions, competition, finance and capital markets.'],
  ['ao-shearman','A&O Shearman','Global elite','global',92,92,91,88,55,98,90,48,'London + global network','Cross-border finance, corporate, regulatory and US/UK platform.'],
  ['freshfields','Freshfields','Magic Circle','global',90,88,92,92,57,93,85,28,'London + global network','Premium corporate, disputes, competition and public company work.'],
  ['slaughter-and-may','Slaughter and May','Elite UK','city',91,86,90,94,62,78,80,4,'London-led best friends network','High-responsibility broad advisory model and elite corporate work.'],
  ['herbert-smith-freehills-kramer','Herbert Smith Freehills Kramer','Global disputes','global',88,78,86,90,63,88,70,26,'London + international network','Disputes, arbitration, energy, corporate and finance strength.'],
  ['hogan-lovells','Hogan Lovells','Transatlantic','global',86,72,84,86,62,89,65,45,'London + global network','Regulatory, life sciences, finance, corporate and global client work.'],
  ['white-case','White & Case','US/global','us',87,68,96,87,52,95,50,44,'London + global network','International arbitration, projects, finance and M&A intensity.'],
  ['baker-mckenzie','Baker McKenzie','Global full-service','global',82,62,80,82,66,97,40,70,'London + global network','Huge international footprint and broad commercial practice.'],
  ['norton-rose-fulbright','Norton Rose Fulbright','Global sector-led','global',82,64,78,82,65,94,45,50,'London + global network','Energy, infrastructure, transport, finance and disputes.'],
  ['dLA-piper','DLA Piper','Global full-service','global',80,66,78,80,64,96,45,90,'London + global network','Broad international platform with strong corporate, real estate and tech.'],
  ['cms','CMS','Large international','global',78,70,76,78,66,84,55,70,'London + UK/global network','Corporate, real estate, energy, technology and disputes.'],
  ['eversheds-sutherland','Eversheds Sutherland','International / national','regional',74,74,72,74,70,80,65,70,'UK-wide + international network','Broad UK footprint, commercial training and sector variety.'],
  ['pinsent-masons','Pinsent Masons','International sector firm','regional',78,72,74,78,70,82,65,27,'UK-wide + international network','Infrastructure, technology, energy, property and regulated sectors.'],
  ['ashurst','Ashurst','International City','global',82,62,84,84,62,86,45,30,'London + global network','Finance, projects, energy, infrastructure and corporate.'],
  ['macfarlanes','Macfarlanes','City independent','city',88,58,88,91,66,66,33,2,'London','Private equity, funds, tax, private client and high-touch training.'],
  ['travers-smith','Travers Smith','City independent','city',84,50,84,88,67,62,30,2,'London/Paris','Private equity, corporate, funds, disputes and pensions.'],
  ['mishcon-de-reya','Mishcon de Reya','Disputes/private wealth','midcity',82,56,80,85,68,58,30,6,'London + selected international offices','Litigation, reputation, private wealth, real estate and innovation.'],
  ['bryan-cave-leighton-paisner','Bryan Cave Leighton Paisner','International real estate/corporate','global',78,52,78,80,66,82,35,30,'London + global network','Real estate, corporate, finance, disputes and international platform.'],
  ['reed-smith','Reed Smith','US/international','us',76,42,82,78,62,86,24,30,'London + global network','Media, shipping, energy, disputes and finance.'],
  ['sidley-austin','Sidley Austin','US elite','us',90,25,98,88,50,88,18,21,'London + global network','Private equity, finance, regulatory, disputes and capital markets.'],
  ['kirkland-ellis','Kirkland & Ellis','US elite','us',94,30,100,90,45,88,20,20,'London + global network','Private equity, leveraged finance, restructuring and elite pay.'],
  ['latham-watkins','Latham & Watkins','US elite','us',92,35,100,90,48,92,25,30,'London + global network','Finance, private equity, capital markets, tech and disputes.'],
  ['skadden','Skadden','US elite','us',91,18,100,90,46,86,12,21,'London + global network','High-end M&A, capital markets, disputes and investigations.'],
  ['weil-gotshal-manges','Weil Gotshal & Manges','US elite','us',89,18,98,88,48,82,12,15,'London + international network','Private equity, restructuring, funds and finance.'],
  ['paul-weiss','Paul Weiss','US elite','us',88,12,100,88,45,76,8,8,'London + US network','Private equity, public M&A, disputes and high-end transactional work.'],
  ['ropes-gray','Ropes & Gray','US/private capital','us',86,16,96,86,50,80,10,14,'London + global network','Private equity, funds, finance and life sciences.'],
  ['goodwin','Goodwin','US/private capital/tech','us',84,18,94,84,54,78,12,16,'London + US/international network','Private equity, technology, life sciences and real estate capital.'],
  ['cooley','Cooley','US tech/life sciences','us',82,10,92,84,56,76,8,18,'London + US network','Technology, venture capital, life sciences and growth companies.'],
  ['osborne-clarke','Osborne Clarke','Tech sector firm','regional',76,34,72,80,72,78,30,25,'UK + international network','Technology, media, real estate, energy and commercial work.'],
  ['bird-bird','Bird & Bird','Technology/IP','specialist',78,28,74,82,70,82,25,30,'London + international network','IP, technology, media, data, life sciences and disputes.'],
  ['taylor-wessing','Taylor Wessing','Tech/private wealth','specialist',78,32,76,82,70,78,28,28,'London + international network','Technology, life sciences, private wealth, real estate and disputes.'],
  ['simmons-simmons','Simmons & Simmons','Sector-focused City','city',80,34,78,82,66,78,25,20,'London + international network','Financial institutions, asset management, tech, healthcare and disputes.'],
  ['addleshaw-goddard','Addleshaw Goddard','UK/international commercial','regional',74,60,70,74,72,72,55,18,'UK-wide + international offices','Corporate, finance, real estate, retail, energy and national client base.'],
  ['shakespeare-martineau','Shakespeare Martineau','National firm','regional',66,40,62,68,76,55,35,10,'UK-wide','Broad regional training, commercial, private client, education and health.'],
  ['shoosmiths','Shoosmiths','National commercial','regional',70,38,66,70,76,58,32,14,'UK-wide','Corporate, real estate, commercial, employment and strong regional platform.'],
  ['irwin-mitchell','Irwin Mitchell','National mixed practice','regional',68,45,62,68,76,52,40,17,'UK-wide','Personal legal services, business legal services, employment and real estate.'],
  ['trowers-hamlins','Trowers & Hamlins','Public sector/real estate','regional',70,24,66,72,74,62,20,10,'London + UK/Middle East','Real estate, public sector, housing, corporate and international links.'],
  ['fieldfisher','Fieldfisher','European commercial','midcity',74,32,72,76,70,72,28,25,'London + European network','Technology, life sciences, regulatory, disputes and privacy.'],
  ['stephenson-harwood','Stephenson Harwood','International City','city',76,30,76,78,66,76,25,11,'London + international network','Shipping, finance, corporate, rail, private wealth and disputes.'],
  ['watson-farley-williams','Watson Farley & Williams','Sector specialist','specialist',76,24,76,78,66,78,20,18,'London + international network','Energy, transport, maritime, finance and infrastructure.'],
  ['hill-dickinson','Hill Dickinson','National/international','regional',68,34,64,70,74,62,28,11,'UK + international offices','Marine, health, corporate, commercial litigation and insurance.'],
  ['penningtons-manches-cooper','Penningtons Manches Cooper','Private wealth/commercial','midcity',68,20,64,70,74,60,18,12,'UK + international offices','Private wealth, real estate, technology, education and disputes.'],
  ['withers','Withers','Private client/international','specialist',72,14,70,76,70,70,12,17,'London + global private client network','Private client, tax, family, real estate and international wealth.'],
  ['farrer-co','Farrer & Co','Private client/reputation','specialist',72,12,68,76,72,55,10,1,'London','Private client, charities, reputation, employment and media.'],
  ['lewis-silkin','Lewis Silkin','Employment/creative industries','specialist',70,16,66,74,76,58,14,5,'London + UK/Ireland offices','Employment, immigration, brands, technology and creative sector clients.'],
  ['clyde-co','Clyde & Co','Insurance/global disputes','disputes',76,73,70,76,68,82,73,60,'London + global network','Insurance, shipping, aviation, energy, disputes and international risk work.'],
  ['kennedys','Kennedys','Insurance litigation','disputes',70,40,64,72,74,72,40,45,'UK + global insurance network','Insurance, liability, healthcare, commercial disputes and claims defence.'],
  ['birketts','Birketts','Regional commercial','regional',64,34,60,68,78,45,34,6,'East Anglia + London','Corporate, real estate, private client, employment and regional business clients.'],
  ['mills-reeve','Mills & Reeve','National commercial','regional',70,30,64,72,78,56,30,7,'UK-wide','Technology, healthcare, education, private client, corporate and real estate.'],
  ['burges-salmon','Burges Salmon','Bristol commercial','regional',76,27,68,78,76,58,27,2,'Bristol/London/Edinburgh','Energy, transport, real estate, corporate, disputes and private client.'],
  ['gateley','Gateley','National commercial','regional',66,27,60,68,76,50,27,25,'UK-wide','Corporate, real estate, banking, employment and commercial services.'],
  ['tlt','TLT','National commercial','regional',70,27,64,72,76,58,27,7,'UK-wide','Financial services, retail, leisure, clean energy, real estate and disputes.'],
  ['charles-russell-speechlys','Charles Russell Speechlys','Private wealth/commercial','midcity',72,25,68,74,74,62,25,11,'London + international offices','Private wealth, real estate, corporate, family, sport and disputes.'],
  ['dentons','Dentons','Global full-service','global',74,25,72,74,68,96,25,160,'London + global verein network','Global reach, corporate, real estate, disputes, banking and public policy.'],
  ['gowling-wlg','Gowling WLG','International commercial','regional',70,25,66,72,74,70,25,19,'UK + international network','Real estate, projects, corporate, IP, pensions and public sector work.'],
  ['squire-patton-boggs','Squire Patton Boggs','International commercial','global',68,23,66,70,72,78,23,40,'London + international network','Corporate, public policy, disputes, financial services and trade.'],
  ['dwf','DWF','Listed legal business','regional',64,22,58,66,76,62,22,30,'UK + international network','Insurance, commercial, real estate, employment and managed legal services.'],
  ['walker-morris','Walker Morris','Leeds commercial','regional',66,22,60,70,78,45,22,1,'Leeds','Corporate, real estate, sport, employment, commercial disputes and regulatory.'],
  ['dac-beachcroft','DAC Beachcroft','Insurance/health/commercial','regional',66,20,60,68,76,58,20,10,'UK + international offices','Insurance, health, real estate, employment and commercial litigation.'],
  ['womble-bond-dickinson','Womble Bond Dickinson','Transatlantic/national','regional',66,20,62,68,76,62,20,30,'UK + US network','Energy, real estate, transport, private wealth, corporate and disputes.'],
  ['cleary-gottlieb','Cleary Gottlieb Steen & Hamilton','US elite','us',88,16,98,88,48,88,16,16,'London + global network','Capital markets, antitrust, M&A, disputes and sovereign work.'],
  ['gibson-dunn','Gibson Dunn','US elite','us',90,15,100,90,46,88,15,21,'London + global network','Disputes, investigations, private equity, finance and regulatory.'],
  ['jones-day','Jones Day','US/global','us',82,15,88,82,58,88,15,40,'London + global network','M&A, disputes, antitrust, investigations and global corporate work.'],
  ['mayer-brown','Mayer Brown','Global full-service','global',74,15,76,76,68,82,15,27,'London + global network','Finance, insurance, real estate, litigation and regulatory work.'],
  ['milbank','Milbank','US finance elite','us',90,15,100,88,44,84,15,12,'London + global network','Leveraged finance, restructuring, capital markets, projects and private equity.'],
  ['rpc','RPC','Insurance/media/commercial','midcity',70,14,66,74,76,58,14,4,'London/Bristol/Singapore/Hong Kong','Insurance, media, technology, retail, disputes and commercial advisory.'],
  ['weightmans','Weightmans','National commercial/insurance','regional',62,14,56,64,78,45,14,9,'UK-wide','Insurance, transport, public sector, employment, real estate and regulatory.'],
  ['ashfords','Ashfords','South West commercial','regional',62,14,56,66,78,42,14,6,'South West + London','Corporate, real estate, disputes, private client and public sector work.'],
  ['bevan-brittan','Bevan Brittan','Public sector/health','regional',62,14,56,66,78,42,14,4,'UK-wide','Health, local government, housing, construction and commercial work.'],
  ['brabners','Brabners','North West commercial','regional',62,14,56,66,78,40,14,4,'North West + Leeds/London','Corporate, sport, charity, employment, real estate and private client.'],
  ['forsters','Forsters','Private wealth/real estate','specialist',72,12,70,78,74,50,12,1,'London','Real estate, private client, tax, family, corporate and disputes.'],
  ['paul-hastings','Paul Hastings','US elite','us',88,12,100,86,46,84,12,23,'London + global network','Private equity, finance, investigations, employment and restructuring.'],
  ['sullivan-cromwell','Sullivan & Cromwell','US elite','us',92,12,100,90,44,88,12,13,'London + global network','M&A, capital markets, finance, disputes and elite public company work.'],
  ['fladgate','Fladgate','Mid-market commercial','midcity',64,11,62,68,76,45,11,1,'London','Real estate, corporate, funds, private client, construction and disputes.'],
  ['russell-cooke','Russell-Cooke','Private client/social impact','midcity',62,11,56,66,78,38,11,3,'London/Kingston','Private client, charity, family, employment, litigation and real estate.'],
  ['bristows','Bristows','IP/technology specialist','specialist',76,10,72,82,72,62,10,2,'London/Brussels','Intellectual property, technology, life sciences, data and competition.'],
  ['debevoise-plimpton','Debevoise & Plimpton','US elite','us',88,10,100,88,48,82,10,10,'London + global network','Private equity, insurance, funds, disputes and investigations.'],
  ['dechert','Dechert','US/global finance/life sciences','us',80,10,88,82,56,82,10,20,'London + global network','Funds, finance, life sciences, white collar and litigation.'],
  ['kingsley-napley','Kingsley Napley','Criminal/regulatory/private client','specialist',72,10,66,78,76,42,10,1,'London','Criminal litigation, regulatory, immigration, family, private client and disputes.'],
  ['michelmores','Michelmores','South West/private wealth','regional',62,10,56,66,80,40,10,4,'South West + London','Private wealth, agriculture, real estate, corporate and disputes.'],
  ['simpson-thacher','Simpson Thacher & Bartlett','US elite','us',92,10,100,90,44,86,10,13,'London + global network','Private equity, funds, leveraged finance, capital markets and M&A.']
];

function predictedSalary(tag, pay, offices) {
  if (tag.includes('US elite')) {
    return { traineeFirst: '£60k–£65k', traineeSecond: '£65k–£70k', newlyQualified: '£170k–£180k+' };
  }
  if (tag.includes('US/') || tag.includes('Global elite')) {
    return { traineeFirst: '£55k–£60k', traineeSecond: '£60k–£65k', newlyQualified: '£140k–£170k' };
  }
  if (tag.includes('Magic Circle') || tag.includes('Elite UK')) {
    return { traineeFirst: '£50k–£56k', traineeSecond: '£55k–£61k', newlyQualified: '£125k–£150k' };
  }
  if (pay >= 84) {
    return { traineeFirst: '£48k–£55k', traineeSecond: '£52k–£60k', newlyQualified: '£105k–£135k' };
  }
  if (offices > 20) {
    return { traineeFirst: '£44k–£50k', traineeSecond: '£48k–£55k', newlyQualified: '£85k–£110k' };
  }
  return { traineeFirst: '£38k–£48k', traineeSecond: '£42k–£52k', newlyQualified: '£70k–£100k' };
}

const legalCheekTrainingContracts = {
  'clifford-chance': 100,
  linklaters: 100,
  freshfields: 85,
  'slaughter-and-may': 85,
  'clyde-co': 73,
  'ao-shearman': 70,
  'addleshaw-goddard': 70,
  cms: 70,
  'pinsent-masons': 68,
  'herbert-smith-freehills-kramer': 61,
  'dLA-piper': 55,
  'eversheds-sutherland': 50,
  'hogan-lovells': 50,
  'norton-rose-fulbright': 50,
  'white-case': 50,
  kennedys: 40,
  'baker-mckenzie': 33,
  birketts: 30,
  'hill-dickinson': 30,
  'mills-reeve': 30,
  'osborne-clarke': 30,
  'burges-salmon': 27,
  gateley: 27,
  tlt: 27,
  'reed-smith': 26,
  'charles-russell-speechlys': 25,
  dentons: 25,
  'gowling-wlg': 25,
  'stephenson-harwood': 25,
  'trowers-hamlins': 25,
  'simmons-simmons': 24,
  'squire-patton-boggs': 23,
  dwf: 22,
  fieldfisher: 22,
  'walker-morris': 22,
  'bryan-cave-leighton-paisner': 20,
  'dac-beachcroft': 20,
  shoosmiths: 19,
  'sidley-austin': 19,
  'watson-farley-williams': 19,
  'bird-bird': 18,
  'cleary-gottlieb': 16,
  'gibson-dunn': 15,
  'jones-day': 15,
  'kirkland-ellis': 15,
  'mayer-brown': 15,
  milbank: 15,
  'ropes-gray': 15,
  'weil-gotshal-manges': 15,
  goodwin: 14,
  rpc: 14,
  weightmans: 14,
  withers: 13,
  forsters: 12,
  'paul-hastings': 12,
  'paul-weiss': 12,
  'penningtons-manches-cooper': 12,
  'shakespeare-martineau': 12,
  'sullivan-cromwell': 12,
  fladgate: 11,
  'russell-cooke': 11,
  bristows: 10,
  'debevoise-plimpton': 10,
  dechert: 10,
  'kingsley-napley': 10,
  'lewis-silkin': 10,
  michelmores: 10,
  'simpson-thacher': 10
};

const exactFirmFacts = {
  'clifford-chance': {
    salary: { traineeFirst: '£56,000', traineeSecond: '£61,000', newlyQualified: '£150,000' },
    offices: 33,
    countries: 22,
    retention: '76%',
    pep: '£2,100,000',
    grants: { pgdl: '£12,500', sqe: '£17,500' },
    source: 'Legal Cheek firm profile 2025–26'
  },
  'ao-shearman': {
    salary: { traineeFirst: '£56,000', traineeSecond: '£61,000', newlyQualified: '£150,000' },
    offices: 48,
    countries: 29,
    retention: '76%',
    pep: '£2,000,000',
    grants: { pgdl: '£13,500', sqe: '£20,000' },
    source: 'Legal Cheek firm profile 2025–26'
  },
  'white-case': {
    salary: { traineeFirst: '£62,000', traineeSecond: '£67,000', newlyQualified: '£175,000' },
    source: 'Financial News London pay report'
  },
  freshfields: {
    salary: { traineeFirst: '£56,000', traineeSecond: '£61,000', newlyQualified: '£150,000' },
    source: 'Financial News London pay report'
  },
  linklaters: {
    salary: { traineeFirst: '£56,000', traineeSecond: '£61,000', newlyQualified: '£150,000' },
    source: 'Financial News London pay report'
  },
  'paul-weiss': {
    salary: { traineeFirst: '£60k–£70k', traineeSecond: '£65k–£75k', newlyQualified: '£180,000' },
    source: 'Financial News London pay report'
  },
  'gibson-dunn': {
    salary: { traineeFirst: '£60k–£70k', traineeSecond: '£65k–£75k', newlyQualified: '£180,000' },
    source: 'The Times City trainee pay report'
  }
};

function legalCheekUrl(slug) {
  return `https://www.legalcheek.com/firm/${slug}/`;
}

const legalCheekProfileFactsByFirm = window.legalCheekProfileFacts || {};

function cleanProfileValue(value) {
  if (!value) return null;
  return String(value)
    .replace(/\s+[A-Z][a-z]+(?:\s[A-Z][a-z]+)?\s+(?:pay|pays|offer|offers|provide|provides)\b.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function numericFact(value, fallback) {
  const match = String(value || '').match(/\d+/);
  return match ? Number(match[0]) : fallback;
}

function profileSalary(profile, tag, pay, offices) {
  const inferred = predictedSalary(tag, pay, offices);
  return {
    traineeFirst: cleanProfileValue(profile.traineeFirst) || inferred.traineeFirst,
    traineeSecond: cleanProfileValue(profile.traineeSecond) || inferred.traineeSecond,
    newlyQualified: cleanProfileValue(profile.newlyQualified) || inferred.newlyQualified
  };
}

function universityTargets(pool) {
  const strong = {
    broad: ['Oxford', 'Cambridge', 'UCL', 'LSE', "King's College London", 'Durham', 'Warwick', 'Bristol'],
    city: ['Oxford', 'Cambridge', 'UCL', 'LSE', "King's College London", 'Durham', 'Warwick'],
    regional: ['Manchester', 'Leeds', 'Birmingham', 'Nottingham', 'Sheffield', 'Liverpool'],
    us: ['Oxford', 'Cambridge', 'UCL', 'LSE', "King's College London", 'Durham'],
    specialist: ['Oxford', 'Cambridge', 'UCL', 'LSE', "King's College London", 'Queen Mary']
  };
  const mid = {
    broad: ['Nottingham', 'Manchester', 'Leeds', 'Edinburgh', 'Exeter', 'Birmingham'],
    city: ['Bristol', 'Nottingham', 'Manchester', 'Queen Mary', 'Exeter'],
    regional: ['Cardiff', 'Newcastle', 'Bristol', 'Exeter', 'York', 'Durham'],
    us: ['Warwick', 'Bristol', 'Nottingham', 'Manchester'],
    specialist: ['Bristol', 'Durham', 'Warwick', 'Nottingham']
  };
  const weak = {
    broad: ['York', 'Cardiff', 'Newcastle', 'Sheffield', 'Liverpool', 'Southampton'],
    city: ['Leeds', 'Birmingham', 'York', 'Edinburgh', 'Cardiff'],
    regional: ['Exeter', 'York', 'Durham', 'Queen Mary', 'Southampton'],
    us: ['Leeds', 'Birmingham', 'Exeter', 'Queen Mary', 'York'],
    specialist: ['Manchester', 'Leeds', 'Exeter', 'Birmingham', 'York']
  };
  return {
    strong: strong[pool] || strong.broad,
    mid: mid[pool] || mid.broad,
    weak: weak[pool] || weak.broad
  };
}

function categorizedSeats(seats) {
  const groups = {
    'Transactional seats': [],
    'Contentious / court-facing seats': [],
    'Regulatory / advisory seats': [],
    'Private client / specialist seats': []
  };

  seats.forEach(seat => {
    if (seatCategories.transactional.includes(seat)) groups['Transactional seats'].push(seat);
    else if (seatCategories.contentious.includes(seat)) groups['Contentious / court-facing seats'].push(seat);
    else if (seatCategories.regulatory.includes(seat)) groups['Regulatory / advisory seats'].push(seat);
    else groups['Private client / specialist seats'].push(seat);
  });

  return Object.fromEntries(Object.entries(groups).filter(([, items]) => items.length));
}

function buildFirm([slug, name, tag, pool, prestige, training, pay, work, balance, international, traineeSeats, offices, footprint, note]) {
  const seats = seatPools[pool] || seatPools.global;
  const universities = universityPools[pool] || universityPools.broad;
  const exact = exactFirmFacts[slug] || {};
  const profile = legalCheekProfileFactsByFirm[slug] || {};
  const hasProfile = Boolean(profile.sourceUrl);
  const legalCheekSeats = numericFact(profile.trainingContracts, legalCheekTrainingContracts[slug] ?? traineeSeats);
  const salary = hasProfile ? profileSalary(profile, tag, pay, offices) : (exact.salary || predictedSalary(tag, pay, offices));
  const verifiedOffices = numericFact(profile.offices, exact.offices || offices);
  const profileUrl = profile.sourceUrl || legalCheekUrl(slug);
  const applications = legalCheekSeats >= 60 ? 'Very competitive: expect online application, Watson Glaser or SJT-style testing, video interview and assessment centre.' : 'Highly competitive: expect written application, test stage, interview and assessment centre or vacation scheme conversion route.';
  return {
    slug,
    name,
    tag,
    prestige,
    training,
    pay,
    work,
    balance,
    international,
    traineeSeats: legalCheekSeats,
    offices: verifiedOffices,
    countries: numericFact(profile.countries, exact.countries || null),
    retention: cleanProfileValue(profile.retention) || exact.retention || null,
    pep: cleanProfileValue(profile.pep) || exact.pep || null,
    grants: {
      pgdl: cleanProfileValue(profile.pgdl) || exact.grants?.pgdl || null,
      sqe: cleanProfileValue(profile.sqe) || exact.grants?.sqe || null
    },
    hours: {
      start: cleanProfileValue(profile.start) || null,
      finish: cleanProfileValue(profile.finish) || null,
      target: cleanProfileValue(profile.targetHours) || null,
      annualLeave: cleanProfileValue(profile.annualLeave) || null
    },
    secondments: {
      abroad: cleanProfileValue(profile.secondmentAbroad) || null,
      client: cleanProfileValue(profile.clientSecondment) || null
    },
    requirements: {
      alevel: cleanProfileValue(profile.alevel) || null,
      degree: cleanProfileValue(profile.degree) || null
    },
    scorecard: profile.scorecard || null,
    footprint,
    note,
    seats,
    universities,
    universityTargets: universityTargets(pool),
    seatCategories: categorizedSeats(seats),
    salary,
    sourceStatus: hasProfile ? 'Source-backed Legal Cheek profile data is embedded for this firm.' : (exact.salary ? 'Source-backed pay fields with clearly labelled Verdict estimates.' : 'Estimated salary range. Verify before relying on it.'),
    sourceBadge: hasProfile ? 'Source-backed profile' : 'Estimated fields labelled',
    sources: [
      { label: hasProfile ? 'Legal Cheek firm profile used for embedded facts' : 'Legal Cheek firm profile', url: profileUrl },
      { label: 'Legal Cheek Firms Most List', url: 'https://www.legalcheek.com/the-firms-most-list/' },
      ...(exact.source ? [{ label: exact.source, url: exact.source.includes('Financial News') ? 'https://www.fnlondon.com/' : exact.source.includes('Times') ? 'https://www.thetimes.co.uk/' : legalCheekUrl(slug) }] : [])
    ],
    vacationScheme: legalCheekSeats >= 25 ? 'Usually offers structured vacation scheme routes alongside direct training contract applications.' : 'Often smaller intake; research direct TC and vacation scheme routes carefully.',
    applicationNotes: applications,
    whatStudentsAsk: [
      'How much responsibility do trainees get in each seat?',
      'Which seats are most competitive internally?',
      'How many trainees are retained each year?',
      'How much international or client contact is realistic during training?',
      'What support is given for Watson Glaser, interviews and assessment centres?'
    ],
    bestFor: [
      pay >= 94 ? 'Students targeting top US-level pay' : 'Students wanting strong commercial training',
      international >= 85 ? 'Students who want cross-border work' : 'Students who prefer a focused UK training environment',
      balance >= 72 ? 'Students who care about lifestyle and sustainable hours' : 'Students comfortable with high-intensity deal or disputes work'
    ]
  };
}

window.LAW_FIRMS = firmBlueprints.map(buildFirm);
