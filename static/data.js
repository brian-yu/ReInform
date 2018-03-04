
var centers = {"Alaska": [-152.2782, 64.0685],
"North Dakota": [-100.4659, 47.4501],
"Washington": [-120.4472, 47.3826],
"Montana": [-109.6333, 47.0527],
"Minnesota": [-94.3053, 46.2807],
"Maine": [-69.2428, 45.3695],
"Wisconsin": [-89.9941, 44.6243],
"South Dakota": [-100.2263, 44.4443],
"Idaho": [-114.6130, 45.3509],
"Michigan": [-85.4102, 44.3467],
"Vermont": [-72.6658, 44.0687],
"Oregon": [-120.5583, 43.9336],
"New Hampshire": [-71.5811, 43.6805],
"Wyoming": [-107.5512, 42.9957],
"New York": [-75.5268, 42.9538],
"Massachusetts": [-71.8083, 42.2596],
"Iowa": [-93.4960, 42.0751],
"Rhode Island": [-71.5562, 41.6762],
"Connecticut": [-72.7273, 41.6219],
"Nebraska": [-99.7951, 41.5378],
"Pennsylvania": [-77.7996, 40.8781],
"Ohio": [-82.7937, 40.2862],
"New Jersey": [-74.6728, 40.1907],
"Illinois": [-89.1965, 40.0417],
"Indiana": [-86.2816, 39.8942],
"Nevada": [-116.6312, 39.3289],
"Utah": [-111.6703, 39.3055],
"Maryland": [-76.7909, 39.0550],
"Colorado": [-105.5478, 38.9972],
"Delaware": [-75.5050, 38.9896],
"District of Columbia": [-77.0147, 38.9101],
"West Virginia": [-80.6227, 38.6409],
"Kansas": [-98.3804, 38.4937],
"Missouri": [-92.4580, 38.3566],
"Kentucky": [-85.3021, 37.5347],
"Virginia": [-78.8537, 37.5215],
"California": [-119.4696, 37.1841],
"Tennessee": [-86.3505, 35.8580],
"Oklahoma": [-97.4943, 35.5889],
"North Carolina": [-79.3877, 35.5557],
"Arkansas": [-92.4426, 34.8938],
"New Mexico": [-106.1126, 34.4071],
"Arizona": [-111.6602, 34.2744],
"South Carolina": [-80.8964, 33.9169],
"Alabama": [-86.8287, 32.7794],
"Mississippi": [-89.6678, 32.7364],
"Georgia": [-83.4426, 32.6415],
"Texas": [-99.3312, 31.4757],
"Louisiana": [-91.9968, 31.0689],
"Florida": [-82.4497, 28.6305],
"Hawaii": [-156.3737, 20.2927],
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function coordsSimilar(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (Math.round(a[i]) > Math.round(b[i]) + 1 || Math.round(a[i]) < Math.round(b[i]) - 1) return false;
  }
  return true;
}