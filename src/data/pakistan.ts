export interface ProvinceCities {
  province: string;
  cities: string[];
}

export const PAKISTAN_PROVINCES: ProvinceCities[] = [
  {
    province: 'Sindh',
    cities: [
      'Karachi',
      'Hyderabad',
      'Sukkur',
      'Larkana',
      'Nawabshah',
      'Mirpur Khas',
      'Jacobabad',
      'Shikarpur',
    ],
  },
  {
    province: 'Punjab',
    cities: [
      'Lahore',
      'Faisalabad',
      'Rawalpindi',
      'Multan',
      'Gujranwala',
      'Sialkot',
      'Bahawalpur',
      'Sargodha',
      'Sheikhupura',
      'Jhelum',
      'Gujrat',
      'Sahiwal',
    ],
  },
  {
    province: 'Islamabad Capital Territory',
    cities: ['Islamabad'],
  },
  {
    province: 'Khyber Pakhtunkhwa',
    cities: [
      'Peshawar',
      'Mardan',
      'Abbottabad',
      'Swat',
      'Nowshera',
      'Kohat',
      'Dera Ismail Khan',
    ],
  },
  {
    province: 'Balochistan',
    cities: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Hub', 'Sibi'],
  },
  {
    province: 'Azad Jammu & Kashmir',
    cities: ['Muzaffarabad', 'Mirpur', 'Rawalakot', 'Kotli'],
  },
  {
    province: 'Gilgit-Baltistan',
    cities: ['Gilgit', 'Skardu', 'Hunza'],
  },
];

export const ALL_PAKISTANI_CITIES = PAKISTAN_PROVINCES.flatMap((p) => p.cities).sort();

export const validatePakistaniPhone = (phone: string): boolean => {
  // Accepts: 03001234567, 0300-1234567, +923001234567, 03xx xxxxxxx
  const clean = phone.replace(/[\s\-]/g, '');
  return /^(\+92|92|0)?3[0-9]{9}$/.test(clean);
};
