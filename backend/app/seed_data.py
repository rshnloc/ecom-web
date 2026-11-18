import json
import hashlib
from .database import get_db

def hash_password(password: str) -> str:
    # Deterministic test-only hash for synthetic local accounts
    return hashlib.sha256(f"test_salt_{password}".encode()).hexdigest()

SAMPLE_CATEGORIES = [
    {
        "name": "Audio & Electronics",
        "slug": "audio-electronics",
        "description": "High-fidelity wireless sound, studio monitors, and smart audio devices.",
        "icon": "Headphones"
    },
    {
        "name": "Computing & Gaming",
        "slug": "computing-gaming",
        "description": "Ergonomic mechanical keyboards, precision mice, and ultra-wide displays.",
        "icon": "Laptop"
    },
    {
        "name": "Smart Living",
        "slug": "smart-living",
        "description": "Connected ambient lighting, intelligent purifiers, and home automation.",
        "icon": "Home"
    },
    {
        "name": "Apparel & Everyday Carry",
        "slug": "apparel-edc",
        "description": "Minimalist weatherproof packs, premium thermal layers, and everyday gear.",
        "icon": "ShoppingBag"
    },
    {
        "name": "Workstation & Desk",
        "slug": "workstation-desk",
        "description": "Solid walnut stands, magnetic cable systems, and productivity essentials.",
        "icon": "Monitor"
    }
]

SAMPLE_PRODUCTS = [
    {
        "name": "Aura Pro Wireless ANC Headphones",
        "slug": "aura-pro-wireless-anc-headphones",
        "category": "Audio & Electronics",
        "brand": "AuraSound",
        "price": 249.99,
        "original_price": 299.99,
        "stock": 35,
        "rating": 4.9,
        "review_count": 128,
        "description": "Flagship hybrid active noise cancelling over-ear headphones with 40mm titanium drivers and 45-hour battery life.",
        "long_description": "Designed for pure acoustic clarity and long-session comfort. The Aura Pro combines custom 40mm titanium drivers, adaptive dual-mic noise cancelling, multi-point Bluetooth 5.3 connectivity, and memory-foam earcups wrapped in supple vegan leather. Supports spatial audio tracking and ultra-low latency gaming mode.",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
        ],
        "features": [
            "Hybrid Active Noise Cancellation with Transparency Mode",
            "Custom 40mm Titanium Drivers for deep bass and crisp highs",
            "45 Hours of continuous playback on a single charge",
            "USB-C Quick Charge: 10 minutes gives 5 hours playback",
            "Seamless multi-device Bluetooth 5.3 pairing"
        ],
        "specs": {
            "Driver Size": "40mm Titanium",
            "Battery Life": "45 Hours (ANC On)",
            "Bluetooth": "Version 5.3 aptX HD",
            "Weight": "250g",
            "Warranty": "2 Years Limited"
        },
        "is_featured": 1,
        "is_new": 1
    },
    {
        "name": "Apex Pro Custom Mechanical Keyboard",
        "slug": "apex-pro-custom-mechanical-keyboard",
        "category": "Computing & Gaming",
        "brand": "ApexLab",
        "price": 179.99,
        "original_price": 210.00,
        "stock": 22,
        "rating": 4.8,
        "review_count": 94,
        "description": "75% gasket-mounted hot-swappable keyboard with lubricated tactile switches and sound-dampening foam.",
        "long_description": "Crafted from CNC machined anodized aluminum, the Apex Pro offers an unmatched acoustic profile and typing feel. Featuring hot-swappable sockets, south-facing RGB backlighting, custom PBT dye-sub keycaps, and support for QMK/VIA programmable layers.",
        "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80"
        ],
        "features": [
            "Gasket-mounted structure for cushioned, flexible typing feel",
            "Pre-lubricated tactile linear switches for silky keystrokes",
            "Hot-swappable PCB supports 3-pin and 5-pin MX switches",
            "Per-key south-facing RGB with 18 dynamic lighting modes",
            "Detachable braided USB-C cable and wireless 2.4GHz dongle"
        ],
        "specs": {
            "Layout": "75% Compact (82 Keys)",
            "Switch Type": "Pre-lubed Tactile Panda 55g",
            "Connectivity": "Tri-mode (USB-C, 2.4GHz, Bluetooth 5.1)",
            "Battery": "4000mAh Li-Po",
            "Case Material": "CNC Anodized 6063 Aluminum"
        },
        "is_featured": 1,
        "is_new": 0
    },
    {
        "name": "Nova 4K Ultra-Wide 34-inch Curved Display",
        "slug": "nova-4k-ultrawide-34-inch-curved-display",
        "category": "Workstation & Desk",
        "brand": "NovaTech",
        "price": 649.00,
        "original_price": 749.00,
        "stock": 14,
        "rating": 4.7,
        "review_count": 63,
        "description": "34-inch 144Hz WQHD curved IPS monitor with 98% DCI-P3 color accuracy and 90W USB-C single cable docking.",
        "long_description": "Transform your productivity and immersive creative workflow. The Nova 34-inch display boasts 3440x1440 resolution, 1900R subtle curvature, HDR400 certification, and built-in KVM switch to control two computers with one keyboard and mouse.",
        "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80"
        ],
        "features": [
            "3440 x 1440 WQHD resolution with 21:9 panoramic field of view",
            "144Hz refresh rate with AMD FreeSync Premium Pro",
            "90W Power Delivery over USB-C: charge your laptop while driving the display",
            "Factory calibrated Delta E < 2 for accurate design and video work",
            "Built-in dual 7W stereo speakers and headphone jack"
        ],
        "specs": {
            "Screen Size": "34-inch Ultrawide 21:9",
            "Panel": "Nano IPS Curved 1900R",
            "Refresh Rate": "144Hz (1ms GtG)",
            "Ports": "1x USB-C 90W, 2x HDMI 2.1, 1x DP 1.4, 4x USB 3.2",
            "VESA Mount": "100x100mm Compatible"
        },
        "is_featured": 1,
        "is_new": 1
    },
    {
        "name": "Zenith Pulse Smart Health & GPS Watch",
        "slug": "zenith-pulse-smart-health-gps-watch",
        "category": "Audio & Electronics",
        "brand": "Zenith",
        "price": 199.50,
        "original_price": 229.00,
        "stock": 40,
        "rating": 4.6,
        "review_count": 87,
        "description": "Ultra-lightweight aerospace titanium smartwatch with AMOLED display, 14-day battery, and multi-band GPS.",
        "long_description": "Stay tuned to your vitals and athletic performance. Zenith Pulse delivers continuous heart rate, SpO2 blood oxygen, HRV stress monitoring, and over 120 sports tracking modes. Waterproof up to 50 meters with customizable always-on watch faces.",
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80"
        ],
        "features": [
            "1.43-inch Always-On Sapphire AMOLED display (1000 nits)",
            "Dual-frequency GNSS positioning for precise running routes",
            "14 Days typical battery life on a single 45-minute charge",
            "Sleep staging analysis and VO2 Max fitness tracking",
            "5 ATM water resistance rated for swimming"
        ],
        "specs": {
            "Display": "1.43\" AMOLED 466x466 px",
            "Bezel Material": "Grade 5 Titanium Alloy",
            "Sensors": "Optical Biometric 6.0, 3-Axis Gyro, Barometer",
            "Battery": "14 Days Typical, 36 Hours Full GPS",
            "Water Rating": "50m (5 ATM)"
        },
        "is_featured": 1,
        "is_new": 0
    },
    {
        "name": "Urban Vibe Modular Weatherproof Backpack",
        "slug": "urban-vibe-modular-weatherproof-backpack",
        "category": "Apparel & Everyday Carry",
        "brand": "UrbanVibe",
        "price": 129.00,
        "original_price": 159.00,
        "stock": 28,
        "rating": 4.8,
        "review_count": 52,
        "description": "24L expandable waterproof commuter backpack with padded 16-inch laptop chamber and magnetic Fidlock buckles.",
        "long_description": "Built for modern commuters, creators, and travelers. Made with rugged recycled 840D Cordura ballistic nylon and YKK AquaGuard waterproof zippers. Features an ergonomic airflow back panel, hidden passport security pocket, and luggage pass-through strap.",
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80"
        ],
        "features": [
            "Suspended false-bottom compartment fits up to 16-inch laptops",
            "Waterproof Cordura ballistic nylon fabric resists tears and downpours",
            "Magnetic German Fidlock closures for instant one-handed opening",
            "Expandable volume from 20L to 26L for weekend getaways",
            "Luggage trolley strap and discrete RFID-blocking pocket"
        ],
        "specs": {
            "Capacity": "20L - 26L Expandable",
            "Dimensions": "48 x 30 x 16 cm",
            "Weight": "1.1 kg",
            "Material": "840D Recycled Nylon Cordura",
            "Laptop Fit": "Up to 16\" MacBook Pro"
        },
        "is_featured": 0,
        "is_new": 1
    },
    {
        "name": "Lumina Smart Ambient Desk Bar Light",
        "slug": "lumina-smart-ambient-desk-bar-light",
        "category": "Workstation & Desk",
        "brand": "LuminaCraft",
        "price": 89.99,
        "original_price": 109.99,
        "stock": 19,
        "rating": 4.7,
        "review_count": 41,
        "description": "Zero-glare asymmetrical monitor screen bar with auto-dimming ambient sensor and wireless rotary dial controller.",
        "long_description": "Relieve eye strain and elevate your desk aesthetics. Lumina mounts securely to curved or flat monitors without occupying any desktop space. Features Ra95 high CRI natural lighting, stepless color temperature adjustment (2700K - 6500K), and front/back dual illumination.",
        "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
        ],
        "features": [
            "Asymmetrical optical design illuminates desk with zero screen reflection",
            "Independent 2.4GHz wireless metal rotary remote control",
            "Dual-source lighting: front task light and rear ambient back-glow",
            "CRI Ra95 color reproduction for true-to-life screen color viewing",
            "USB-C powered directly from computer or wall adapter"
        ],
        "specs": {
            "Color Temp": "2700K - 6500K Stepless",
            "Brightness": "Max 500 Lux at 45cm",
            "Input": "5V 2A USB-C",
            "Compatibility": "Flat and curved monitors 10mm - 45mm thickness",
            "Material": "Sandblasted Aluminum Alloy"
        },
        "is_featured": 0,
        "is_new": 0
    },
    {
        "name": "AromaCraft Precision Conical Burr Coffee Grinder",
        "slug": "aromacraft-precision-conical-burr-coffee-grinder",
        "category": "Smart Living",
        "brand": "AromaCraft",
        "price": 159.00,
        "original_price": 189.00,
        "stock": 15,
        "rating": 4.9,
        "review_count": 78,
        "description": "Stepless 48mm stainless steel burrs with anti-static ionizer and micro-precision single-dose dosing.",
        "long_description": "Engineered for espresso connoisseurs and pour-over enthusiasts alike. Low-RPM DC motor ensures uniform particle size without heating your beans. Virtually zero grind retention with magnetic chute and integrated bellows.",
        "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
        ],
        "features": [
            "48mm commercial-grade CNC high-nitrogen stainless steel burrs",
            "Stepless micrometric adjustment for espresso to cold brew",
            "Plasma ion generator eliminates static cling and mess",
            "Low grind retention (< 0.1g) for single dosing freshness",
            "Whisper-quiet low-RPM motor prevents heat transfer to coffee oils"
        ],
        "specs": {
            "Burr Type": "48mm Conical High-Nitrogen Steel",
            "Hopper Capacity": "40g Single Dose Bellows",
            "Motor": "150W DC Motor @ 800 RPM",
            "Dimensions": "19 x 12 x 28 cm",
            "Weight": "3.4 kg"
        },
        "is_featured": 1,
        "is_new": 1
    },
    {
        "name": "HyperCharge 120W GaN Desktop Charging Hub",
        "slug": "hypercharge-120w-gan-desktop-charging-hub",
        "category": "Audio & Electronics",
        "brand": "NovaTech",
        "price": 79.99,
        "original_price": 99.00,
        "stock": 50,
        "rating": 4.8,
        "review_count": 69,
        "description": "Compact 4-port Gallium Nitride fast charger capable of simultaneously powering two laptops and two phones.",
        "long_description": "Declutter your workspace with next-generation GaN III semiconductor efficiency. Intelligently allocates power across 3 USB-C and 1 USB-A port with active thermal monitoring to ensure cool, stable operation under heavy load.",
        "image_url": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"
        ],
        "features": [
            "GaN III technology offers 45% smaller form factor with superior efficiency",
            "Single USB-C output up to 100W PD 3.0 / PPS",
            "Charge 4 devices simultaneously with intelligent power allocation",
            "Multi-protection system protects against over-voltage, short-circuit, and overheating",
            "Includes 5ft AC power cord and desktop standing dock"
        ],
        "specs": {
            "Total Power": "120W Max",
            "Ports": "3x USB-C PD 3.0, 1x USB-A QC 4.0",
            "Weight": "280g",
            "Certification": "CE, FCC, RoHS, UL",
            "Input Voltage": "100-240V 50/60Hz (Worldwide)"
        },
        "is_featured": 0,
        "is_new": 0
    },
    {
        "name": "PureAir Smart True HEPA Room Purifier",
        "slug": "pureair-smart-true-hepa-room-purifier",
        "category": "Smart Living",
        "brand": "LuminaCraft",
        "price": 149.00,
        "original_price": 179.00,
        "stock": 18,
        "rating": 4.6,
        "review_count": 35,
        "description": "3-stage filtration capturing 99.97% of airborne particles with laser PM2.5 real-time air quality display.",
        "long_description": "Circulate crisp, mountain-fresh air in rooms up to 500 sq ft. The PureAir features an H13 medical-grade True HEPA filter and activated carbon honeycomb layer to trap allergens, dust, smoke, pet dander, and odors silently.",
        "image_url": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80"
        ],
        "features": [
            "H13 Medical Grade True HEPA filter + granular carbon air cleaning",
            "Laser PM2.5 sensor with 3-color ambient air health indicator ring",
            "Ultra-silent Sleep Mode at only 22dB sound level",
            "Covers up to 500 sq ft with 360-degree air intake design",
            "Smart timer (2h/4h/8h) and filter replacement reminder"
        ],
        "specs": {
            "CADR": "300 m³/h",
            "Room Coverage": "Up to 500 sq ft (46 m²)",
            "Noise Level": "22 dB - 52 dB",
            "Power Consumption": "32W",
            "Dimensions": "22 x 22 x 38 cm"
        },
        "is_featured": 0,
        "is_new": 1
    },
    {
        "name": "Solid Walnut & Aluminum Ergonomic Desk Shelf",
        "slug": "solid-walnut-aluminum-ergonomic-desk-shelf",
        "category": "Workstation & Desk",
        "brand": "ApexLab",
        "price": 135.00,
        "original_price": 160.00,
        "stock": 12,
        "rating": 4.9,
        "review_count": 56,
        "description": "Handcrafted sustainable American walnut monitor riser with anodized matte aluminum legs and felt storage tray.",
        "long_description": "Elevate your screens to ergonomic eye level while tripling your usable desk real estate. Precision CNC carved from sustainably harvested solid American walnut with durable chamfered edges and heavy matte black aluminum supports.",
        "image_url": "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80"
        ],
        "features": [
            "Hand-finished 100% solid natural American walnut wood",
            "Elevates screens 11cm to relieve neck and spinal tension",
            "Houses full-sized keyboards and laptops cleanly underneath",
            "Supports dual monitor setups up to 45kg load weight",
            "Soft cork feet protect your desktop surface from scratches"
        ],
        "specs": {
            "Length": "115 cm",
            "Width": "23 cm",
            "Height": "11 cm",
            "Max Weight Capacity": "45 kg",
            "Materials": "American Walnut, Anodized Aluminum, Cork"
        },
        "is_featured": 1,
        "is_new": 0
    },
    {
        "name": "HydroShield 32oz Insulated Steel Flask",
        "slug": "hydroshield-32oz-insulated-steel-flask",
        "category": "Apparel & Everyday Carry",
        "brand": "UrbanVibe",
        "price": 38.00,
        "original_price": 45.00,
        "stock": 65,
        "rating": 4.8,
        "review_count": 112,
        "description": "Double-wall vacuum insulated stainless flask keeping liquids iced for 24 hours or steaming hot for 12 hours.",
        "long_description": "Engineered for adventures and daily hydration. Made with food-grade 18/8 pro stainless steel that never transfers metallic tastes. Features a powder-coat sweat-free grip, wide-mouth ice filler, and leakproof magnetic straw lid.",
        "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"
        ],
        "features": [
            "TempLock double-wall vacuum insulation maintains icy chill for 24h",
            "18/8 food-grade pro stainless steel construction",
            "BPA-free leakproof chug lid with comfortable carry loop",
            "Durable powder coat finish won't peel, sweat, or slip",
            "Fits car cup holders and standard backpack water pockets"
        ],
        "specs": {
            "Volume": "32 oz (950 ml)",
            "Weight": "420g",
            "Insulation": "Double-wall vacuum",
            "Dishwasher Safe": "Top rack safe",
            "Colors Available": "Matte Slate, Forest Green, Sandstone"
        },
        "is_featured": 0,
        "is_new": 0
    },
    {
        "name": "Merino Tech Everyday Minimalist Hoodie",
        "slug": "merino-tech-everyday-minimalist-hoodie",
        "category": "Apparel & Everyday Carry",
        "brand": "UrbanVibe",
        "price": 110.00,
        "original_price": 130.00,
        "stock": 25,
        "rating": 4.7,
        "review_count": 39,
        "description": "100% superfine 18.5-micron Australian merino wool hoodie with natural odor resistance and thermoregulation.",
        "long_description": "The ultimate layer for traveling, working from home, and exploring the outdoors. Naturally breathable, anti-odor, temperature regulating, and cloud-soft against the skin. Features thumbholes in cuffs, tailored athletic silhouette, and hidden zip key pouch.",
        "image_url": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
        ],
        "features": [
            "100% natural superfine 18.5-micron Australian merino wool",
            "Naturally moisture wicking and odor neutralizing for multiple wears",
            "Optimal 260 gsm fabric weight for all-season layering",
            "Flatlock seams eliminate friction and chafing",
            "Concealed side zipper pocket for cards and keys"
        ],
        "specs": {
            "Material": "100% Merino Wool (260 gsm)",
            "Fit": "Modern Tailored Regular",
            "Care": "Machine wash cold gentle, lay flat to dry",
            "Origin": "Ethically milled in New Zealand"
        },
        "is_featured": 0,
        "is_new": 1
    }
]

SAMPLE_REVIEWS = [
    {
        "product_slug": "aura-pro-wireless-anc-headphones",
        "user_name": "Alex T.",
        "rating": 5,
        "comment": "The noise cancellation is astonishing! Comparable to headphones twice this price. Battery life easily lasts me a full week of remote work.",
        "verified_purchase": 1
    },
    {
        "product_slug": "aura-pro-wireless-anc-headphones",
        "user_name": "Jordan M.",
        "rating": 5,
        "comment": "Spatial audio tracking makes gaming and watching movies feel like I'm in a home theater. Very lightweight and comfortable.",
        "verified_purchase": 1
    },
    {
        "product_slug": "apex-pro-custom-mechanical-keyboard",
        "user_name": "Sam R.",
        "rating": 5,
        "comment": "The thock on these pre-lubed switches is unreal. Zero hollow ping noise thanks to the gasket mount and silicone dampener.",
        "verified_purchase": 1
    },
    {
        "product_slug": "apex-pro-custom-mechanical-keyboard",
        "user_name": "Casey W.",
        "rating": 4,
        "comment": "Fantastic keyboard. Software setup was instant via VIA in the browser. Wireless connection has been rock solid.",
        "verified_purchase": 1
    },
    {
        "product_slug": "nova-4k-ultrawide-34-inch-curved-display",
        "user_name": "Morgan D.",
        "rating": 5,
        "comment": "Single cable USB-C docking with 90W power delivery transformed my messy desk. Color grading video on this panel looks phenomenal.",
        "verified_purchase": 1
    },
    {
        "product_slug": "aromacraft-precision-conical-burr-coffee-grinder",
        "user_name": "Taylor P.",
        "rating": 5,
        "comment": "Fluffy, clumpless grinds every single morning. The anti-static ionizer actually works—zero mess on the counter!",
        "verified_purchase": 1
    }
]

SAMPLE_COUPONS = [
    {"code": "SAVE10", "discount_type": "percent", "discount_value": 10.0, "min_order": 50.0},
    {"code": "TEST20", "discount_type": "percent", "discount_value": 20.0, "min_order": 100.0},
    {"code": "FLAT50", "discount_type": "fixed", "discount_value": 50.0, "min_order": 200.0},
    {"code": "FREESHIP", "discount_type": "fixed", "discount_value": 15.0, "min_order": 40.0}
]

# Strictly synthetic demo accounts (No real PII or live credentials)
SAMPLE_USERS = [
    {
        "username": "democustomer",
        "email": "testcustomer@example.com",
        "full_name": "Alice Demo",
        "password_hash": hash_password("demo1234"),
        "role": "customer"
    },
    {
        "username": "demoadmin",
        "email": "testadmin@example.com",
        "full_name": "Admin Tester",
        "password_hash": hash_password("admin1234"),
        "role": "admin"
    }
]

def seed_database():
    with get_db() as conn:
        cursor = conn.cursor()

        # Check if already seeded
        cursor.execute("SELECT COUNT(*) FROM products")
        if cursor.fetchone()[0] > 0:
            return # Already seeded

        # Insert categories
        for cat in SAMPLE_CATEGORIES:
            cursor.execute("""
                INSERT INTO categories (name, slug, description, icon, item_count)
                VALUES (?, ?, ?, ?, ?)
            """, (cat["name"], cat["slug"], cat["description"], cat["icon"], 0))

        # Insert products
        slug_to_id = {}
        for p in SAMPLE_PRODUCTS:
            cursor.execute("""
                INSERT INTO products (
                    name, slug, category, brand, price, original_price, stock,
                    rating, review_count, description, long_description,
                    image_url, gallery, features, specs, is_featured, is_new
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p["name"], p["slug"], p["category"], p["brand"], p["price"],
                p["original_price"], p["stock"], p["rating"], p["review_count"],
                p["description"], p["long_description"], p["image_url"],
                json.dumps(p["gallery"]), json.dumps(p["features"]),
                json.dumps(p["specs"]), p["is_featured"], p["is_new"]
            ))
            product_id = cursor.lastrowid
            slug_to_id[p["slug"]] = product_id

        # Update category item counts
        cursor.execute("""
            UPDATE categories
            SET item_count = (
                SELECT COUNT(*) FROM products WHERE products.category = categories.name
            )
        """)

        # Insert reviews
        for r in SAMPLE_REVIEWS:
            pid = slug_to_id.get(r["product_slug"])
            if pid:
                cursor.execute("""
                    INSERT INTO reviews (product_id, user_name, rating, comment, verified_purchase)
                    VALUES (?, ?, ?, ?, ?)
                """, (pid, r["user_name"], r["rating"], r["comment"], r["verified_purchase"]))

        # Insert coupons
        for c in SAMPLE_COUPONS:
            cursor.execute("""
                INSERT INTO coupons (code, discount_type, discount_value, min_order, is_active)
                VALUES (?, ?, ?, ?, 1)
            """, (c["code"], c["discount_type"], c["discount_value"], c["min_order"]))

        # Insert users
        for u in SAMPLE_USERS:
            cursor.execute("""
                INSERT INTO users (username, email, full_name, password_hash, role)
                VALUES (?, ?, ?, ?, ?)
            """, (u["username"], u["email"], u["full_name"], u["password_hash"], u["role"]))

        # Insert an initial synthetic test order
        sample_order_items = [
            {
                "product_id": slug_to_id["aura-pro-wireless-anc-headphones"],
                "name": "Aura Pro Wireless ANC Headphones",
                "price": 249.99,
                "quantity": 1,
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
            }
        ]
        sample_address = {
            "full_name": "Alice Demo",
            "address_line": "123 Innovation Way, Suite 400",
            "city": "Metropolis",
            "state": "CA",
            "postal_code": "94016",
            "country": "United States",
            "phone": "+1-555-0199"
        }
        cursor.execute("""
            INSERT INTO orders (
                order_number, user_id, customer_name, customer_email,
                shipping_address, items, subtotal, discount, shipping_fee, tax,
                total, payment_method, payment_status, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "ORD-TEST-9021", 1, "Alice Demo", "testcustomer@example.com",
            json.dumps(sample_address), json.dumps(sample_order_items),
            249.99, 25.00, 0.0, 18.00, 242.99,
            "Mock Credit Card (ends in 4242)", "paid", "Processing"
        ))

        conn.commit()
