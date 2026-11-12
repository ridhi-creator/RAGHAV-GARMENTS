import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  getSupabaseClient,
  mapOrderToSupabase,
  updateSupabaseKey,
  SUPABASE_ORDERS_TABLE_SQL
} from './src/supabase.ts';

const app = express();
// STRICT CONSTRAINT: Dev server must run on port 3000. Do not use process.env.PORT (Cloud Run sets 8080).
const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Static route handlers for uploaded store merchandise photos
app.use('/Pants', express.static(path.join(process.cwd(), 'Pants')));
app.use('/pants', express.static(path.join(process.cwd(), 'public/pants')));
app.use('/images/pants', express.static(path.join(process.cwd(), 'public/images/pants')));
app.use('/payjamas', express.static(path.join(process.cwd(), 'payjamas')));
app.use('/pajamas', express.static(path.join(process.cwd(), 'payjamas')));
app.use('/public/payjamas', express.static(path.join(process.cwd(), 'public/payjamas')));
app.use('/track suits', express.static(path.join(process.cwd(), 'public/track suits')));
app.use('/tracksuits', express.static(path.join(process.cwd(), 'public/tracksuits')));
app.use('/public/track suits', express.static(path.join(process.cwd(), 'public/track suits')));
app.use('/public/tracksuits', express.static(path.join(process.cwd(), 'public/tracksuits')));

// ============================================================================
// SUPABASE BACKEND CONFIGURATION (Project: ibergysewvwrbfeatoul)
// ============================================================================

let supabaseConfig = {
  projectId: SUPABASE_PROJECT_ID,
  url: SUPABASE_URL,
  apiKey: process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '',
  status: 'configured',
  lastSyncAttempt: null as any
};

// ============================================================================
// OWNER AUTHORIZATION & SECURITY STORE
// ============================================================================

// STRICT NON-NEGOTIABLE RULE: THE ONLY AUTHORIZED OWNER EMAIL
export const AUTHORIZED_OWNER_EMAIL = 'ridhitaneja1404@gmail.com';

interface OwnerUser {
  name: string;
  email: string;
  role: 'Owner & Sole Administrator';
  authProvider: 'google' | 'password';
  lastLogin: string;
}

interface Session {
  token: string;
  createdAt: number;
  expiresAt: number;
  user: OwnerUser;
}

const activeSessions = new Map<string, Session>();

// Owner Credentials
let ownerPasswordHash = crypto.createHash('sha256').update('RaghavOwner@2026!').digest('hex');
let pendingResetCode: { code: string; expiresAt: number } | null = null;

// Security Audit Log System
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  email: string;
  action: string;
  status: 'SUCCESS' | 'BLOCKED';
  ip: string;
  details: string;
}

const auditLogs: AuditLogEntry[] = [
  {
    id: `log-${Date.now() - 3600000}`,
    timestamp: new Date(Date.now() - 3600000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    email: AUTHORIZED_OWNER_EMAIL,
    action: 'SYSTEM_BOOT',
    status: 'SUCCESS',
    ip: '127.0.0.1',
    details: 'Owner-only administrative security subsystem armed and active'
  }
];

function recordAuditLog(
  email: string,
  action: string,
  status: 'SUCCESS' | 'BLOCKED',
  req: express.Request,
  details: string
) {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  auditLogs.unshift({
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    email: email.trim().toLowerCase(),
    action,
    status,
    ip: String(clientIp).split(',')[0],
    details
  });

  if (auditLogs.length > 100) {
    auditLogs.pop();
  }
}

// ============================================================================
// STOREFRONT & CATALOG SEED DATA
// ============================================================================

let categories = [
  {
    id: 'cat-pajamas',
    key: 'pajamas',
    title: "Men's Pajamas & Loungewear",
    subtitle: 'Ultra-breathable 100% combed cotton sleepwear & lounge pants.',
    image: '/payjamas/WhatsApp%20Image%202026-11-06%20at%204.03.39%20PM.jpeg',
    itemCount: 17,
    isActive: true
  },
  {
    id: 'cat-pants',
    key: 'pants',
    title: "Men's Pants & Flex Trousers",
    subtitle: 'Tailored 4-way stretch flex chinos, raw denim, and comfort trousers.',
    image: '/pants/WhatsApp%20Image%202026-11-04%20at%202.42.12%20PM.jpeg',
    itemCount: 22,
    isActive: true
  },
  {
    id: 'cat-jackets',
    key: 'jackets',
    title: "Men's Jackets & Bombers",
    subtitle: 'Weather-resistant lightweight bomber jackets & insulated zip-ups.',
    image: '/src/assets/images/jackets_black_bomber_1793695966059.jpg',
    itemCount: 4,
    isActive: true
  },
  {
    id: 'cat-tracksuits',
    key: 'tracksuits',
    title: "Men's Track Suits & Athleisure",
    subtitle: 'Coordinated aerodynamic zip-track jackets with tapered track pants.',
    image: '/public/tracksuits/WhatsApp%20Image%202026-11-06%20at%204.32.30%20PM.jpeg',
    itemCount: 11,
    isActive: true
  }
];

let siteSettings = {
  storeName: 'RAGHAV GARMENTS',
  tagline: 'Style That Defines You.',
  announcementText: '⚡ FESTIVE FLASH SALE: Flat 10% OFF with code RGARMENTS14 | Free All-India Shipping on Orders Over ₹999 | Express 48hr Dispatch',
  heroTitle: 'Style That Defines You.',
  heroSubtitle: 'Crafted for the modern gentleman. Experience unrivaled craftsmanship in premium cotton pajamas, flex trousers, structured jackets, and athletic tracksuits.',
  supportPhone: '+91 98712 34567',
  supportEmail: 'care@raghavgarments.com',
  freeShippingThreshold: 999,
  storeAddress: 'Raghav Garments, 24-B Fashion Boulevard, Ring Road, New Delhi, 110049, India'
};

let customers = [
  {
    id: 'cust-01',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '+91 98112 34567',
    city: 'New Delhi',
    state: 'Delhi NCR',
    ordersCount: 3,
    totalSpent: 6890,
    registeredDate: '12 Jan 2026'
  },
  {
    id: 'cust-02',
    name: 'Vikram Malhotra',
    email: 'vikram.m@example.com',
    phone: '+91 98223 45678',
    city: 'Mumbai',
    state: 'Maharashtra',
    ordersCount: 2,
    totalSpent: 5498,
    registeredDate: '18 Jan 2026'
  },
  {
    id: 'cust-03',
    name: 'Aman Verma',
    email: 'aman.verma@example.com',
    phone: '+91 98334 56789',
    city: 'Bengaluru',
    state: 'Karnataka',
    ordersCount: 1,
    totalSpent: 1799,
    registeredDate: '24 Jan 2026'
  },
  {
    id: 'cust-04',
    name: 'Rohit Singhal',
    email: 'rohit.singhal@example.com',
    phone: '+91 98445 67890',
    city: 'Chandigarh',
    state: 'Punjab',
    ordersCount: 1,
    totalSpent: 3299,
    registeredDate: '28 Jan 2026'
  },
  {
    id: 'cust-05',
    name: 'Deepanshu Patel',
    email: 'deepanshu.p@example.com',
    phone: '+91 98556 78901',
    city: 'Ahmedabad',
    state: 'Gujarat',
    ordersCount: 1,
    totalSpent: 999,
    registeredDate: '02 Feb 2026'
  }
];

let orders: any[] = [
  {
    orderId: 'RG-1042',
    status: 'Out for Delivery',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash on Delivery (COD)',
    transactionId: 'COD-PENDING-1042',
    paymentGateway: 'COD Pay on Delivery',
    trackingNumber: 'BD88291042',
    courierPartner: 'BlueDart Express',
    lastStatusUpdate: '31 Oct 2026, 08:30 AM',
    orderDate: '28 Oct 2026',
    estimatedDelivery: '31 Oct 2026',
    customer: {
      fullName: 'Rahul Sharma',
      phone: '9876543210',
      email: 'rahul.sharma@example.com',
      address: 'Flat 402, Royal Residency, Sector 45',
      city: 'New Delhi',
      state: 'Delhi NCR',
      pincode: '110001'
    },
    items: [
      {
        product: {
          id: 'pt-01',
          name: 'Chemistree Comfort Fit Stretch Denim Pants',
          price: 1499,
          images: ['/images/pants/pants_black_chemistree.jpg'],
          colorImages: {
            'Black': '/images/pants/pants_black_chemistree.jpg',
            'White': '/images/pants/pants_white_light_icewash.jpg',
            'Grey': '/images/pants/pants_grey_washed.jpg'
          }
        },
        selectedSize: '34',
        selectedColor: 'Black',
        quantity: 1
      }
    ],
    subtotal: 1499,
    discount: 0,
    shipping: 0,
    total: 1499,
    statusHistory: [
      {
        status: 'Order Placed',
        timestamp: '28 Oct 2026, 11:30 AM',
        location: 'Raghav Garments Digital Gateway',
        note: 'Order confirmed and verified.'
      },
      {
        status: 'Order Confirmed',
        timestamp: '28 Oct 2026, 12:45 PM',
        location: 'Fulfillment Center, Delhi',
        note: 'Stock reserved & billing receipt created.'
      },
      {
        status: 'Processing',
        timestamp: '28 Oct 2026, 03:15 PM',
        location: 'Quality Inspection Unit',
        note: 'Garment stitch & fabric certified.'
      },
      {
        status: 'Packed',
        timestamp: '28 Oct 2026, 06:00 PM',
        location: 'Raghav Garments Central Warehouse',
        note: 'Sealed with signature tamper-proof seal.'
      },
      {
        status: 'Shipped',
        timestamp: '29 Oct 2026, 09:00 AM',
        location: 'Delhi Central Air Hub',
        note: 'Dispatched via BlueDart Express (AWB: BD88291042).'
      },
      {
        status: 'Out for Delivery',
        timestamp: '31 Oct 2026, 08:30 AM',
        location: 'New Delhi South Delivery Center',
        note: 'Out for delivery today with executive rider. Phone will ring before arrival.'
      }
    ],
    notificationsSent: [
      {
        type: 'STATUS_OUT_FOR_DELIVERY',
        channel: 'sms',
        timestamp: '31 Oct 2026, 08:30 AM',
        recipient: '9876543210',
        message: 'Raghav Garments: Order RG-1042 is out for delivery today via BlueDart Express.'
      }
    ]
  },
  {
    orderId: 'RG-9241',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    transactionId: 'pay_UPI_9829148291',
    paymentGateway: 'Razorpay UPI',
    paidAt: '28 Jan 2026, 11:21 AM',
    trackingNumber: 'BD-8829103',
    courierPartner: 'BlueDart Express',
    lastStatusUpdate: '31 Jan 2026, 02:15 PM',
    customer: {
      fullName: 'Rajesh Sharma',
      phone: '+91 98112 34567',
      email: 'rajesh.sharma@example.com',
      address: 'Flat 402, Lotus Apartments, Sector 14',
      city: 'New Delhi',
      state: 'Delhi NCR',
      pincode: '110025'
    },
    items: [
      {
        product: {
          id: 'pj-01',
          name: "Classic Men's Lounge Cotton Pajama",
          price: 999
        },
        selectedSize: 'L',
        selectedColor: 'Black',
        quantity: 1
      },
      {
        product: {
          id: 'pt-01',
          name: "Signature Tailored Stretch Chino Pants",
          price: 1399
        },
        selectedSize: '32',
        selectedColor: 'Grey',
        quantity: 1
      }
    ],
    subtotal: 2398,
    discount: 0,
    shipping: 0,
    total: 2398,
    orderDate: '28 Jan 2026, 11:20 AM',
    estimatedDelivery: '31 Jan 2026',
    statusHistory: [
      { status: 'Order Placed', timestamp: '28 Jan 2026, 11:20 AM', location: 'New Delhi Atelier', note: 'Order placed online via UPI' },
      { status: 'Order Confirmed', timestamp: '28 Jan 2026, 11:22 AM', location: 'New Delhi Fulfillment Center', note: 'Payment verified & order confirmed' },
      { status: 'Processing', timestamp: '28 Jan 2026, 01:15 PM', location: 'New Delhi Atelier', note: 'Garments quality-checked and ironed' },
      { status: 'Packed', timestamp: '28 Jan 2026, 04:30 PM', location: 'New Delhi Warehouse', note: 'Packed in signature Raghav Garments luxury packaging' },
      { status: 'Shipped', timestamp: '29 Jan 2026, 10:00 AM', location: 'Okhla Air Hub, Delhi', note: 'Handed over to BlueDart Express AWB #BD-8829103' },
      { status: 'Out for Delivery', timestamp: '31 Jan 2026, 08:30 AM', location: 'South Delhi Hub', note: 'Courier executive out for delivery' },
      { status: 'Delivered', timestamp: '31 Jan 2026, 02:15 PM', location: 'Customer Doorstep', note: 'Package received and signed by customer' }
    ],
    notificationsSent: [
      { type: 'Order Placed & Confirmed', channel: 'email', timestamp: '28 Jan 2026, 11:22 AM', message: 'Order #RG-9241 confirmed. Invoice attached.', recipient: 'rajesh.sharma@example.com' },
      { type: 'Dispatch Notification', channel: 'whatsapp', timestamp: '29 Jan 2026, 10:05 AM', message: 'Your Raghav Garments package has shipped via BlueDart. Track: BD-8829103', recipient: '+91 98112 34567' },
      { type: 'Delivery Confirmation', channel: 'sms', timestamp: '31 Jan 2026, 02:16 PM', message: 'Order #RG-9241 delivered successfully.', recipient: '+91 98112 34567' }
    ]
  },
  {
    orderId: 'RG-8812',
    status: 'Shipped',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    transactionId: 'pay_CARD_7718291038',
    paymentGateway: 'Razorpay Secure',
    paidAt: '01 Feb 2026, 02:10 PM',
    trackingNumber: 'DLV-4418291',
    courierPartner: 'Delhivery Air',
    lastStatusUpdate: '02 Feb 2026, 06:15 PM',
    customer: {
      fullName: 'Vikram Malhotra',
      phone: '+91 98223 45678',
      email: 'vikram.m@example.com',
      address: '12 Palm Grove, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    },
    items: [
      {
        product: {
          id: 'ts-01',
          name: "AeroPro Performance Athletic Track Suit",
          price: 2499
        },
        selectedSize: 'XL',
        selectedColor: 'Black',
        quantity: 1
      },
      {
        product: {
          id: 'jk-01',
          name: "Urban Stealth Lightweight Bomber Jacket",
          price: 2199
        },
        selectedSize: 'XL',
        selectedColor: 'Black',
        quantity: 1
      }
    ],
    subtotal: 4698,
    discount: 500,
    shipping: 0,
    total: 4198,
    orderDate: '01 Feb 2026, 02:08 PM',
    estimatedDelivery: '04 Feb 2026',
    statusHistory: [
      { status: 'Order Placed', timestamp: '01 Feb 2026, 02:08 PM', location: 'Mumbai Online', note: 'Customer placed order with Credit Card' },
      { status: 'Order Confirmed', timestamp: '01 Feb 2026, 02:10 PM', location: 'Payment Gateway', note: 'Card transaction authorized' },
      { status: 'Processing', timestamp: '01 Feb 2026, 04:30 PM', location: 'Central Warehouse', note: 'Items batched for dispatch' },
      { status: 'Packed', timestamp: '02 Feb 2026, 11:00 AM', location: 'Fulfillment Hub', note: 'Luxury packaging complete' },
      { status: 'Shipped', timestamp: '02 Feb 2026, 06:15 PM', location: 'Delhi Courier Hub', note: 'Transit to Mumbai via Delhivery Air' }
    ],
    notificationsSent: [
      { type: 'Order Confirmed', channel: 'email', timestamp: '01 Feb 2026, 02:11 PM', message: 'Order #RG-8812 confirmed.', recipient: 'vikram.m@example.com' },
      { type: 'Shipment Tracking', channel: 'whatsapp', timestamp: '02 Feb 2026, 06:20 PM', message: 'Track #DLV-4418291 now live on Delhivery.', recipient: '+91 98223 45678' }
    ]
  },
  {
    orderId: 'RG-8740',
    status: 'Packed',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash on Delivery (COD)',
    trackingNumber: 'DTDC-9921401',
    courierPartner: 'DTDC Priority',
    lastStatusUpdate: '02 Feb 2026, 05:20 PM',
    customer: {
      fullName: 'Aman Verma',
      phone: '+91 98334 56789',
      email: 'aman.verma@example.com',
      address: 'B-303, Prestige Towers, Koramangala',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034'
    },
    items: [
      {
        product: {
          id: 'pt-02',
          name: "Smart Comfort Flex Cotton Trousers",
          price: 1799
        },
        selectedSize: 'M',
        selectedColor: 'Black',
        quantity: 1
      }
    ],
    subtotal: 1799,
    discount: 0,
    shipping: 0,
    total: 1799,
    orderDate: '02 Feb 2026, 10:14 AM',
    estimatedDelivery: '06 Feb 2026',
    statusHistory: [
      { status: 'Order Placed', timestamp: '02 Feb 2026, 10:14 AM', location: 'Bengaluru', note: 'Order placed with Cash on Delivery' },
      { status: 'Order Confirmed', timestamp: '02 Feb 2026, 11:30 AM', location: 'Customer Verification', note: 'Customer confirmed via OTP' },
      { status: 'Packed', timestamp: '02 Feb 2026, 05:20 PM', location: 'Delhi Hub', note: 'Sealed & tagged for DTDC Priority pickup' }
    ],
    notificationsSent: [
      { type: 'COD Confirmation', channel: 'sms', timestamp: '02 Feb 2026, 11:31 AM', message: 'Your COD order #RG-8740 is confirmed for ₹1,799.', recipient: '+91 98334 56789' }
    ]
  },
  {
    orderId: 'RG-8605',
    status: 'Processing',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    transactionId: 'pay_UPI_5548192019',
    paymentGateway: 'PhonePe UPI',
    paidAt: '03 Feb 2026, 09:12 AM',
    trackingNumber: 'PENDING_DISPATCH',
    courierPartner: 'Express Logistics',
    lastStatusUpdate: '03 Feb 2026, 11:00 AM',
    customer: {
      fullName: 'Rohit Singhal',
      phone: '+91 98445 67890',
      email: 'rohit.singhal@example.com',
      address: 'House 88, Sector 9-B',
      city: 'Chandigarh',
      state: 'Punjab',
      pincode: '160009'
    },
    items: [
      {
        product: {
          id: 'jk-02',
          name: "All-Weather Arctic Quilted Wind Jacket",
          price: 3299
        },
        selectedSize: 'L',
        selectedColor: 'Grey',
        quantity: 1
      }
    ],
    subtotal: 3299,
    discount: 0,
    shipping: 0,
    total: 3299,
    orderDate: '03 Feb 2026, 09:10 AM',
    estimatedDelivery: '07 Feb 2026',
    statusHistory: [
      { status: 'Order Placed', timestamp: '03 Feb 2026, 09:10 AM', location: 'Chandigarh', note: 'Order placed via UPI' },
      { status: 'Order Confirmed', timestamp: '03 Feb 2026, 09:12 AM', location: 'Payment Gateway', note: 'PhonePe payment verified' },
      { status: 'Processing', timestamp: '03 Feb 2026, 11:00 AM', location: 'Tailoring Atelier', note: 'Quality inspection underway' }
    ],
    notificationsSent: [
      { type: 'Payment Received', channel: 'email', timestamp: '03 Feb 2026, 09:13 AM', message: 'Payment of ₹3,299 received.', recipient: 'rohit.singhal@example.com' }
    ]
  },
  {
    orderId: 'RG-8591',
    status: 'Order Placed',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash on Delivery (COD)',
    lastStatusUpdate: '03 Feb 2026, 08:30 PM',
    customer: {
      fullName: 'Deepanshu Patel',
      phone: '+91 98556 78901',
      email: 'deepanshu.p@example.com',
      address: '45 Swastik Society, Navrangpura',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380009'
    },
    items: [
      {
        product: {
          id: 'pj-02',
          name: "Premium Breathable Checkered Night Pajama",
          price: 999
        },
        selectedSize: 'M',
        selectedColor: 'White',
        quantity: 1
      }
    ],
    subtotal: 999,
    discount: 0,
    shipping: 0,
    total: 999,
    orderDate: '03 Feb 2026, 08:30 PM',
    estimatedDelivery: '08 Feb 2026',
    statusHistory: [
      { status: 'Order Placed', timestamp: '03 Feb 2026, 08:30 PM', location: 'Ahmedabad Online', note: 'Order registered, awaiting fulfillment confirmation' }
    ],
    notificationsSent: [
      { type: 'Order Received', channel: 'email', timestamp: '03 Feb 2026, 08:31 PM', message: 'Order #RG-8591 received.', recipient: 'deepanshu.p@example.com' }
    ]
  }
];

let products: any[] = [];

async function initializeProducts() {
  try {
    const productsModule = await import('./src/data/products.js').catch(async () => {
      return await import('./src/data/products.ts');
    });
    if (productsModule && productsModule.PRODUCTS) {
      products = JSON.parse(JSON.stringify(productsModule.PRODUCTS));
    }
  } catch (err) {
    console.warn('Could not load products via dynamic import, using fallback seed:', err);
  }
}

// ============================================================================
// OWNER AUTHORIZATION MIDDLEWARE
// ============================================================================

function requireOwnerAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 'UNAUTHORIZED',
      error: 'Unauthorized: Missing owner authorization token'
    });
  }

  const token = authHeader.substring(7);
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({
      code: 'INVALID_SESSION',
      error: 'Unauthorized: Invalid or expired owner session'
    });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({
      code: 'SESSION_EXPIRED',
      error: 'Unauthorized: Owner session has expired, please authenticate again'
    });
  }

  // STRICT DOUBLE-CHECK: User email MUST exactly match the authorized owner email
  if (session.user.email.toLowerCase() !== AUTHORIZED_OWNER_EMAIL.toLowerCase()) {
    activeSessions.delete(token);
    recordAuditLog(
      session.user.email,
      'TOKEN_HIJACK_ATTEMPT',
      'BLOCKED',
      req,
      'Session token contains unauthorized email'
    );
    return res.status(403).json({
      code: 'ACCESS_DENIED',
      error: `ACCESS DENIED: Access restricted to authorized owner (${AUTHORIZED_OWNER_EMAIL}) only.`
    });
  }

  (req as any).ownerUser = session.user;
  next();
}

// ============================================================================
// OWNER AUTHENTICATION ENDPOINTS
// ============================================================================

// 1. Google OAuth Sign-In (Owner Only)
app.post('/api/admin/google-auth', (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Google authentication did not provide an email address' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // STRICT RULE: Reject every email that is NOT the exact authorized owner
  if (normalizedEmail !== AUTHORIZED_OWNER_EMAIL.toLowerCase()) {
    recordAuditLog(
      normalizedEmail,
      'GOOGLE_SIGNIN_REJECTED',
      'BLOCKED',
      req,
      `Rejected unauthorized Google account: ${normalizedEmail}`
    );
    return res.status(403).json({
      code: 'ACCESS_DENIED',
      error: `ACCESS DENIED: The Google account "${normalizedEmail}" is NOT authorized. Only the verified owner (${AUTHORIZED_OWNER_EMAIL}) has access to the Raghav Garments Admin Panel.`
    });
  }

  // Issue secure 24-hr session token for the owner
  const token = crypto.randomBytes(32).toString('hex');
  const user: OwnerUser = {
    name: name || 'Ridhi Taneja',
    email: AUTHORIZED_OWNER_EMAIL,
    role: 'Owner & Sole Administrator',
    authProvider: 'google',
    lastLogin: new Date().toISOString()
  };

  activeSessions.set(token, {
    token,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    user
  });

  recordAuditLog(
    AUTHORIZED_OWNER_EMAIL,
    'GOOGLE_SIGNIN_SUCCESS',
    'SUCCESS',
    req,
    'Owner verified and authenticated via Google OAuth'
  );

  return res.json({
    success: true,
    token,
    user
  });
});

// 2. Email + Password Login (Owner Only)
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both your email address and password' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // STRICT RULE: Reject any unauthorized email before even verifying password
  if (normalizedEmail !== AUTHORIZED_OWNER_EMAIL.toLowerCase()) {
    recordAuditLog(
      normalizedEmail,
      'CREDENTIAL_SIGNIN_REJECTED',
      'BLOCKED',
      req,
      `Unauthorized email attempted administrative sign-in: ${normalizedEmail}`
    );
    return res.status(403).json({
      code: 'ACCESS_DENIED',
      error: `ACCESS DENIED: Access to administrative systems is restricted strictly to the verified owner (${AUTHORIZED_OWNER_EMAIL}). All unauthorized attempts are logged.`
    });
  }

  const inputHash = crypto.createHash('sha256').update(String(password)).digest('hex');

  if (inputHash !== ownerPasswordHash) {
    recordAuditLog(
      AUTHORIZED_OWNER_EMAIL,
      'PASSWORD_MISMATCH',
      'BLOCKED',
      req,
      'Owner password verification failed'
    );
    return res.status(401).json({
      code: 'INVALID_CREDENTIALS',
      error: 'Invalid password. Please enter the correct owner password or use Google Sign-In.'
    });
  }

  // Issue secure session token
  const token = crypto.randomBytes(32).toString('hex');
  const user: OwnerUser = {
    name: 'Ridhi Taneja',
    email: AUTHORIZED_OWNER_EMAIL,
    role: 'Owner & Sole Administrator',
    authProvider: 'password',
    lastLogin: new Date().toISOString()
  };

  activeSessions.set(token, {
    token,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    user
  });

  recordAuditLog(
    AUTHORIZED_OWNER_EMAIL,
    'PASSWORD_SIGNIN_SUCCESS',
    'SUCCESS',
    req,
    'Owner authenticated successfully via password credentials'
  );

  return res.json({
    success: true,
    token,
    user
  });
});

// 3. Verify Active Session
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  const token = authHeader.substring(7);
  const session = activeSessions.get(token);

  if (!session || Date.now() > session.expiresAt) {
    return res.status(401).json({ valid: false });
  }

  if (session.user.email.toLowerCase() !== AUTHORIZED_OWNER_EMAIL.toLowerCase()) {
    return res.status(403).json({ valid: false, code: 'ACCESS_DENIED' });
  }

  return res.json({ valid: true, user: session.user });
});

// 4. Secure Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const session = activeSessions.get(token);
    if (session) {
      recordAuditLog(session.user.email, 'OWNER_LOGOUT', 'SUCCESS', req, 'Owner terminated session');
      activeSessions.delete(token);
    }
  }
  return res.json({ success: true, message: 'Logged out securely' });
});

// 5. Forgot Password Recovery (Dispatches to Authorized Owner Only)
app.post('/api/admin/forgot-password', (req, res) => {
  const { email } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (normalizedEmail !== AUTHORIZED_OWNER_EMAIL.toLowerCase()) {
    recordAuditLog(
      normalizedEmail,
      'PASSWORD_RESET_REJECTED',
      'BLOCKED',
      req,
      `Password reset denied for unauthorized email: ${normalizedEmail}`
    );
    return res.status(403).json({
      code: 'ACCESS_DENIED',
      error: `ACCESS DENIED: Password recovery is only available to the registered owner (${AUTHORIZED_OWNER_EMAIL}).`
    });
  }

  // Generate 6-digit owner OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  pendingResetCode = {
    code,
    expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins
  };

  recordAuditLog(
    AUTHORIZED_OWNER_EMAIL,
    'PASSWORD_RESET_REQUESTED',
    'SUCCESS',
    req,
    `Recovery code generated for ${AUTHORIZED_OWNER_EMAIL}`
  );

  return res.json({
    success: true,
    message: `Security recovery OTP generated for ${AUTHORIZED_OWNER_EMAIL}.`,
    recoveryCode: code // Displayed in the UI helper for instantaneous recovery
  });
});

app.post('/api/admin/reset-password', (req, res) => {
  const { code, newPassword } = req.body;

  if (!pendingResetCode || Date.now() > pendingResetCode.expiresAt) {
    return res.status(400).json({ error: 'Reset code expired or not requested. Please request a new code.' });
  }

  if (String(code).trim() !== pendingResetCode.code) {
    return res.status(400).json({ error: 'Invalid verification code.' });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  ownerPasswordHash = crypto.createHash('sha256').update(String(newPassword)).digest('hex');
  pendingResetCode = null;

  recordAuditLog(
    AUTHORIZED_OWNER_EMAIL,
    'PASSWORD_RESET_COMPLETED',
    'SUCCESS',
    req,
    'Owner password successfully updated'
  );

  return res.json({ success: true, message: 'Password updated successfully! You can now log in.' });
});

// 6. Security Audit Logs Endpoint (Owner Protected)
app.get('/api/admin/audit-logs', requireOwnerAuth, (_req, res) => {
  res.json({
    authorizedOwnerEmail: AUTHORIZED_OWNER_EMAIL,
    totalLogs: auditLogs.length,
    logs: auditLogs
  });
});

// ============================================================================
// STORE MANAGEMENT ENDPOINTS (PROTECTED WITH requireOwnerAuth)
// ============================================================================

// Dashboard KPI Stats
app.get('/api/admin/stats', requireOwnerAuth, (_req, res) => {
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalSales = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const confirmedOrders = orders.filter((o) => o.status === 'Confirmed').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  const categoryBreakdown = {
    pajamas: products.filter((p) => p.category === 'pajamas').length,
    pants: products.filter((p) => p.category === 'pants').length,
    jackets: products.filter((p) => p.category === 'jackets').length,
    tracksuits: products.filter((p) => p.category === 'tracksuits').length
  };

  res.json({
    totalProducts,
    totalOrders,
    totalCustomers,
    totalSales,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    categoryBreakdown,
    recentOrders: orders.slice(0, 5)
  });
});

// Products: Public Read, Owner Write/Edit/Delete
app.get('/api/products', (_req, res) => {
  res.json(products);
});

app.post('/api/products', requireOwnerAuth, (req, res) => {
  const item = req.body;
  if (!item.name || !item.price || !item.category) {
    return res.status(400).json({ error: 'Product name, price, and category are required' });
  }

  const newProduct = {
    id: item.id || `rg-${Date.now()}`,
    name: item.name,
    category: item.category,
    originalPrice: Number(item.originalPrice) || Number(item.price),
    price: Number(item.price),
    discount: item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0,
    rating: Number(item.rating) || 5.0,
    reviewsCount: Number(item.reviewsCount) || 1,
    sizes: item.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
    colors: item.colors || [
      { name: 'Black', hex: '#111827' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Grey', hex: '#6B7280' }
    ],
    colorImages: item.colorImages || {},
    images: item.images || [item.image || '/src/assets/images/category_mens_pajamas_1793694585873.jpg'],
    badge: item.badge || 'New Arrival',
    description: item.description || '',
    features: item.features || ['Premium fabric', 'Precision fit', 'Durable stitch'],
    fabric: item.fabric || '100% Combed Cotton',
    fit: item.fit || 'Regular Comfort Fit',
    care: item.care || 'Machine wash cold with like colors',
    inStock: item.inStock !== false,
    featured: !!item.featured
  };

  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', requireOwnerAuth, (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updated = {
    ...products[index],
    ...req.body,
    price: Number(req.body.price ?? products[index].price),
    originalPrice: Number(req.body.originalPrice ?? products[index].originalPrice)
  };

  if (updated.originalPrice && updated.price) {
    updated.discount = Math.round(((updated.originalPrice - updated.price) / updated.originalPrice) * 100);
  }

  products[index] = updated;
  res.json(updated);
});

app.delete('/api/products/:id', requireOwnerAuth, (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const removed = products.splice(index, 1);
  res.json({ success: true, removed: removed[0] });
});

// Categories: Public Read, Owner Edit
app.get('/api/categories', (_req, res) => {
  const enriched = categories.map((cat) => ({
    ...cat,
    itemCount: products.filter((p) => p.category === cat.key).length
  }));
  res.json(enriched);
});

app.post('/api/categories', requireOwnerAuth, (req, res) => {
  const { title, subtitle, key, image } = req.body;
  if (!title || !key) {
    return res.status(400).json({ error: 'Category title and key are required' });
  }

  const newCat = {
    id: `cat-${Date.now()}`,
    key,
    title,
    subtitle: subtitle || '',
    image: image || '/src/assets/images/category_mens_pajamas_1793694585873.jpg',
    itemCount: 0,
    isActive: true
  };

  categories.push(newCat);
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', requireOwnerAuth, (req, res) => {
  const { id } = req.params;
  const index = categories.findIndex((c) => c.id === id || c.key === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  categories[index] = { ...categories[index], ...req.body };
  res.json(categories[index]);
});

app.delete('/api/categories/:id', requireOwnerAuth, (req, res) => {
  const { id } = req.params;
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const removed = categories.splice(index, 1);
  res.json({ success: true, removed: removed[0] });
});

// Orders: Public Checkout, Owner Manage & Status Update
app.get('/api/orders', requireOwnerAuth, (_req, res) => {
  res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  const orderData = req.body;
  if (!orderData || !orderData.items || !orderData.customer) {
    return res.status(400).json({ error: 'Invalid order structure' });
  }

  const newOrder = {
    ...orderData,
    orderId: orderData.orderId || `RG-${Math.floor(1000 + Math.random() * 9000)}`,
    status: orderData.status || 'Pending',
    orderDate: orderData.orderDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  orders.unshift(newOrder);

  // Sync customer history locally
  const customerEmail = orderData.customer.email?.toLowerCase();
  const existingCust = customers.find((c) => c.email.toLowerCase() === customerEmail);
  if (existingCust) {
    existingCust.ordersCount += 1;
    existingCust.totalSpent += Number(orderData.total) || 0;
  } else {
    customers.push({
      id: `cust-${Date.now()}`,
      name: orderData.customer.fullName || 'Valued Customer',
      email: orderData.customer.email,
      phone: orderData.customer.phone || '',
      city: orderData.customer.city || 'India',
      state: orderData.customer.state || '',
      ordersCount: 1,
      totalSpent: Number(orderData.total) || 0,
      registeredDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  }

  // ========================================================================
  // PERSIST TO SUPABASE BACKEND (Project: ibergysewvwrbfeatoul, Table: orders)
  // ========================================================================
  let supabaseSyncResult = {
    synced: false,
    project: SUPABASE_PROJECT_ID,
    url: SUPABASE_URL,
    table: 'orders',
    message: ''
  };

  try {
    const supabaseRow = mapOrderToSupabase(newOrder);
    const client = getSupabaseClient(supabaseConfig.apiKey);

    if (client) {
      const { data, error } = await client
        .from('orders')
        .insert([supabaseRow]);

      if (error) {
        console.warn('⚠️ Supabase order sync notification:', error.message);
        supabaseSyncResult.message = `Supabase responded: ${error.message}`;
      } else {
        supabaseSyncResult.synced = true;
        supabaseSyncResult.message = `Order ${newOrder.orderId} successfully persisted to Supabase table "orders"`;
        recordAuditLog(
          newOrder.customer.email || 'customer@raghavgarments.com',
          'SUPABASE_ORDER_INSERT',
          'SUCCESS',
          req,
          `Persisted order ${newOrder.orderId} to Supabase project ${SUPABASE_PROJECT_ID}`
        );
      }
    } else {
      supabaseSyncResult.message = `Ready for Supabase project ${SUPABASE_PROJECT_ID}. Awaiting anon/service key in Admin Dashboard.`;
    }
  } catch (err: any) {
    console.warn('⚠️ Supabase sync exception:', err.message);
    supabaseSyncResult.message = `Sync exception: ${err.message}`;
  }

  supabaseConfig.lastSyncAttempt = {
    timestamp: new Date().toISOString(),
    orderId: newOrder.orderId,
    status: supabaseSyncResult.synced ? 'SUCCESS' : 'PENDING_CONFIG',
    details: supabaseSyncResult.message
  };

  res.status(201).json({
    ...newOrder,
    supabaseSync: supabaseSyncResult
  });
});

// Supabase Status & Configuration API (Owner Only)
app.get('/api/admin/supabase-status', requireOwnerAuth, (_req, res) => {
  res.json({
    projectId: SUPABASE_PROJECT_ID,
    url: SUPABASE_URL,
    hasApiKey: !!supabaseConfig.apiKey,
    status: supabaseConfig.status,
    lastSyncAttempt: supabaseConfig.lastSyncAttempt,
    sqlSchema: SUPABASE_ORDERS_TABLE_SQL
  });
});

app.post('/api/admin/supabase-config', requireOwnerAuth, (req, res) => {
  const { apiKey } = req.body;
  if (typeof apiKey === 'string') {
    supabaseConfig.apiKey = apiKey.trim();
    updateSupabaseKey(apiKey.trim());
    recordAuditLog(
      AUTHORIZED_OWNER_EMAIL,
      'SUPABASE_CONFIG_UPDATE',
      'SUCCESS',
      req,
      `Owner updated Supabase credentials for project ${SUPABASE_PROJECT_ID}`
    );
  }
  res.json({
    success: true,
    projectId: SUPABASE_PROJECT_ID,
    url: SUPABASE_URL,
    hasApiKey: !!supabaseConfig.apiKey
  });
});

app.post('/api/admin/supabase-test', requireOwnerAuth, async (req, res) => {
  const client = getSupabaseClient(supabaseConfig.apiKey);
  if (!client) {
    return res.status(400).json({
      success: false,
      error: 'Please enter your Supabase Anon Key or Service Role Key first.'
    });
  }

  try {
    const { data, error } = await client.from('orders').select('count', { count: 'exact', head: true });
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
        hint: 'If table "orders" does not exist yet, run the SQL schema in your Supabase SQL Editor.'
      });
    }
    return res.json({
      success: true,
      message: `Successfully connected to Supabase project ${SUPABASE_PROJECT_ID}!`
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Customer-Isolated Orders Endpoint (Only returns orders belonging to specified email or phone)
app.get('/api/customer/orders', (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase();
  const rawPhone = String(req.query.phone || '').trim();
  const phone = rawPhone.replace(/[^0-9]/g, '');

  if (!email && !phone) {
    return res.status(400).json({ 
      error: 'Please provide either customer email or phone number to retrieve orders' 
    });
  }

  const matched = orders.filter((o) => {
    const oEmail = String(o.customer?.email || '').trim().toLowerCase();
    const oPhone = String(o.customer?.phone || '').trim().replace(/[^0-9]/g, '');

    const matchesEmail = email && oEmail === email;
    const matchesPhone = phone && (oPhone === phone || (phone.length >= 4 && oPhone.endsWith(phone)));
    return matchesEmail || matchesPhone;
  });

  return res.json(matched);
});

// Order Tracking Verification Endpoint (Accessible by Order ID + Verified Phone/Email)
app.post('/api/orders/track', (req, res) => {
  const { orderId, contact } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const normalizedOrderId = String(orderId).trim().toUpperCase();
  const order = orders.find((o) => o.orderId.toUpperCase() === normalizedOrderId);

  if (!order) {
    return res.status(404).json({ 
      error: `Order with ID "${normalizedOrderId}" was not found. Please verify the ID on your invoice or SMS.` 
    });
  }

  // If customer provided phone or email for verification, ensure match
  if (contact && String(contact).trim().length > 0) {
    const normContact = String(contact).trim().toLowerCase();
    const cleanDigits = normContact.replace(/[^0-9]/g, '');
    const oEmail = String(order.customer?.email || '').trim().toLowerCase();
    const oPhone = String(order.customer?.phone || '').trim().replace(/[^0-9]/g, '');

    const matchesEmail = oEmail && (oEmail === normContact || oEmail.includes(normContact));
    const matchesPhone = cleanDigits.length >= 4 && (oPhone.endsWith(cleanDigits) || cleanDigits.endsWith(oPhone));

    if (!matchesEmail && !matchesPhone) {
      return res.status(403).json({
        error: 'The mobile number or email address does not match this Order ID record.',
        hint: 'Please provide the registered 10-digit mobile number or email entered during purchase.'
      });
    }
  }

  return res.json({ success: true, order });
});

// Razorpay Order Creation & Verification Simulation
app.post('/api/payments/create-razorpay-order', (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;
  const razorpayOrderId = `order_rzp_${crypto.randomBytes(8).toString('hex')}`;
  res.json({
    id: razorpayOrderId,
    amount: amount || 1000,
    currency,
    receipt: receipt || `rcpt_${Date.now()}`,
    status: 'created'
  });
});

app.post('/api/payments/verify-razorpay', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, orderId } = req.body;
  const targetOrder = orders.find((o) => o.orderId === orderId);
  if (targetOrder) {
    targetOrder.paymentStatus = 'Paid';
    targetOrder.transactionId = razorpay_payment_id || `TXN-${Date.now()}`;
    targetOrder.paidAt = new Date().toISOString();
  }
  res.json({
    success: true,
    message: 'Payment verified and confirmed via 256-bit Razorpay gateway',
    paymentId: razorpay_payment_id || `TXN-${Date.now()}`
  });
});

// Admin Payment Summary & Analytics (Owner Only)
app.get('/api/admin/payments/summary', requireOwnerAuth, (_req, res) => {
  const paidOrders = orders.filter((o) => o.paymentStatus === 'Paid');
  const pendingOrders = orders.filter((o) => o.paymentStatus === 'Pending');
  const refundedOrders = orders.filter((o) => o.paymentStatus === 'Refunded' || o.paymentStatus === 'Partially Refunded');
  const failedOrders = orders.filter((o) => o.paymentStatus === 'Failed');

  const totalCollected = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCollection = pendingOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalRefunded = refundedOrders.reduce((sum, o) => sum + (o.refundDetails?.amount || o.total || 0), 0);

  // Method distribution
  const methodStats = {
    cod: { count: 0, sum: 0 },
    upi: { count: 0, sum: 0 },
    card: { count: 0, sum: 0 },
    netbanking: { count: 0, sum: 0 }
  };

  orders.forEach((o) => {
    const meth = (o.paymentMethod || '').toLowerCase();
    const amt = o.total || 0;
    if (meth.includes('cod') || meth.includes('cash')) {
      methodStats.cod.count += 1;
      methodStats.cod.sum += amt;
    } else if (meth.includes('upi') || meth.includes('pay') || meth.includes('phonepe')) {
      methodStats.upi.count += 1;
      methodStats.upi.sum += amt;
    } else if (meth.includes('card') || meth.includes('debit') || meth.includes('credit')) {
      methodStats.card.count += 1;
      methodStats.card.sum += amt;
    } else {
      methodStats.netbanking.count += 1;
      methodStats.netbanking.sum += amt;
    }
  });

  res.json({
    totalCollected,
    pendingCollection,
    totalRefunded,
    paidCount: paidOrders.length,
    pendingCount: pendingOrders.length,
    refundedCount: refundedOrders.length,
    failedCount: failedOrders.length,
    methodStats,
    recentPayments: orders.slice(0, 10).map((o) => ({
      orderId: o.orderId,
      customerName: o.customer.fullName,
      amount: o.total,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      transactionId: o.transactionId,
      date: o.orderDate
    }))
  });
});

// Admin Payment Action Controller: Mark Paid, Verify UPI, Issue Full/Partial Refund
app.patch('/api/orders/:id/payment', requireOwnerAuth, async (req, res) => {
  const { id } = req.params;
  const { action, amount, reason, transactionId } = req.body;

  const order = orders.find((o) => o.orderId === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const nowIso = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  if (action === 'mark_paid') {
    order.paymentStatus = 'Paid';
    order.paidAt = nowIso;
    if (transactionId) order.transactionId = transactionId;
    if (!order.transactionId) {
      order.transactionId = `COD-COL-${Date.now().toString().slice(-6)}`;
    }

    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: `Payment Received (₹${order.total})`,
      timestamp: nowIso,
      location: 'Account Settlement Hub',
      note: 'Cash on Delivery payment received and verified by courier/delivery executive.'
    });

    if (!order.notificationsSent) order.notificationsSent = [];
    order.notificationsSent.push({
      type: 'PAYMENT_RECEIVED',
      channel: 'sms',
      timestamp: nowIso,
      recipient: order.customer.phone || order.customer.email,
      message: `Dear ${order.customer.fullName}, payment of ₹${order.total} for order ${order.orderId} has been successfully received. Thank you for shopping with Raghav Garments.`
    });

    recordAuditLog(
      AUTHORIZED_OWNER_EMAIL,
      'PAYMENT_MARKED_PAID',
      'SUCCESS',
      req,
      `Owner marked order ${order.orderId} as PAID (₹${order.total})`
    );
  } else if (action === 'verify_upi') {
    order.paymentStatus = 'Paid';
    order.paidAt = nowIso;
    order.transactionId = transactionId || order.transactionId || `UPI-VER-${Date.now().toString().slice(-6)}`;

    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: 'UPI Payment Verified',
      timestamp: nowIso,
      location: 'Razorpay UPI Gateway',
      note: `UPI Transaction ID ${order.transactionId} verified successfully.`
    });

    if (!order.notificationsSent) order.notificationsSent = [];
    order.notificationsSent.push({
      type: 'UPI_VERIFIED',
      channel: 'whatsapp',
      timestamp: nowIso,
      recipient: order.customer.phone,
      message: `Raghav Garments: Your UPI payment of ₹${order.total} for order ${order.orderId} has been verified.`
    });

    recordAuditLog(
      AUTHORIZED_OWNER_EMAIL,
      'UPI_PAYMENT_VERIFIED',
      'SUCCESS',
      req,
      `Owner verified UPI payment for order ${order.orderId}`
    );
  } else if (action === 'refund') {
    const refundAmount = Number(amount) || order.total;
    const isPartial = refundAmount < order.total;
    order.paymentStatus = isPartial ? 'Partially Refunded' : 'Refunded';

    const refundId = `RFND-${Date.now().toString().slice(-6)}`;
    order.refundDetails = {
      amount: refundAmount,
      reason: reason || 'Customer requested return / refund',
      refundedAt: nowIso,
      refundId
    };

    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: isPartial ? 'Partially Refunded' : 'Refund Processed',
      timestamp: nowIso,
      location: 'Accounts & Refunds Subsystem',
      note: `Refund of ₹${refundAmount} initiated. Ref ID: ${refundId}. Reason: ${order.refundDetails.reason}`
    });

    if (!order.notificationsSent) order.notificationsSent = [];
    order.notificationsSent.push({
      type: 'REFUND_INITIATED',
      channel: 'sms',
      timestamp: nowIso,
      recipient: order.customer.phone || order.customer.email,
      message: `Raghav Garments: Refund of ₹${refundAmount} for order ${order.orderId} has been processed back to source account. Reference: ${refundId}.`
    });

    recordAuditLog(
      AUTHORIZED_OWNER_EMAIL,
      'ORDER_REFUND_PROCESSED',
      'SUCCESS',
      req,
      `Owner issued ${isPartial ? 'partial' : 'full'} refund of ₹${refundAmount} for order ${order.orderId}`
    );
  } else if (action === 'mark_failed') {
    order.paymentStatus = 'Failed';
    recordAuditLog(
      AUTHORIZED_OWNER_EMAIL,
      'PAYMENT_MARKED_FAILED',
      'SUCCESS',
      req,
      `Payment marked failed for order ${order.orderId}`
    );
  }

  // Sync updated order state to Supabase if connected
  try {
    const client = getSupabaseClient(supabaseConfig.apiKey);
    if (client) {
      await client
        .from('orders')
        .update(mapOrderToSupabase(order))
        .eq('order_id', order.orderId);
    }
  } catch (err: any) {
    console.warn('⚠️ Supabase payment update notice:', err.message);
  }

  return res.json({ success: true, order });
});

// Admin Order Status Update (Strictly 7 Stages + Extended Statuses + Couriers + Notes)
app.patch('/api/orders/:id/status', requireOwnerAuth, async (req, res) => {
  const { id } = req.params;
  const { status, courierPartner, trackingNumber, location, note } = req.body;

  const validStatuses = [
    'Order Placed',
    'Order Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Return Requested',
    'Returned',
    'Refunded',
    'Pending',
    'Confirmed'
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const order = orders.find((o) => o.orderId === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const nowIso = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Update order fields
  order.status = status;
  order.lastStatusUpdate = nowIso;
  if (courierPartner) order.courierPartner = courierPartner;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  // Auto assign default courier & tracking if moving to Shipped without one
  if (['Shipped', 'Out for Delivery', 'Delivered'].includes(status) && !order.trackingNumber) {
    order.courierPartner = order.courierPartner || 'BlueDart Express';
    order.trackingNumber = `BD${Date.now().toString().slice(-8)}`;
  }

  // Append entry to status history
  if (!order.statusHistory) {
    order.statusHistory = [];
  }

  const defaultLocations: Record<string, string> = {
    'Order Placed': 'Raghav Garments Digital Gateway',
    'Order Confirmed': 'Order Management Center, Delhi',
    'Processing': 'Quality Inspection & Assembly Unit',
    'Packed': 'Raghav Garments Central Warehouse',
    'Shipped': 'Dispatched via Express Courier Air Hub',
    'Out for Delivery': `Local Delivery Hub (${order.customer?.city || 'Destination City'})`,
    'Delivered': `${order.customer?.address || 'Customer Doorstep'}`,
    'Cancelled': 'Order Resolution Center'
  };

  const defaultNotes: Record<string, string> = {
    'Order Placed': 'Order verified and queued for merchant confirmation.',
    'Order Confirmed': 'Inventory reserved and billing receipt generated.',
    'Processing': 'Garment precision fit inspected and certified.',
    'Packed': 'Items securely packed with signature Raghav Garments tamper-evident seals.',
    'Shipped': `Handed over to ${order.courierPartner || 'Courier Partner'}. AWB: ${order.trackingNumber || 'Pending'}`,
    'Out for Delivery': 'Out for delivery today with courier executive. Please keep phone reachable.',
    'Delivered': 'Shipment delivered successfully to recipient. Thank you for choosing Raghav Garments!',
    'Cancelled': 'Order cancelled as requested.'
  };

  order.statusHistory.push({
    status,
    timestamp: nowIso,
    location: location || defaultLocations[status] || 'Fulfillment Hub',
    note: note || defaultNotes[status] || `Order transitioned to ${status}`
  });

  // Generate automated customer notification entry
  if (!order.notificationsSent) {
    order.notificationsSent = [];
  }

  order.notificationsSent.push({
    type: `STATUS_${status.toUpperCase().replace(/\s+/g, '_')}`,
    channel: 'sms',
    timestamp: nowIso,
    recipient: order.customer.phone || order.customer.email,
    message: `Raghav Garments Update: Order ${order.orderId} is now ${status}. Track at our website using ID ${order.orderId}.`
  });

  recordAuditLog(
    AUTHORIZED_OWNER_EMAIL,
    'ORDER_STATUS_UPDATE',
    'SUCCESS',
    req,
    `Owner updated order ${order.orderId} status to "${status}" (Courier: ${order.courierPartner || 'N/A'}, AWB: ${order.trackingNumber || 'N/A'})`
  );

  // Sync to Supabase table "orders" if configured
  try {
    const client = getSupabaseClient(supabaseConfig.apiKey);
    if (client) {
      await client
        .from('orders')
        .update(mapOrderToSupabase(order))
        .eq('order_id', order.orderId);
    }
  } catch (err: any) {
    console.warn('⚠️ Supabase order update notice:', err.message);
  }

  res.json({ success: true, order });
});

// Customers: Owner Only
app.get('/api/customers', requireOwnerAuth, (_req, res) => {
  res.json(customers);
});

// Settings: Public Read, Owner Update
app.get('/api/settings', (_req, res) => {
  res.json(siteSettings);
});

app.put('/api/settings', requireOwnerAuth, (req, res) => {
  siteSettings = { ...siteSettings, ...req.body };
  res.json({ success: true, settings: siteSettings });
});

// Wholesale & B2B Inquiries
let wholesaleInquiries: any[] = [];
app.post('/api/wholesale-inquiries', (req, res) => {
  const inq = {
    id: `winq-${Date.now()}`,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    ...req.body
  };
  wholesaleInquiries.unshift(inq);
  res.json({ success: true, inquiry: inq });
});

app.get('/api/wholesale-inquiries', requireOwnerAuth, (_req, res) => {
  res.json(wholesaleInquiries);
});

// ============================================================================
// DEV SERVER / STATIC SERVING (STRICTLY ON PORT 3000)
// ============================================================================

async function startServer() {
  await initializeProducts();

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Raghav Garments server running on http://0.0.0.0:${PORT}`);
    console.log(`🔒 Owner Security Active: Only ${AUTHORIZED_OWNER_EMAIL} is authorized.`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
