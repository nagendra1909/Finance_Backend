import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 1. Add Customer
app.post("/customers", async (req, res) => {
  try {
    const { name, address, mobile, loanNo, loanAmount } = req.body;
    const customer = await prisma.customer.create({
      data: { name, address, mobile, loanNo, loanAmount },
    });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get All Customers
app.get("/customers", async (req, res) => {
  const customers = await prisma.customer.findMany({
    include: { payments: true },
  });
  res.json(customers);
});

// 3. Add Payment
app.post("/payments", async (req, res) => {
  try {
    const { customerId, amount } = req.body;
    const payment = await prisma.payment.create({
      data: { customerId, amount },
    });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Payments for a Customer
app.get("/customers/:id/payments", async (req, res) => {
  const { id } = req.params;
  const payments = await prisma.payment.findMany({
    where: { customerId: parseInt(id) },
  });
  res.json(payments);
});

// 5. Summary API
app.get("/customers/:id/summary", async (req, res) => {
  const { id } = req.params;
  const customer = await prisma.customer.findUnique({
    where: { id: parseInt(id) },
    include: { payments: true },
  });

  if (!customer) return res.status(404).json({ error: "Customer not found" });

  const totalPaid = customer.payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = customer.loanAmount - totalPaid;

  // Group by month
  const monthly = {};
  customer.payments.forEach((p) => {
    const month = p.date.toISOString().slice(0, 7); // "YYYY-MM"
    monthly[month] = (monthly[month] || 0) + p.amount;
  });

  res.json({
    customer: customer.name,
    loanAmount: customer.loanAmount,
    totalPaid,
    remaining,
    monthlyTotals: monthly,
  });
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
