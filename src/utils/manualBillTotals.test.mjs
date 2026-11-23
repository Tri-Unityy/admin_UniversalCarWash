import assert from 'node:assert/strict';
import { calculateManualBillTotals } from './manualBillTotals.mjs';

const withoutAdjustments = calculateManualBillTotals({
  subTotal: 25000,
  discount: 10,
  deductions: [],
  additions: []
});

assert.equal(withoutAdjustments.discountValue, 2500);
assert.equal(withoutAdjustments.deductionsTotal, 0);
assert.equal(withoutAdjustments.additionsTotal, 0);
assert.equal(withoutAdjustments.total, 22500);

const withDeductionsOnly = calculateManualBillTotals({
  subTotal: 25000,
  discount: 10,
  deductions: [
    { reason: 'Customer Goodwill', amount: 1000 },
    { reason: 'Fuel Voucher', amount: 500 }
  ]
});

assert.equal(withDeductionsOnly.deductionsTotal, 1500);
assert.equal(withDeductionsOnly.additionsTotal, 0);
assert.equal(withDeductionsOnly.total, 21000);

const withAdditions = calculateManualBillTotals({
  subTotal: 25000,
  discount: 10,
  deductions: [{ reason: 'Customer Goodwill', amount: 1000 }],
  additions: [
    { reason: 'Previous Date Payment', amount: 400 },
    { reason: 'Outstanding Payment', amount: '100' },
    { reason: 'Ignored', amount: 0 },
    { reason: 'Ignored negative', amount: -20 }
  ]
});

assert.equal(withAdditions.discountValue, 2500);
assert.equal(withAdditions.deductionsTotal, 1000);
assert.equal(withAdditions.additionsTotal, 500);
assert.equal(withAdditions.total, 22000);

const missingAdditions = calculateManualBillTotals({
  subTotal: 100,
  discount: 0,
  deductions: []
});

assert.equal(missingAdditions.total, 100);

console.log('manualBillTotals tests passed');
