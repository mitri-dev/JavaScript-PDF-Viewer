// ELements
const url = '../docs/pdf.pdf';
let pdfDoc = null;
let pageNum = 1;
let pageIsRendering = false;
let pageNumIsPending = null;
let scale = 3;
const totalNumPages = document.querySelector('.total-num-pages');
const currentPage = document.querySelector('.current-page');
const canvas = document.querySelector('.pdf-render');
const ctx = canvas.getContext('2d');

// Buttons
const lowBtn = document.querySelector('.lowBtn');
const midBtn = document.querySelector('.midBtn');
const highBtn = document.querySelector('.highBtn');
const prevBtn = document.querySelector('.prevBtn');
const nextBtn = document.querySelector('.nextBtn');

// Functions
// Render the page
const renderPage = num => {
  pageIsRendering = true;

  // Get page
  pdfDoc.getPage(num).then(page => {
    // Set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    // Output current page
    currentPage.innerHTML = num;
  });
};

// Check for pages renderings
const queueRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

// Show previous page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
};

// Show next page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
};

// Get document
pdfjsLib.getDocument(url).promise.then(pdfDocument => {
  pdfDoc = pdfDocument;
  totalNumPages.innerHTML = `${pdfDoc.numPages}`;
  renderPage(pageNum);
});

// Listeners
nextBtn.addEventListener('click', showNextPage);
prevBtn.addEventListener('click', showPrevPage);

lowBtn.addEventListener('click', () => {
  scale = 1;
  queueRenderPage(pageNum);
});
midBtn.addEventListener('click', () => {
  scale = 3;
  queueRenderPage(pageNum);
});
highBtn.addEventListener('click', () => {
  scale = 7;
  queueRenderPage(pageNum);
});
