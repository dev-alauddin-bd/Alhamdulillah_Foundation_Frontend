"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Calendar, CreditCard, User, Mail, Phone, MapPin, Hash, DollarSign, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoiceProps {
  payment: {
    _id: string;
    transactionId: string;
    amount: number;
    method: string;
    purpose: string;
    paymentStatus: string;
    paidAt?: string;
    createdAt: string;
    userId: {
      name: string;
      email: string;
      phone?: string;
      address?: string;
      cityState?: string;
      shareNo?: string;
    };
  };
}

export const PaymentInvoice: React.FC<InvoiceProps> = ({ payment }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPurposeLabel = (purpose: string) => {
    const labels: Record<string, string> = {
      MEMBERSHIP_FEE: 'সদস্যপদ ফি',
      MONTHLY_DONATION: 'মাসিক সঞ্চয়',
      PROJECT_DONATION: 'প্রজেক্ট বিনিয়োগ',
    };
    return labels[purpose] || purpose;
  };

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <title>Receipt - ${payment.transactionId}</title>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Noto Sans Bengali', 'Arial', sans-serif; 
            padding: 40px;
            background: #fff;
          }
          .receipt-box {
            border: 2px solid #000;
            padding: 30px;
            max-width: 700px;
            margin: 0 auto;
            position: relative;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            margin-bottom: 30px;
            padding-bottom: 20px;
          }
          .header h1 { font-size: 32px; margin-bottom: 10px; font-weight: 700; color: #166534; }
          .header p { font-size: 16px; color: #4b5563; }
          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            font-size: 18px;
            align-items: baseline;
          }
          .label { font-weight: 700; width: 140px; flex-shrink: 0; }
          .field {
            border-bottom: 1px dotted #000;
            flex-grow: 1;
            margin-left: 10px;
            padding-left: 10px;
            min-height: 24px;
          }
          .footer {
            margin-top: 80px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            text-align: center;
            width: 180px;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin-bottom: 8px;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            color: rgba(0,0,0,0.03);
            z-index: -1;
            pointer-events: none;
            white-space: nowrap;
            font-weight: 900;
          }
          @media print {
            body { padding: 20px; }
            .receipt-box { border: 2px solid #000; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="watermark">ALHAMDULILLAH FOUNDATION</div>
          <div class="header">
            <h1>আলহামদুলিল্লাহ ফাউন্ডেশন</h1>
            <p>আমানত রক্ষার্থে অঙ্গীকারবদ্ধ</p>
          </div>
          
          <div style="text-align: center; font-weight: bold; font-size: 24px; margin-bottom: 30px; text-decoration: underline;">
            জমা রশিদ
          </div>

          <div class="row">
            <div class="label">শেয়ার নংঃ</div>
            <div class="field"><b>${payment.userId.shareNo || payment.userId['_id']?.toString().slice(-6).toUpperCase() || 'N/A'}</b></div>
            <div class="label" style="text-align: right; width: 100px;">তারিখঃ</div>
            <div class="field" style="max-width: 180px;">${new Date(payment.paidAt || payment.createdAt).toLocaleDateString('bn-BD')}</div>
          </div>

          <div class="row">
            <div class="label">শেয়ার মূল্যঃ</div>
            <div class="field"><b>৳${payment.amount}/=</b></div>
            <div class="label" style="text-align: right; width: 100px;">মাসঃ</div>
            <div class="field" style="max-width: 180px;">${new Date(payment.paidAt || payment.createdAt).toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' })}</div>
          </div>

          <div class="row">
            <div class="label">নামঃ</div>
            <div class="field">${payment.userId.name}</div>
          </div>

          <div class="row">
            <div class="label">প্রদান মাধ্যমঃ</div>
            <div class="field">${payment.method} (${payment.transactionId})</div>
          </div>

          <div class="row">
            <div class="label">উদ্দেশ্যঃ</div>
            <div class="field">${getPurposeLabel(payment.purpose)}</div>
          </div>

          <div class="footer">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div style="font-weight: 700;">স্বাক্ষর সভাপতি</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div style="font-weight: 700;">স্বাক্ষর কোষাধক্ষ</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center space-y-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 blur-3xl -z-10"></div>
        <div className="flex items-center justify-center gap-3">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/50">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-emerald-800">Payment Invoice</h1>
        <p className="text-muted-foreground">Alhamdulillah Foundation - Official Receipt</p>
      </div>

      <Card className="p-8 shadow-2xl border-none bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Receipt No</p>
            <p className="text-lg font-black font-mono text-emerald-700">{payment.transactionId}</p>
          </div>
          <Badge className="bg-emerald-500 font-black uppercase px-6 py-2 text-sm">
            {payment.paymentStatus}
          </Badge>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-4">Transaction Details</h3>
            <div className="p-4 rounded-xl bg-muted/30 border-l-4 border-emerald-500">
               <p className="text-xs text-muted-foreground font-bold">Purpose</p>
               <p className="font-bold">{getPurposeLabel(payment.purpose)}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border-l-4 border-emerald-500">
               <p className="text-xs text-muted-foreground font-bold">Amount</p>
               <p className="text-2xl font-black text-emerald-700">৳{payment.amount.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-4">Customer Details</h3>
            <div className="p-4 rounded-xl bg-muted/30 border-l-4 border-emerald-500">
               <p className="text-xs text-muted-foreground font-bold">Name</p>
               <p className="font-bold">{payment.userId.name}</p>
               <p className="text-xs text-muted-foreground mt-1">{payment.userId.email}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border-l-4 border-emerald-500">
               <p className="text-xs text-muted-foreground font-bold">Share No</p>
               <p className="font-bold text-emerald-700">{payment.userId.shareNo || 'Not Assigned'}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            onClick={handleDownload}
            size="lg"
            className="px-12 py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-xl transition-all hover:scale-105"
          >
            <Download className="h-5 w-5 mr-3" />
            Print Official Receipt
          </Button>
        </div>
      </Card>
    </div>
  );
};
