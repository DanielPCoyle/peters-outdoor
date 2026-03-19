import QRCode from "qrcode";
import PrintButton from "./PrintButton";

export const metadata = {
  title: "Waiver Sign-In Card — W.H. Peters Outdoor Adventures",
};

const WAIVER_URL = "https://www.petersoutdooradventures.com/waiver";

async function generateQR(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: {
      dark: "#1a2e1a",
      light: "#faf9f6",
    },
    errorCorrectionLevel: "H",
  });
}

export default async function WaiverPostcardPage() {
  const qrDataUrl = await generateQR(WAIVER_URL);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #e5e5e5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 40px 20px;
          font-family: 'Outfit', sans-serif;
        }

        .print-hint {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          color: #666;
          margin-bottom: 24px;
          text-align: center;
        }
        .print-hint strong { color: #1a2e1a; }

        /* ── POSTCARD ─────────────────────────────────────── */
        .postcard {
          width: 6in;
          height: 4in;
          background: #faf9f6;
          border-radius: 8px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
          display: flex;
          overflow: hidden;
          position: relative;
        }

        /* Left panel — dark forest */
        .panel-left {
          width: 2.6in;
          background: #1a2e1a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.3in 0.25in;
          gap: 0.18in;
          position: relative;
        }

        /* subtle texture lines */
        .panel-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            135deg,
            transparent,
            transparent 18px,
            rgba(255,255,255,0.03) 18px,
            rgba(255,255,255,0.03) 19px
          );
          pointer-events: none;
        }

        .logo-wrap img {
          width: 1.5in;
          display: block;
        }

        .divider {
          width: 1in;
          height: 1px;
          background: linear-gradient(to right, transparent, #c8a951, transparent);
        }

        .company-name {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          color: #c8a951;
          text-align: center;
          letter-spacing: 0.04em;
          line-height: 1.4;
        }

        .tagline {
          font-family: 'Outfit', sans-serif;
          font-size: 9px;
          color: #a8c49a;
          text-align: center;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* Right panel — light */
        .panel-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.25in 0.3in;
          gap: 0.14in;
          position: relative;
        }

        /* gold top accent bar */
        .panel-right::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, #c8a951, #e8d591, #c8a951);
        }

        .cta-label {
          font-family: 'Outfit', sans-serif;
          font-size: 9.5px;
          font-weight: 600;
          color: #7a9b6d;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .main-heading {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #1a2e1a;
          text-align: center;
          line-height: 1.2;
        }

        .main-heading span {
          color: #c8a951;
        }

        .body-text {
          font-family: 'Outfit', sans-serif;
          font-size: 9px;
          color: #6b6560;
          text-align: center;
          line-height: 1.5;
          max-width: 2.4in;
        }

        .qr-wrap {
          background: #faf9f6;
          border: 2px solid #1a2e1a;
          border-radius: 6px;
          padding: 6px;
          box-shadow: 3px 3px 0 #c8a951;
        }

        .qr-wrap img {
          display: block;
          width: 1.1in;
          height: 1.1in;
        }

        .url-text {
          font-family: 'Outfit', sans-serif;
          font-size: 8px;
          color: #6b6560;
          letter-spacing: 0.04em;
        }

        /* ── PRINT STYLES ─────────────────────────────────── */
        @media print {
          @page {
            size: 6in 4in;
            margin: 0;
          }

          body {
            background: white;
            padding: 0;
            margin: 0;
            display: block;
          }

          .print-hint { display: none; }
          .print-btn { display: none; }

          .postcard {
            width: 6in;
            height: 4in;
            border-radius: 0;
            box-shadow: none;
          }
        }
      `}</style>

      <p className="print-hint">
        Press <strong>Ctrl+P</strong> (or <strong>⌘+P</strong> on Mac) to print.
        Set paper size to <strong>4×6 inches</strong> and margins to <strong>None</strong>.
      </p>

      <div className="postcard">
        {/* LEFT PANEL */}
        <div className="panel-left">
          <div className="logo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-horizontal-transparent.png" alt="W.H. Peters Outdoor Adventures" />
          </div>
          <div className="divider" />
          <p className="company-name">W.H. Peters<br />Outdoor Adventures</p>
          <p className="tagline">Guided Kayak Eco-Tours</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel-right">
          <p className="cta-label">Before You Head Out</p>
          <h1 className="main-heading">
            Sign Your<br /><span>Liability Waiver</span>
          </h1>
          <p className="body-text">
            All participants must complete a waiver before joining any tour.
            Scan the QR code below with your phone — it only takes a minute!
          </p>
          <div className="qr-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR code to sign waiver" />
          </div>
          <p className="url-text">petersoutdooradventures.com/waiver</p>
        </div>
      </div>

      <PrintButton />
    </>
  );
}
