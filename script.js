const previous = document.getElementById('btnPrevious');
const next = document.getElementById('btnNext');
const gallery = document.getElementById('image-gallery');
const pageIndicator = document.getElementById('page');
const galleryDots = document.getElementById('gallery-dots');

let images = [];
const perPage = 20;
let currentPage = 1;
let pages = 0;

// Load images from JSON file
fetch('uploads.json')
  .then(response => response.json())
  .then(data => {
    images = data;
    pages = Math.ceil(images.length / perPage);
    setupGalleryDots();
    showImages();
  })
  .catch(error => {
    console.error('Error loading image data:', error);
  });

// Set up gallery dots
function setupGalleryDots() {
  for (let i = 0; i < pages; i++) {
    const dot = document.createElement('button');
    const dotSpan = document.createElement('span');
    const dotNumber = document.createTextNode(i + 1);
    dot.classList.add('gallery-dot');
    dot.setAttribute('data-index', i);
    dotSpan.classList.add('sr-only');

    dotSpan.appendChild(dotNumber);
    dot.appendChild(dotSpan);

    dot.addEventListener('click', function(e) {
      const self = e.target;
      goToPage(self.getAttribute('data-index'));
    });

    galleryDots.appendChild(dot);
  }
}

// Previous Button
previous.addEventListener('click', function() {
  if (currentPage === 1) {
    currentPage = 1;
  } else {
    currentPage--;
    showImages();
  }
});

// Next Button
next.addEventListener('click', function() {
  if (currentPage < pages) {
    currentPage++;
    showImages();
  }
});

// Jump to page
function goToPage(index) {
  index = parseInt(index);
  currentPage = index + 1;

  showImages();
}

// Load images
function showImages() {
  while (gallery.firstChild) {
    gallery.removeChild(gallery.firstChild);
  }

  const offset = (currentPage - 1) * perPage;
  const dots = document.querySelectorAll('.gallery-dot');

  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentPage - 1].classList.add('active');

  for (let i = offset; i < offset + perPage; i++) {
    if (images[i]) {
      const template = document.createElement('div');
      const title = document.createElement('p');
      const titleText = document.createTextNode(images[i].filename);
      const img = document.createElement('img');

      template.classList.add('template');
      img.setAttribute('src', `https://marbetpepper.fra1.cdn.digitaloceanspaces.com/uploads/dec734f2-50fc-43c7-840b-339ea0499814/${images[i].filename}`);
      img.setAttribute('alt', images[i].filename);

      title.appendChild(titleText);
      template.appendChild(img);
      template.appendChild(title);
      gallery.appendChild(template);
    }
  }

  // Animate images
  const galleryItems = document.querySelectorAll('.template');
  galleryItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('animate');
    }, index * 100);
  });

  // Update page indicator
  pageIndicator.textContent = `Page ${currentPage} of ${pages}`;
}
