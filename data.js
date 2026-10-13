/**
 * DRIVEVAULT - Premium Automotive Fleet & System Data
 * Production-ready mock dataset with luxury imagery, full specs, and configurations
 */

const INITIAL_FLEET = [
  {
    id: "dv-01",
    brand: "Porsche",
    model: "911 GT3 RS",
    year: 2024,
    category: "Sports",
    tagline: "Pure Motorsport Engineering for the Open Road",
    dailyPrice: 850,
    weeklyDiscount: 0.15,
    monthlyDiscount: 0.30,
    rating: 4.98,
    reviewsCount: 42,
    available: true,
    featured: true,
    location: "Beverly Hills",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      engine: "4.0L Naturally Aspirated Flat-6",
      horsepower: "518 HP",
      acceleration: "3.0s (0-60 mph)",
      topSpeed: "184 mph",
      transmission: "Automatic",
      driveType: "Rear-Wheel Drive",
      seats: 2,
      doors: 2,
      fuelType: "Petrol (Premium)",
      fuelEconomy: "15 mpg",
      luggageCapacity: "132 Liters"
    },
    features: [
      "PDK 7-Speed Transmission",
      "Carbon Ceramic Composite Brakes",
      "DRS Aerodynamic Rear Wing",
      "PCM Navigation System",
      "Apple CarPlay & Android Auto",
      "Chrono Package with Lap Trigger",
      "Sport Exhaust with Active Valves",
      "Bose Surround Audio System"
    ],
    insuranceTiers: [
      { id: "basic", name: "Standard Protection", pricePerDay: 0, deposit: 2500, deductible: 5000, desc: "Third-party liability and basic collision coverage" },
      { id: "premium", name: "Premium Shield", pricePerDay: 45, deposit: 1000, deductible: 1000, desc: "Zero deductible collision, tire, windshield & theft coverage" },
      { id: "vip", name: "DriveVault Concierge All-Inclusive", pricePerDay: 85, deposit: 0, deductible: 0, desc: "Zero deposit, zero deductible, 24/7 personal escort service" }
    ]
  },
  {
    id: "dv-02",
    brand: "Mercedes-AMG",
    model: "G63 'Stronger Than Time'",
    year: 2024,
    category: "SUV",
    tagline: "Unrivaled Iconic Dominance and Handcrafted Opulence",
    dailyPrice: 790,
    weeklyDiscount: 0.12,
    monthlyDiscount: 0.25,
    rating: 4.96,
    reviewsCount: 58,
    available: true,
    featured: true,
    location: "Miami Beach",
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      engine: "4.0L Bi-Turbo Handcrafted V8",
      horsepower: "577 HP",
      acceleration: "4.4s (0-60 mph)",
      topSpeed: "149 mph",
      transmission: "Automatic",
      driveType: "All-Wheel Drive (4MATIC)",
      seats: 5,
      doors: 5,
      fuelType: "Petrol",
      fuelEconomy: "14 mpg",
      luggageCapacity: "667 Liters"
    },
    features: [
      "AMG Performance Exhaust System",
      "Burmester 3D High-End Surround Sound",
      "Active Multicontour Massaging Seats",
      "Three 100% Differential Locks",
      "Widescreen Cockpit Dual 12.3\" Displays",
      "64-Color Ambient Lighting",
      "AMG Ride Control Air Suspension",
      "Panoramic Sunroof"
    ],
    insuranceTiers: [
      { id: "basic", name: "Standard Protection", pricePerDay: 0, deposit: 2000, deductible: 4000, desc: "Standard collision and liability" },
      { id: "premium", name: "Premium Shield", pricePerDay: 40, deposit: 800, deductible: 800, desc: "Comprehensive coverage with reduced excess" },
      { id: "vip", name: "VIP Concierge Shield", pricePerDay: 75, deposit: 0, deductible: 0, desc: "Full peace of mind with 0 deposit & priority assistance" }
    ]
  },
  {
    id: "dv-03",
    brand: "Ferrari",
    model: "Roma Spider",
    year: 2024,
    category: "Sports",
    tagline: "La Nuova Dolce Vita with Open-Air Grand Touring Thrill",
    dailyPrice: 1100,
    weeklyDiscount: 0.15,
    monthlyDiscount: 0.28,
    rating: 5.00,
    reviewsCount: 29,
    available: true,
    featured: true,
    location: "Manhattan NYC",
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      engine: "3.9L Twin-Turbo Mid-Front V8",
      horsepower: "612 HP",
      acceleration: "3.2s (0-60 mph)",
      topSpeed: "199 mph",
      transmission: "Dual-Clutch",
      driveType: "Rear-Wheel Drive",
      seats: 2,
      doors: 2,
      fuelType: "Petrol (Premium)",
      fuelEconomy: "16 mpg",
      luggageCapacity: "255 Liters"
    },
    features: [
      "8-Speed F1 Dual-Clutch Transmission",
      "Carbon-Fibre Driver Zone with LEDs",
      "Magneride Dual-Mode Suspension",
      "8.4\" Central Touchscreen Display",
      "Wireless Apple CarPlay",
      "Adaptive Cruise Control & Blind Spot Alert",
      "Full Matrix LED Headlights",
      "High-End JBL Audio"
    ],
    insuranceTiers: [
      { id: "basic", name: "Standard Protection", pricePerDay: 0, deposit: 3500, deductible: 7000, desc: "Standard statutory insurance" },
      { id: "premium", name: "Premium Shield", pricePerDay: 60, deposit: 1500, deductible: 1500, desc: "Zero deductible collision and tire protection" },
      { id: "vip", name: "VIP Concierge Shield", pricePerDay: 110, deposit: 0, deductible: 0, desc: "Zero liability, VIP drop-off anywhere in town" }
    ]
  },
  {
    id: "dv-04",
    brand: "Rolls-Royce",
    model: "Ghost Series II Extended",
    year: 2024,
    category: "Luxury",
    tagline: "The Pinnacle of Serenity and Effortless Prestige",
    dailyPrice: 1450,
    weeklyDiscount: 0.15,
    monthlyDiscount: 0.30,
    rating: 4.99,
    reviewsCount: 34,
    available: true,
    featured: true,
    location: "Dubai Marina",
    image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      engine: "6.75L Twin-Turbocharged V12",
      horsepower: "563 HP",
      acceleration: "4.6s (0-60 mph)",
      topSpeed: "155 mph",
      transmission: "Automatic",
      driveType: "All-Wheel Drive",
      seats: 4,
      doors: 4,
      fuelType: "Petrol (Premium)",
      fuelEconomy: "13 mpg",
      luggageCapacity: "500 Liters"
    },
    features: [
      "Starlight Headliner with Shooting Stars",
      "Bespoke 1300W Studio Sound System",
      "Effortless Power-Assisted Doors",
      "Champagne Chiller & Crystal Flutes",
      "Planar Suspension Whispering Ride",
      "Rear Theatre Configuration Screen",
      "Ventilated Lambswool Massage Loungers",
      "Chauffeur Available On-Demand"
    ],
    insuranceTiers: [
      { id: "basic", name: "Standard Protection", pricePerDay: 0, deposit: 4000, deductible: 8000, desc: "Standard high-value liability" },
      { id: "premium", name: "Premium Shield", pricePerDay: 75, deposit: 1500, deductible: 1200, desc: "Comprehensive peace of mind" },
      { id: "vip", name: "Royal Concierge Shield", pricePerDay: 130, deposit: 0, deductible: 0, desc: "Full white-glove indemnity & 24/7 dedicated support" }
    ]
  },
  {
    id: "dv-05",
    brand: "Audi",
    model: "RS e-tron GT Carbon",
    year: 2024,
    category: "Electric",
    tagline: "Electrifying Gran Turismo with Instant Dynamic Precision",
    dailyPrice: 580,
    weeklyDiscount: 0.12,
    monthlyDiscount: 0.25,
    rating: 4.93,
    reviewsCount: 47,
    available: true,
    featured: false,
    location: "Zurich Airport",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      engine: "Dual Permanent Magnet Electric Motors",
      horsepower: "637 HP (Boost)",
      acceleration: "3.1s (0-60 mph)",
      topSpeed: "155 mph",
      transmission: "Automatic",
      driveType: "Electric Quattro AWD",
      seats: 4,
      doors: 4,
      fuelType: "Electric",
      fuelEconomy: "249 miles range",
      luggageCapacity: "405 Liters"
    },
    features: [
      "800-Volt Ultra-Fast Architecture (5-80% in 22 min)",
      "Bang & Olufsen 3D Premium Audio",
      "Carbon Roof & Exterior Aero Pack",
      "All-Wheel Steering & Torque Vectoring Plus",
      "Head-Up Augmented Reality Display",
      "Free Supercharging Network Access Included",
      "Adaptive 3-Chamber Air Suspension"
    ],
    insuranceTiers: [
      { id: "basic", name: "Standard Protection", pricePerDay: 0, deposit: 1500, deductible: 3000, desc: "Standard statutory insurance" },
      { id: "premium", name: "Premium Shield", pricePerDay: 35, deposit: 500, deductible: 500, desc: "Zero deductible collision & EV battery guarantee" },
      { id: "vip", name: "VIP Concierge Shield", pricePerDay: 65, deposit: 0, deductible: 0, desc: "Complete 0 deposit and on-call roadside charging" }
    ]
  },
  {
    id: "dv-06",
    brand: "Lamborghini",
    model: "Urus Performante",
    year: 2024,
    category: "SUV",
    tagline: "The World's First Super Sport Utility Vehicle",
    dailyPrice: 990,
    weeklyDiscount: 0.15,
    monthlyDiscount: 0.28,
    rating: 4.97,
    reviewsCount: 63,
    available: true,
    featured: true,
    location: "Beverly Hills",
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      engine: "4.0L Twin-Turbocharged V8",
      horsepower: "657 HP",
      acceleration: "3.1s (0-60 mph)",
      topSpeed: "190 mph",
      transmission: "Automatic",
      driveType: "All-Wheel Drive",
      seats: 5,
      doors: 5,
      fuelType: "Petrol (Premium)",
      fuelEconomy: "14 mpg",
      luggageCapacity: "616 Liters"
    },
    features: [
      "Performante Carbon-Fiber Hood & Roof",
      "Akrapovič Titanium Sports Exhaust",
      "ANIMA Drive Mode Selector with Rally Mode",
      "Sensonum 21-Speaker Advanced 3D Sound",
      "Carbon Ceramic Braking System",
      "Alcantara Interior with Contrast Stitching",
      "Night Vision Assist & 360° 3D Camera"
    ],
    insuranceTiers: [
      { id: "basic", name: "Standard Protection", pricePerDay: 0, deposit: 3000, deductible: 6000, desc: "Standard statutory cover" },
      { id: "premium", name: "Premium Shield", pricePerDay: 50, deposit: 1000, deductible: 1000, desc: "Collision, windshield & tire coverage" },
      { id: "vip", name: "VIP Concierge Shield", pricePerDay: 95, deposit: 0, deductible: 0, desc: "Zero liability, priority vehicle replacement" }
    ]
  },
  {
    id: "dv-07",
    brand: "BMW",
    model: "M8 Competition Gran Coupe",
    year: 2024,
    category: "Sedan",
    tagline: "Uncompromising Power Meets Four-Door Executive Luxury",
    dailyPrice: 620,
    weeklyDiscount: 0.15,
    monthlyDiscount: 0.28,
    rating: 4.91,
    reviewsCount: 39,
    available: true,
    featured: false,
    location: "Munich Center",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      engine: "4.4L BMW M TwinPower Turbo V8",
      horsepower: "617 HP",
      acceleration: "3.0s (0-60 mph)",
      topSpeed: "190 mph",
      transmission: "Automatic",
      driveType: "M xDrive with 2WD Mode",
      seats: 5,
      doors: 4,
      fuelType: "Petrol",
      fuelEconomy: "17 mpg",
      luggageCapacity: "440 Liters"
    },
    features: [
      "M Carbon Ceramic Brake Package",
      "Bowers & Wilkins Diamond Surround Sound",
      "BMW Live Cockpit Professional with HUD",
      "Carbon Fiber Roof and Exterior Accents",
      "M Track Mode & M Drift Analyzer",
      "Soft-Close Automatic Doors",
      "Iconic Adaptive Laserlight Headlights"
    ],
    insuranceTiers: [
      { id: "basic", name: "Standard Protection", pricePerDay: 0, deposit: 1800, deductible: 3500, desc: "Standard third-party and collision" },
      { id: "premium", name: "Premium Shield", pricePerDay: 38, deposit: 600, deductible: 600, desc: "Full collision & theft protection" },
      { id: "vip", name: "VIP Concierge Shield", pricePerDay: 70, deposit: 0, deductible: 0, desc: "Complete zero deductible & 24/7 assistance" }
    ]
  },
  {
    id: "dv-08",
    brand: "Range Rover",
    model: "Autobiography LWB",
    year: 2024,
    category: "SUV",
    tagline: "Peerless Luxury, Exquisite Refinement, and Modern Majesty",
    dailyPrice: 650,
    weeklyDiscount: 0.12,
    monthlyDiscount: 0.25,
    rating: 4.95,
    reviewsCount: 52,
    available: true,
    featured: false,
    location: "London Mayfair",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      engine: "4.4L Twin-Turbocharged V8",
      horsepower: "523 HP",
      acceleration: "4.4s (0-60 mph)",
      topSpeed: "155 mph",
      transmission: "Automatic",
      driveType: "Intelligent All-Wheel Drive",
      seats: 5,
      doors: 5,
      fuelType: "Petrol",
      fuelEconomy: "18 mpg",
      luggageCapacity: "818 Liters"
    },
    features: [
      "Executive Class Comfort-Plus Rear Seats",
      "Meridian Signature 35-Speaker Sound System",
      "Active Noise Cancellation in Headrests",
      "All-Wheel Steering (7.3m Turning Circle)",
      "Cabin Air Purification Pro",
      "Power-Assisted Gesture Doors",
      "Electronic Air Suspension with Dynamic Response"
    ],
    insuranceTiers: [
      { id: "basic", name: "Standard Protection", pricePerDay: 0, deposit: 2000, deductible: 4000, desc: "Standard statutory insurance" },
      { id: "premium", name: "Premium Shield", pricePerDay: 40, deposit: 700, deductible: 700, desc: "Comprehensive protection" },
      { id: "vip", name: "VIP Concierge Shield", pricePerDay: 75, deposit: 0, deductible: 0, desc: "Zero deductible & seamless luxury drop-off" }
    ]
  },
  {
    id: "dv-09",
    brand: "Tesla",
    model: "Model S Plaid",
    year: 2024,
    category: "Electric",
    tagline: "1,020 Horsepower of Pure Sub-2-Second Electric Acceleration",
    dailyPrice: 490,
    weeklyDiscount: 0.15,
    monthlyDiscount: 0.30,
    rating: 4.92,
    reviewsCount: 71,
    available: true,
    featured: false,
    location: "Beverly Hills",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      engine: "Tri-Motor All-Wheel Drive with Carbon Sleeves",
      horsepower: "1,020 HP",
      acceleration: "1.99s (0-60 mph)",
      topSpeed: "200 mph",
      transmission: "Single-Speed Fixed",
      driveType: "Torque Vectoring AWD",
      seats: 5,
      doors: 5,
      fuelType: "Electric",
      fuelEconomy: "396 miles range",
      luggageCapacity: "793 Liters"
    },
    features: [
      "Full Self-Driving Computer Enabled",
      "17\" Cinematic Touchscreen with 10 Teraflops Gaming",
      "Tri-Zone Climate Control with HEPA Filter",
      "22-Speaker 960W Audio with Active Noise Canceling",
      "Yoke Steering with Capacitive Touch",
      "Unlimited Supercharging Included",
      "Adaptive Suspension with Geo-Tagged Height"
    ],
    insuranceTiers: [
      { id: "basic", name: "Standard Protection", pricePerDay: 0, deposit: 1200, deductible: 2500, desc: "Standard liability and collision" },
      { id: "premium", name: "Premium Shield", pricePerDay: 30, deposit: 400, deductible: 400, desc: "Zero deductible and battery guarantee" },
      { id: "vip", name: "VIP Concierge Shield", pricePerDay: 60, deposit: 0, deductible: 0, desc: "Zero deposit with concierge delivery" }
    ]
  },
  {
    id: "dv-10",
    brand: "Bentley",
    model: "Continental GT Mulliner",
    year: 2024,
    category: "Luxury",
    tagline: "Bespoke British Craftsmanship and effortless Grand Touring Grandeur",
    dailyPrice: 1150,
    weeklyDiscount: 0.15,
    monthlyDiscount: 0.30,
    rating: 4.98,
    reviewsCount: 31,
    available: true,
    featured: false,
    location: "Paris Champs-Élysées",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      engine: "6.0L Twin-Turbo W12 TSI",
      horsepower: "650 HP",
      acceleration: "3.5s (0-60 mph)",
      topSpeed: "208 mph",
      transmission: "Dual-Clutch",
      driveType: "Active All-Wheel Drive",
      seats: 4,
      doors: 2,
      fuelType: "Petrol",
      fuelEconomy: "15 mpg",
      luggageCapacity: "358 Liters"
    },
    features: [
      "Bentley Rotating Dashboard Display",
      "Naim for Bentley 2200W 18-Speaker Audio",
      "Diamond-in-Diamond Quilting with 400,000 Stitches",
      "Bentley Dynamic Ride 48V Active Anti-Roll",
      "Breitling Clock in Handcrafted Veneer",
      "Heated, Cooled & Massage Front Armchairs"
    ],
    insuranceTiers: [
      { id: "basic", name: "Standard Protection", pricePerDay: 0, deposit: 3000, deductible: 6000, desc: "Standard statutory liability" },
      { id: "premium", name: "Premium Shield", pricePerDay: 65, deposit: 1200, deductible: 1000, desc: "Full collision & luxury excess reduction" },
      { id: "vip", name: "Royal Concierge Shield", pricePerDay: 115, deposit: 0, deductible: 0, desc: "Zero liability, white-glove check-in" }
    ]
  },
  {
    id: "dv-11",
    brand: "Aston Martin",
    model: "DBX707 Luxury Edition",
    year: 2024,
    category: "SUV",
    tagline: "The World's Most Powerful Ultra-Luxury Performance SUV",
    dailyPrice: 920,
    weeklyDiscount: 0.12,
    monthlyDiscount: 0.25,
    rating: 4.94,
    reviewsCount: 26,
    available: true,
    featured: false,
    location: "London Mayfair",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      engine: "4.0L Twin-Turbo AMG V8 with Aston Tune",
      horsepower: "697 HP (707 PS)",
      acceleration: "3.1s (0-60 mph)",
      topSpeed: "193 mph",
      transmission: "Automatic",
      driveType: "Electronic Active All-Wheel Drive",
      seats: 5,
      doors: 5,
      fuelType: "Petrol",
      fuelEconomy: "15 mpg",
      luggageCapacity: "632 Liters"
    },
    features: [
      "Wet-Clutch 9-Speed Transmission",
      "Standard Carbon Ceramic Brakes 420mm",
      "Alcantara & Semi-Aniline Duotone Leather",
      "Quad Exit Active Stainless Steel Exhaust",
      "Panoramic Glass Sunroof with Blind",
      "360 Camera with 3D Parking Visualization"
    ],
    insuranceTiers: [
      { id: "basic", name: "Standard Protection", pricePerDay: 0, deposit: 2500, deductible: 5000, desc: "Standard statutory insurance" },
      { id: "premium", name: "Premium Shield", pricePerDay: 48, deposit: 900, deductible: 900, desc: "Collision and tire coverage" },
      { id: "vip", name: "VIP Concierge Shield", pricePerDay: 90, deposit: 0, deductible: 0, desc: "0 deposit and VIP replacement vehicle" }
    ]
  },
  {
    id: "dv-12",
    brand: "Mercedes-Maybach",
    model: "S 680 4MATIC V12",
    year: 2024,
    category: "Luxury",
    tagline: "First-Class Aviation Luxury Crafted for Modern Statespersons",
    dailyPrice: 1280,
    weeklyDiscount: 0.15,
    monthlyDiscount: 0.30,
    rating: 4.99,
    reviewsCount: 38,
    available: true,
    featured: false,
    location: "Zurich Airport",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
    ],
    specs: {
      engine: "6.0L Bi-Turbo V12 Handcrafted",
      horsepower: "621 HP",
      acceleration: "4.4s (0-60 mph)",
      topSpeed: "155 mph",
      transmission: "Automatic",
      driveType: "Intelligent All-Wheel Drive",
      seats: 4,
      doors: 4,
      fuelType: "Petrol (Premium)",
      fuelEconomy: "14 mpg",
      luggageCapacity: "505 Liters"
    },
    features: [
      "Rear Executive Reclining Calf-Rest Seats (43.5°)",
      "Burmester High-End 4D Surround Sound 1750W",
      "Electrically Powered Comfort Rear Doors",
      "Refrigerated Compartment with Silver Flutes",
      "Active Road Noise Compensation",
      "E-Active Body Control Predictive Suspension"
    ],
    insuranceTiers: [
      { id: "basic", name: "Standard Protection", pricePerDay: 0, deposit: 3500, deductible: 7000, desc: "Standard statutory insurance" },
      { id: "premium", name: "Premium Shield", pricePerDay: 70, deposit: 1200, deductible: 1000, desc: "Comprehensive luxury protection" },
      { id: "vip", name: "Royal Concierge Shield", pricePerDay: 120, deposit: 0, deductible: 0, desc: "Zero liability, private chauffeur options" }
    ]
  }
];

const LOCATIONS = [
  {
    id: "loc-01",
    city: "Beverly Hills",
    country: "USA",
    tag: "Flagship Hub",
    address: "9601 Wilshire Blvd, Beverly Hills, CA 90212",
    phone: "+1 (310) 555-0199",
    hours: "Open 24/7 - Valet & Concierge",
    availableVehicles: 28,
    lat: 34.067,
    lng: -118.401,
    image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "loc-02",
    city: "Manhattan NYC",
    country: "USA",
    tag: "Private Lounge",
    address: "432 Park Ave, New York, NY 10022",
    phone: "+1 (212) 555-0842",
    hours: "06:00 AM - 11:30 PM (24/7 Drop-off)",
    availableVehicles: 22,
    lat: 40.761,
    lng: -73.971,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "loc-03",
    city: "Miami Beach",
    country: "USA",
    tag: "South Beach Club",
    address: "1100 Ocean Drive, Miami Beach, FL 33139",
    phone: "+1 (305) 555-0721",
    hours: "Open 24/7 - Beachfront Valet",
    availableVehicles: 34,
    lat: 25.782,
    lng: -80.130,
    image: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "loc-04",
    city: "Dubai Marina",
    country: "UAE",
    tag: "VIP Terminal",
    address: "Al Marsa St, Dubai Marina, Dubai, UAE",
    phone: "+971 4 555 3820",
    hours: "Open 24/7 - Chauffeur & Yacht Transfer",
    availableVehicles: 45,
    lat: 25.077,
    lng: 55.139,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "loc-05",
    city: "London Mayfair",
    country: "UK",
    tag: "Heritage Lounge",
    address: "14 Berkeley Square, London W1J 6BQ",
    phone: "+44 20 7946 0912",
    hours: "07:00 AM - 11:00 PM",
    availableVehicles: 19,
    lat: 51.509,
    lng: -0.146,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "loc-06",
    city: "Zurich Airport",
    country: "Switzerland",
    tag: "Alpine Hub",
    address: "Flughafenstrasse, 8058 Zürich-Flughafen",
    phone: "+41 44 800 2310",
    hours: "Open 24/7 - Private Jetside Delivery",
    availableVehicles: 16,
    lat: 47.458,
    lng: 8.555,
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "loc-07",
    city: "Paris Champs-Élysées",
    country: "France",
    tag: "Palais Lounge",
    address: "68 Avenue des Champs-Élysées, 75008 Paris",
    phone: "+33 1 42 68 55 00",
    hours: "08:00 AM - 10:00 PM",
    availableVehicles: 20,
    lat: 48.871,
    lng: 2.308,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "loc-08",
    city: "Munich Center",
    country: "Germany",
    tag: "Autobahn Hub",
    address: "Maximilianstraße 17, 80539 München",
    phone: "+49 89 2109 4500",
    hours: "07:00 AM - Midnight",
    availableVehicles: 24,
    lat: 48.139,
    lng: 11.583,
    image: "https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=600&q=80"
  }
];

const SPECIAL_OFFERS = [
  {
    id: "off-01",
    code: "WEEKEND20",
    title: "Weekend Escape",
    discount: "20% OFF",
    type: "percentage",
    value: 0.20,
    minDays: 2,
    badge: "Most Popular",
    description: "Enjoy an exhilarating weekend getaway with 20% savings on sports and luxury convertibles.",
    expiryDate: "Valid through Nov 30, 2026",
    applicableCategories: ["Sports", "Luxury"]
  },
  {
    id: "off-02",
    code: "LUXURY150",
    title: "Presidential Upgrade Credit",
    discount: "$150 OFF",
    type: "fixed",
    value: 150,
    minDays: 3,
    badge: "VIP Exclusive",
    description: "Direct $150 credit on our executive V12 flagships: Rolls-Royce Ghost, Bentley Mulliner, or Maybach.",
    expiryDate: "Limited availability",
    applicableCategories: ["Luxury", "SUV"]
  },
  {
    id: "off-03",
    code: "LONGDRIVE30",
    title: "Grand Tour Long-Term",
    discount: "30% OFF",
    type: "percentage",
    value: 0.30,
    minDays: 7,
    badge: "Best Value",
    description: "Book any premium vehicle for 7 days or more and unlock our exclusive 30% extended journey rate.",
    expiryDate: "Continuous offer",
    applicableCategories: ["All"]
  }
];

const REVIEWS = [
  {
    id: "rev-01",
    name: "Jonathan Vance",
    role: "Private Equity Partner",
    location: "New York",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    car: "Rolls-Royce Ghost Series II",
    date: "August 2026",
    comment: "The white-glove delivery to our private hangar at Teterboro was seamless. The Ghost was pristine, silent, and effortlessly elevated our investor summit."
  },
  {
    id: "rev-02",
    name: "Elena Rostova",
    role: "Architectural Director",
    location: "Zurich",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    car: "Porsche 911 GT3 RS",
    date: "July 2026",
    comment: "Rented the GT3 RS for a weekend drive across the Swiss Gotthard Pass. Mechanically immaculate and the instant booking process was smoother than any concierge app I've used."
  },
  {
    id: "rev-03",
    name: "Marcus Sterling",
    role: "Tech Entrepreneur",
    location: "Miami Beach",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    car: "Lamborghini Urus Performante",
    date: "August 2026",
    comment: "DriveVault understands what high-end clients expect: zero hidden charges, prompt delivery right to the hotel valet, and an exhaust note that turns every head on Ocean Drive."
  },
  {
    id: "rev-04",
    name: "Sophia Al-Maktoum",
    role: "Fashion Executive",
    location: "Dubai",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    car: "Audi RS e-tron GT",
    date: "June 2026",
    comment: "The quiet luxury of the RS e-tron GT paired with complimentary charging across UAE hubs made this our best travel decision. Customer service was 24/7 on WhatsApp."
  }
];

const FAQ_ITEMS = [
  {
    id: "faq-01",
    question: "What are the age and license requirements to rent from DriveVault?",
    answer: "The primary driver must be at least 21 years of age for sports and executive sedans, and 25 years of age for select high-performance supercars (e.g. GT3 RS, Roma Spider, Urus). A valid driver's license held for at least one year and an international driving permit (if your license is non-Roman alphabet) are required."
  },
  {
    id: "faq-02",
    question: "How does DriveVault's security deposit and insurance work?",
    answer: "We offer transparent, upfront tiers. Our VIP Concierge Shield waives deposits completely with $0 deductible. If you select Standard Protection, an authorization hold is placed on your card at pickup and released immediately upon vehicle return inspection."
  },
  {
    id: "faq-03",
    question: "Can I receive the car delivered to my airport or private residence?",
    answer: "Yes. We provide door-to-door concierge delivery to any hotel, private residence, commercial airport terminal, or FBO private jet center within a 50-mile radius of any DriveVault location. Simply choose your drop-off coordinates during step 2 of booking."
  },
  {
    id: "faq-04",
    question: "What is your cancellation policy?",
    answer: "We believe in complete flexibility. All bookings can be cancelled or rescheduled with 100% full refund up to 24 hours prior to scheduled delivery. Changes requested within 24 hours receive full rental credit with no expiry."
  },
  {
    id: "faq-05",
    question: "Are mileage limits applied to the vehicles?",
    answer: "Standard rentals include 150 complimentary miles per day (cumulative over your trip). Unlimited mileage packages can be easily added during the Extras step of the booking wizard for complete freedom."
  },
  {
    id: "faq-06",
    question: "Can I add an additional driver or child safety seat?",
    answer: "Absolutely. Step 3 of our booking wizard allows you to seamlessly configure verified additional drivers, child or booster seats, onboard Wi-Fi hotspots, and roadside concierge assistance."
  }
];

const SAMPLE_BOOKINGS = [
  {
    id: "DV-BOK-98214",
    vehicleId: "dv-01",
    carName: "Porsche 911 GT3 RS",
    carImage: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80",
    pickupLocation: "Beverly Hills",
    dropoffLocation: "Beverly Hills",
    pickupDate: "2026-09-15",
    pickupTime: "10:00 AM",
    dropoffDate: "2026-09-18",
    dropoffTime: "04:00 PM",
    days: 3,
    dailyPrice: 850,
    baseTotal: 2550,
    extrasTotal: 135,
    insuranceTotal: 135,
    serviceFee: 153,
    discount: 510,
    grandTotal: 2463,
    status: "Upcoming",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@drivevault.com",
    customerPhone: "+1 (310) 902-8811",
    createdAt: "2026-09-01T14:20:00Z"
  },
  {
    id: "DV-BOK-87123",
    vehicleId: "dv-02",
    carName: "Mercedes-AMG G63",
    carImage: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=600&q=80",
    pickupLocation: "Miami Beach",
    dropoffLocation: "Miami Beach",
    pickupDate: "2026-08-20",
    pickupTime: "11:00 AM",
    dropoffDate: "2026-08-24",
    dropoffTime: "02:00 PM",
    days: 4,
    dailyPrice: 790,
    baseTotal: 3160,
    extrasTotal: 80,
    insuranceTotal: 160,
    serviceFee: 189,
    discount: 0,
    grandTotal: 3589,
    status: "Completed",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@drivevault.com",
    customerPhone: "+1 (310) 902-8811",
    createdAt: "2026-08-15T09:12:00Z"
  }
];

const INITIAL_EXTRAS = [
  { id: "extra-driver", name: "Additional Verified Driver", pricePerDay: 18, icon: "user-plus", desc: "Allow an additional registered companion to pilot the vehicle" },
  { id: "extra-gps", name: "Satellite Nav & Live Radar Alert", pricePerDay: 12, icon: "navigation", desc: "Real-time traffic evasion and live speed trap radar telemetry" },
  { id: "extra-childseat", name: "Executive Child Safety Seat", pricePerDay: 15, icon: "shield", desc: "ECE R129 ISOFIX approved plush leather infant/child seat" },
  { id: "extra-wifi", name: "High-Speed Starlink Mobile Wi-Fi", pricePerDay: 14, icon: "wifi", desc: "5G ultra-low latency mobile hotspot for all passenger devices" },
  { id: "extra-roadside", name: "24/7 Roadside Concierge & Tow", pricePerDay: 20, icon: "tool", desc: "Instant flat-bed dispatch, flat tire replacement, and fuel delivery" }
];
