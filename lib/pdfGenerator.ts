import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateFundPDF = (
  history: any[],
  summary: any,
  sigName: string,
  sigDesignation: string,
) => {
  if (!history) return;

  const pdf = new jsPDF("p", "mm", "a4") as any;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const now = new Date();

  // 1. Watermark
  pdf.saveGraphicsState();
  pdf.setGState(new (pdf as any).GState({ opacity: 0.03 }));
  for (let x = 10; x < pageWidth; x += 40) {
    for (let y = 10; y < pageHeight; y += 40) {
      try {
        pdf.addImage("/images/SEAL.png", "PNG", x, y, 15, 15);
      } catch (e) {}
    }
  }
  pdf.restoreGraphicsState();

  // 2. Center Text Watermark
  pdf.saveGraphicsState();
  pdf.setGState(new (pdf as any).GState({ opacity: 0.07 }));
  pdf.setFontSize(40);
  pdf.setFont(undefined, "bold");
  pdf.setTextColor(100);
  pdf.text("ALHAMDULILLAH FOUNDATION", pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: 45,
  });
  pdf.restoreGraphicsState();

  // 3. Header
  pdf.setFontSize(22);
  pdf.setTextColor(41, 128, 185);
  pdf.text("AF MONTHLY FUND INVOICE", pageWidth / 2, 20, { align: "center" });

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  const lastMonthTx = history.filter(
    (tx) => new Date(tx.createdAt) >= oneMonthAgo,
  );
  const tableRows = lastMonthTx.map((tx) => [
    new Date(tx.createdAt).toLocaleDateString(),
    tx.createdBy?.name || tx.userId?.name || "N/A",
    tx.fundType || "MAIN",
    tx.type,
    tx.amount.toLocaleString(),
    tx.balanceSnapshot.toLocaleString(),
    tx.reason,
  ]);

  autoTable(pdf, {
    startY: 35,
    head: [["Date", "User", "Sector", "Type", "Amount", "Balance", "Reason"]],
    body: tableRows,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 8, cellPadding: 2 },
  });

  const finalTableY = (pdf as any).lastAutoTable.finalY + 10;
  pdf.setFont(undefined, "bold");
  pdf.setTextColor(0);
  pdf.text(
    `Total Foundation Balance: ${(summary?.totalBalance || summary?.currentBalance || 0).toLocaleString()} BDT`,
    pageWidth - 14,
    finalTableY,
    { align: "right" },
  );

  // 4. Signature and Seal
  const footerY = pageHeight - 45;
  try {
    pdf.addImage(
      "/images/SEAL.png",
      "PNG",
      pageWidth - 60,
      footerY - 20,
      45,
      45,
    );
    pdf.setTextColor(39, 174, 96);
    pdf.setFontSize(16);
    pdf.text("VERIFIED", pageWidth - 38, footerY + 2, {
      align: "center",
      angle: -15,
    });
  } catch (e) {}

  pdf.setTextColor(0, 0, 150);
  pdf.setFont("times", "italic", "bold");
  pdf.setFontSize(18);
  pdf.text(sigName, 14, footerY);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(0);
  pdf.text("________________________", 14, footerY + 2);
  pdf.text(sigDesignation || "Authorized Person", 14, footerY + 8);

  const blobURL = pdf.output("bloburl");
  window.open(blobURL, "_blank");
};

export const generateReceiptPDF = (payment: any) => {
  if (!payment) return;

  const pdf = new jsPDF("p", "mm", "a4") as any;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // 1. Watermark
  pdf.saveGraphicsState();
  pdf.setGState(new (pdf as any).GState({ opacity: 0.05 }));
  pdf.setFontSize(50);
  pdf.setFont(undefined, "bold");
  pdf.setTextColor(150);
  pdf.text("OFFICIAL RECEIPT", pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: 45,
  });
  pdf.restoreGraphicsState();

  // 2. Header / Logo
  pdf.setFillColor(39, 174, 96); // Emerald Green
  pdf.rect(0, 0, pageWidth, 40, "F");
  
  pdf.setTextColor(255);
  pdf.setFontSize(24);
  pdf.setFont(undefined, "bold");
  pdf.text("ALHAMDULILLAH FOUNDATION", pageWidth / 2, 20, { align: "center" });
  
  pdf.setFontSize(10);
  pdf.setFont(undefined, "normal");
  pdf.text("Digital Transaction Acknowledgment & Official Tax Receipt", pageWidth / 2, 28, { align: "center" });

  // 3. Receipt Info Grid
  pdf.setTextColor(0);
  pdf.setFontSize(12);
  pdf.setFont(undefined, "bold");
  pdf.text("RECEIPT DETAILS", 20, 55);
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(39, 174, 96);
  pdf.line(20, 57, 60, 57);

  const startY = 65;
  const col1 = 20;
  const col2 = 60;
  const rowHeight = 10;

  const details = [
    ["Receipt Number:", payment.transactionId || "N/A"],
    ["Date of Issue:", new Date(payment.createdAt).toLocaleDateString("en-GB")],
    ["Contributor:", payment.userId?.name || "Verified Member"],
    ["Phone Number:", payment.senderNumber || payment.userId?.phone || "N/A"],
    ["Payment Method:", payment.method || "System Direct"],
    ["Purpose:", payment.purpose?.replace(/_/g, " ") || "Foundation Support"],
    ["Status:", "OFFICIALLY VERIFIED"],
  ];

  pdf.setFontSize(10);
  details.forEach((row, i) => {
    pdf.setFont(undefined, "bold");
    pdf.text(row[0], col1, startY + i * rowHeight);
    pdf.setFont(undefined, "normal");
    pdf.text(row[1], col2, startY + i * rowHeight);
  });

  // 4. Amount Highlight Box
  pdf.setFillColor(243, 255, 248);
  pdf.setDrawColor(39, 174, 96);
  pdf.roundedRect(pageWidth - 90, 65, 70, 30, 3, 3, "FD");
  
  pdf.setTextColor(39, 174, 96);
  pdf.setFontSize(10);
  pdf.setFont(undefined, "bold");
  pdf.text("TOTAL SETTLEMENT", pageWidth - 55, 75, { align: "center" });
  
  pdf.setFontSize(20);
  pdf.text(`৳ ${payment.amount?.toLocaleString()}`, pageWidth - 55, 87, { align: "center" });

  // 5. Official Seal & Verification
  pdf.setDrawColor(200);
  pdf.line(20, 140, pageWidth - 20, 140);

  pdf.setTextColor(100);
  pdf.setFontSize(8);
  pdf.text("This is a computer-generated document. No physical signature is required for digital verification.", pageWidth / 2, 148, { align: "center" });

  try {
     pdf.addImage("/images/SEAL.png", "PNG", pageWidth - 50, 160, 30, 30);
     pdf.setTextColor(39, 174, 96);
     pdf.setFontSize(14);
     pdf.setFont(undefined, "bold");
     pdf.text("VERIFIED", pageWidth - 35, 178, { align: "center", angle: -15 });
  } catch (e) {}

  // 6. Footer
  pdf.setFillColor(39, 174, 96);
  pdf.rect(0, pageHeight - 15, pageWidth, 15, "F");
  pdf.setTextColor(255);
  pdf.setFontSize(8);
  pdf.text("Alhamdulillah Foundation - Empowering Communities through Transparency", pageWidth / 2, pageHeight - 7, { align: "center" });

  const blobURL = pdf.output("bloburl");
  window.open(blobURL, "_blank");
};
