"use client";

declare global {
  interface Window {
    html2pdf?: () => {
      set: (options: Record<string, unknown>) => {
        from: (element: Element | null) => {
          save: () => Promise<void>;
        };
      };
    };
  }
}

type PdfSection = {
  title: string;
  body: string;
};

type ExercisePdfOptions = {
  fileName: string;
  title: string;
  subtitle: string;
  participantEmail: string;
  statusLine: string;
  sections: PdfSection[];
};

let scriptPromise: Promise<void> | null = null;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function ensureHtml2Pdf() {
  if (typeof window === "undefined") return;
  if (window.html2pdf) return;

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("تعذر تحميل مكتبة PDF."));
      document.head.appendChild(script);
    });
  }

  await scriptPromise;
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function waitForPdfAssets(root: HTMLElement) {
  await new Promise((resolve) => window.requestAnimationFrame(resolve));

  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map((image) =>
      image.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            image.onload = resolve;
            image.onerror = resolve;
          })
    )
  );

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  await delay(180);
}

export async function downloadExercisePdf(options: ExercisePdfOptions) {
  await ensureHtml2Pdf();

  if (typeof window === "undefined" || !window.html2pdf) {
    throw new Error("تعذر تجهيز PDF في هذا المتصفح.");
  }

  const exportRoot = document.createElement("div");
  exportRoot.className = "exercise-pdf-root";
  const today = new Date().toLocaleDateString("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  exportRoot.innerHTML = `
    <section class="exercise-pdf-sheet">
      <header class="exercise-pdf-head">
        <div class="exercise-pdf-brand">
          <img src="/brand/dr-mohammad-logo.png" alt="" />
          <div>
            <div class="exercise-pdf-kicker">بوابة الدورة</div>
            <div class="exercise-pdf-title">${escapeHtml(options.title)}</div>
            <p class="exercise-pdf-subtitle">${escapeHtml(options.subtitle)}</p>
          </div>
        </div>
        <div class="exercise-pdf-meta">
          <span>البريد: ${escapeHtml(options.participantEmail)}</span>
          <span>التاريخ: ${escapeHtml(today)}</span>
        </div>
      </header>

      <section class="exercise-pdf-highlight">
        <strong>${escapeHtml(options.statusLine)}</strong>
      </section>

      <div class="exercise-pdf-sections">
        ${options.sections
          .map(
            (section) => `
              <article class="exercise-pdf-card">
                <h3>${escapeHtml(section.title)}</h3>
                <p>${escapeHtml(section.body).replaceAll("\n", "<br />")}</p>
              </article>
            `
          )
          .join("")}
      </div>

      <footer class="exercise-pdf-footer">
        الذكاء الاصطناعي للقادة والمدراء
      </footer>
    </section>
  `;

  document.body.appendChild(exportRoot);

  try {
    await waitForPdfAssets(exportRoot);

    await window
      .html2pdf()
      .set({
        margin: 0,
        filename: options.fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          width: 794,
          windowWidth: 794,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(exportRoot.firstElementChild)
      .save();
  } finally {
    exportRoot.remove();
  }
}
