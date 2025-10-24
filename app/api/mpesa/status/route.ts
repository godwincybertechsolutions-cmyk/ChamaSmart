import { NextRequest, NextResponse } from 'next/server';

// Store mock payment statuses (in production, this would be a database)
const paymentStatuses = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkoutRequestId } = body;

    if (!checkoutRequestId) {
      return NextResponse.json(
        { success: false, message: 'Checkout request ID is required' },
        { status: 400 }
      );
    }

    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check if we have a stored status for this request
    const status = paymentStatuses.get(checkoutRequestId);

    if (!status) {
      // First time checking - payment is pending
      // After 3-6 seconds, randomly complete or fail the payment
      setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% success rate
        paymentStatuses.set(checkoutRequestId, {
          status: isSuccess ? 'completed' : 'failed',
          transactionId: isSuccess ? `MPESA_${Date.now()}` : null,
          timestamp: new Date().toISOString(),
        });
      }, 3000 + Math.random() * 3000);

      paymentStatuses.set(checkoutRequestId, {
        status: 'pending',
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        status: 'pending',
        message: 'Payment is being processed',
      });
    }

    // Return the stored status
    if (status.status === 'completed') {
      return NextResponse.json({
        status: 'completed',
        transactionId: status.transactionId,
        message: 'Payment completed successfully',
      });
    } else if (status.status === 'failed') {
      return NextResponse.json({
        status: 'failed',
        message: 'Payment failed or was cancelled',
      });
    } else {
      return NextResponse.json({
        status: 'pending',
        message: 'Payment is being processed',
      });
    }
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Cleanup old statuses periodically (in production, use a proper job scheduler)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of paymentStatuses.entries()) {
    const timestamp = new Date(value.timestamp).getTime();
    if (now - timestamp > 300000) { // 5 minutes
      paymentStatuses.delete(key);
    }
  }
}, 60000); // Run every minute