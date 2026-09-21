import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ORDERS_FILE = path.join(process.cwd(), 'orders.json');

async function getOrders() {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveOrders(orders: unknown[]) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, phone, city, offer, pieces, price, timestamp } = body;

    if (!name || !phone || !city || !offer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate phone (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const order = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name,
      phone,
      city,
      offer,
      pieces,
      price,
      timestamp: timestamp || new Date().toISOString(),
      status: 'pending',
    };

    const orders = await getOrders();
    orders.push(order);
    await saveOrders(orders);

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json({ orders, total: orders.length });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
