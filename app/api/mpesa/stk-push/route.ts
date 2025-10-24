import { NextRequest, NextResponse } from 'next/server';

// Mock MPesa STK Push API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, amount, description } = body;

    // Validate input
    if (!phone || !amount) {
      return NextResponse.json(
        { success: false, message: 'Phone and amount are required' },
        { status: 400 }
      );
    }

    // Mock delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate mock checkout request ID
    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In production, this would:
    // 1. Get OAuth token from Safaricom
    // 2. Call STK Push API
    // 3. Return the checkout request ID

    // Simulate success (90% of the time in dev mode)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      return NextResponse.json({
        success: true,
        checkoutRequestId,
        message: 'STK Push sent successfully',
        merchantRequestId: `MOCK_${Date.now()}`,
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to initiate payment. Please try again.' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('STK Push error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}