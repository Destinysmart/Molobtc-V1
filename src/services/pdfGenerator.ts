import { jsPDF } from "jspdf";
import { documentsData, DocPage } from "./pdfDocuments";

/**
 * Generates and downloads a high-fidelity, multi-page academic PDF
 * representing the full content of a sovereign MoloBTC research paper.
 */
export function downloadSovereignPdf(repoId: string, repoName: string): void {
  const currentDoc: DocPage[] = documentsData[repoId] || documentsData["bitcoin-self-custody-sovereign-infrastructure"];
  const totalPages = currentDoc.length;

  // Initialize jsPDF (Standard Letter size: 8.5 x 11 inches -> 612 x 792 pt)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter"
  });

  const pageWidth = 612;
  const pageHeight = 792;
  const marginX = 54; // 0.75 in margin

  currentDoc.forEach((currentPage, pageIdx) => {
    // If it's not the first page, add a new page in the PDF document
    if (pageIdx > 0) {
      doc.addPage();
    }

    let currentY = 50;

    // 1. RUNNING HEADER
    if (currentPage.header) {
      doc.setFont("times", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      
      // Left side header
      doc.text(currentPage.header, marginX, currentY);
      
      // Right side classification
      const classification = `CLASSIFIED NO: BSRF-M-${repoId.slice(0, 4).toUpperCase()}`;
      const classWidth = doc.getTextWidth(classification);
      doc.text(classification, pageWidth - marginX - classWidth, currentY);

      currentY += 8;
      // Header line rule
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(marginX, currentY, pageWidth - marginX, currentY);
      
      currentY += 35;
    }

    // 2. FIRST PAGE TITLE & METADATA
    if (pageIdx === 0) {
      // Main Title
      if (currentPage.title) {
        doc.setFont("times", "bold");
        doc.setFontSize(20);
        doc.setTextColor(17, 24, 39); // deep slate/charcoal

        const titleLines = doc.splitTextToSize(currentPage.title, pageWidth - marginX * 2);
        titleLines.forEach((line: string) => {
          const lineW = doc.getTextWidth(line);
          doc.text(line, (pageWidth - lineW) / 2, currentY);
          currentY += 24;
        });
        currentY += 4;
      }

      // Subtitle
      if (currentPage.subtitle) {
        doc.setFont("times", "italic");
        doc.setFontSize(11);
        doc.setTextColor(75, 85, 99);

        const subtitleLines = doc.splitTextToSize(currentPage.subtitle, pageWidth - marginX * 2 - 20);
        subtitleLines.forEach((line: string) => {
          const lineW = doc.getTextWidth(line);
          doc.text(line, (pageWidth - lineW) / 2, currentY);
          currentY += 16;
        });
        currentY += 10;
      }

      // Orange line accent
      doc.setDrawColor(249, 115, 22); // brand orange (orange-500)
      doc.setLineWidth(1.5);
      doc.line((pageWidth - 40) / 2, currentY, (pageWidth + 40) / 2, currentY);
      currentY += 20;

      // Authors
      if (currentPage.authors) {
        doc.setFont("times", "bold");
        doc.setFontSize(9);
        doc.setTextColor(55, 65, 81);
        const authorW = doc.getTextWidth(currentPage.authors.toUpperCase());
        doc.text(currentPage.authors.toUpperCase(), (pageWidth - authorW) / 2, currentY);
        currentY += 12;
      }

      // Institution
      if (currentPage.institution) {
        doc.setFont("times", "normal");
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        const instW = doc.getTextWidth(currentPage.institution.toUpperCase());
        doc.text(currentPage.institution.toUpperCase(), (pageWidth - instW) / 2, currentY);
        currentY += 30;
      }

      // 3. ABSTRACT BLOCK (ONLY ON FIRST PAGE)
      if (currentPage.abstract) {
        const abstractTitle = currentPage.abstractTitle || "ABSTRACT";
        const abstractW = pageWidth - marginX * 2;
        const padX = 20;
        const padY = 15;
        const textW = abstractW - padX * 2;

        doc.setFont("times", "italic");
        doc.setFontSize(9.5);
        const abstractLines = doc.splitTextToSize(currentPage.abstract, textW);
        const boxHeight = padY * 2 + 15 + abstractLines.length * 14;

        // Draw light gray background box
        doc.setFillColor(249, 250, 251); // gray-50
        doc.rect(marginX, currentY, abstractW, boxHeight, "F");

        // Draw brand orange left border line
        doc.setDrawColor(249, 115, 22); // orange-500
        doc.setLineWidth(2.5);
        doc.line(marginX, currentY, marginX, currentY + boxHeight);

        // Abstract Header Text
        doc.setFont("times", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(124, 45, 18); // orange-900 / warm brown
        doc.text(abstractTitle, marginX + padX, currentY + padY + 4);

        // Abstract Content Text
        doc.setFont("times", "italic");
        doc.setFontSize(9.5);
        doc.setTextColor(55, 65, 81); // gray-700
        
        let abstractTextY = currentY + padY + 18;
        abstractLines.forEach((line: string) => {
          doc.text(line, marginX + padX, abstractTextY);
          abstractTextY += 14;
        });

        currentY += boxHeight + 25;
      }
    }

    // 4. CORE ACADEMIC SECTIONS
    if (currentPage.sections) {
      currentPage.sections.forEach((section) => {
        // Section Heading
        if (section.heading) {
          doc.setFont("times", "bold");
          doc.setFontSize(11);
          doc.setTextColor(17, 24, 39);
          
          doc.text(section.heading, marginX, currentY);
          currentY += 6;

          // Thin underline
          doc.setDrawColor(243, 244, 246); // gray-100
          doc.setLineWidth(1);
          doc.line(marginX, currentY, pageWidth - marginX, currentY);
          
          currentY += 15;
        }

        // Paragraphs
        doc.setFont("times", "normal");
        doc.setFontSize(10.5);
        doc.setTextColor(31, 41, 55); // gray-800

        section.paragraphs.forEach((para) => {
          const paraLines = doc.splitTextToSize(para, pageWidth - marginX * 2);
          
          paraLines.forEach((line: string) => {
            // Check if we are running too close to the footnotes or footer
            if (currentY > pageHeight - 120) {
              // This shouldn't normally happen with our neat page-by-page design data, 
              // but we guard against overflow just in case.
              doc.addPage();
              currentY = 60;
            }
            doc.text(line, marginX, currentY);
            currentY += 15;
          });
          
          currentY += 10; // spacing between paragraphs
        });

        currentY += 5; // spacing between sections
      });
    }

    // 5. FOOTNOTES & CITATIONS (BOTTOM OF THE PAGE)
    if (currentPage.footnotes && currentPage.footnotes.length > 0) {
      let footnoteY = pageHeight - 120; // Anchor footnotes neatly near the bottom of each page
      
      // Separator rule for footnotes
      doc.setDrawColor(229, 231, 235); // gray-200
      doc.setLineWidth(0.5);
      doc.line(marginX, footnoteY - 8, marginX + 120, footnoteY - 8);

      doc.setFont("times", "normal");
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text("FOOTNOTES & CITATIONS", marginX, footnoteY - 1);

      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(107, 114, 128); // gray-500

      currentPage.footnotes.forEach((fn) => {
        const fnLines = doc.splitTextToSize(fn, pageWidth - marginX * 2);
        fnLines.forEach((line: string) => {
          doc.text(line, marginX, footnoteY + 10);
          footnoteY += 11;
        });
        footnoteY += 4;
      });
    }

    // 6. RUNNING FOOTER ON ALL PAGES
    const footerY = pageHeight - 40;
    doc.setDrawColor(243, 244, 246);
    doc.setLineWidth(0.5);
    doc.line(marginX, footerY - 5, pageWidth - marginX, footerY - 5);

    doc.setFont("times", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(156, 163, 175);
    
    // Left side footer
    doc.text("MoloBTC Sovereign Research Institute", marginX, footerY + 8);
    
    // Right side git URL
    const gitUrl = "https://github.com/MoloBTC-Org/bsrf";
    const gitW = doc.getTextWidth(gitUrl);
    doc.text(gitUrl, pageWidth - marginX - gitW, footerY + 8);

    // Centered page numbering
    doc.setFont("times", "bold");
    doc.setTextColor(107, 114, 128);
    const pageStr = `PAGE ${pageIdx + 1} OF ${totalPages}`;
    const pageStrW = doc.getTextWidth(pageStr);
    doc.text(pageStr, (pageWidth - pageStrW) / 2, footerY + 8);
  });

  // Save/Download the completed PDF document
  doc.save(`${repoId}_v1.pdf`);
}
