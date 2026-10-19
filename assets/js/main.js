/**
 * HOMEWARD HOUSING SYSTEMS - LÜKS SERA & KIŞ BAHÇESİ MİMARİSİ
 * İnteraktif Javascript Motoru
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. HEADER SCROLL & BACK TO TOP
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 2. MOBİL MENÜ TOGGLE
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggle.innerHTML = isOpen ? '✕' : '☰';
    });
  }

  // 3. İKLİM & İZOLASYON SİMÜLATÖRÜ (HOME PAGE & TEKNOLOJİ SAYFASI)
  const tempButtons = document.querySelectorAll('.temp-btn');
  const modelChoiceBtns = document.querySelectorAll('.model-choice-btn');
  const outsideValEl = document.getElementById('outsideTempVal');
  const insideValEl = document.getElementById('insideTempVal');
  const retentionFillEl = document.getElementById('retentionFill');
  const retentionValEl = document.getElementById('retentionVal');
  const solarEffFillEl = document.getElementById('solarEffFill');
  const solarEffValEl = document.getElementById('solarEffVal');
  const climateDescEl = document.getElementById('simClimateDesc');

  // Model & Sıcaklık Veri Matrisi (PDF'teki resmi veriler doğrultusunda)
  const simData = {
    'gm100-4': {
      name: 'GM100-4 / GM100-4S',
      baseInside: { '-20': 12, '-7': 18, '0': 20, '15': 24 },
      solarBonus: 2,
      retention: '92%',
      solarEff: '85%',
      wallType: '4 Cidarlı Polikarbon + Entegre Solar Jaluzi'
    },
    'gm22-3': {
      name: 'GM22-3 / GM22-3S',
      baseInside: { '-20': 15, '-7': 25, '0': 26, '15': 27 },
      solarBonus: 3,
      retention: '95%',
      solarEff: '88%',
      wallType: '3 Cidarlı Yüksek Termal Bariyerli Polikarbon'
    },
    'gm22-4': {
      name: 'GM22-4 / GM22-4S',
      baseInside: { '-20': 18, '-7': 26, '0': 27, '15': 28 },
      solarBonus: 3,
      retention: '97%',
      solarEff: '92%',
      wallType: '4 Cidarlı Ekstrem Soğuk İklim Serisi'
    },
    'gm22-5': {
      name: 'GM22-5 / GM22-5S',
      baseInside: { '-20': 25, '-7': 28, '0': 28, '15': 29 },
      solarBonus: 4,
      retention: '99%',
      solarEff: '96%',
      wallType: '5 Kademeli Termal Zırh & Çift EPDM Yeşil Conta'
    }
  };

  let selectedTemp = '-20';
  let selectedModel = 'gm22-5';

  function updateSimulator() {
    if (!outsideValEl || !insideValEl) return;

    const currentModelData = simData[selectedModel];
    const insideT = currentModelData.baseInside[selectedTemp] || 22;

    outsideValEl.textContent = `${selectedTemp}°C`;
    insideValEl.textContent = `+${insideT}°C`;

    if (retentionFillEl && retentionValEl) {
      retentionFillEl.style.width = currentModelData.retention;
      retentionValEl.textContent = currentModelData.retention;
    }

    if (solarEffFillEl && solarEffValEl) {
      solarEffFillEl.style.width = currentModelData.solarEff;
      solarEffValEl.textContent = currentModelData.solarEff;
    }

    if (climateDescEl) {
      climateDescEl.innerHTML = `<strong>${currentModelData.name}:</strong> Dışarısı <strong>${selectedTemp}°C</strong> iken patentli <em>${currentModelData.wallType}</em> sayesinde iç mekan sıcaklığı <strong>+${insideT}°C</strong> olarak kesintisiz korunur.`;
    }
  }

  tempButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tempButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTemp = btn.getAttribute('data-temp') || '-20';
      updateSimulator();
    });
  });

  modelChoiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modelChoiceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedModel = btn.getAttribute('data-model') || 'gm22-5';
      updateSimulator();
    });
  });

  updateSimulator();

  // 4. FOTO GALERİ FİLTRELEME & LIGHTBOX
  const filterBtns = document.querySelectorAll('.gallery-filter-bar .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryList = [];
  let currentImgIndex = 0;

  // Filtreleme
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterCategory = btn.getAttribute('data-filter') || 'all';

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterCategory === 'all' || itemCat === filterCategory) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Tıklama
  function setupLightboxTriggers() {
    const clickableItems = document.querySelectorAll('[data-lightbox-src]');
    currentGalleryList = Array.from(clickableItems);

    clickableItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        currentImgIndex = index;
        openLightbox();
      });
    });
  }

  function openLightbox() {
    if (!lightboxModal || currentGalleryList.length === 0) return;
    const targetItem = currentGalleryList[currentImgIndex];
    const src = targetItem.getAttribute('data-lightbox-src') || targetItem.querySelector('img')?.src;
    const title = targetItem.getAttribute('data-title') || targetItem.querySelector('h4')?.textContent || 'Homeward Mimari Görseli';

    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = title;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function nextLightbox() {
    if (currentGalleryList.length === 0) return;
    currentImgIndex = (currentImgIndex + 1) % currentGalleryList.length;
    openLightbox();
  }

  function prevLightbox() {
    if (currentGalleryList.length === 0) return;
    currentImgIndex = (currentImgIndex - 1 + currentGalleryList.length) % currentGalleryList.length;
    openLightbox();
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxNext?.addEventListener('click', nextLightbox);
  lightboxPrev?.addEventListener('click', prevLightbox);

  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });

  setupLightboxTriggers();

  // 5. VIDEO MODAL OYNATICI
  const videoCards = document.querySelectorAll('.video-card');
  const videoModal = document.getElementById('videoModal');
  const videoModalFrame = document.getElementById('videoModalFrame');
  const videoModalClose = document.getElementById('videoModalClose');

  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const videoTitle = card.querySelector('h4')?.textContent || 'Tanıtım Videosu';
      const videoDesc = card.querySelector('p')?.textContent || '';
      
      if (videoModal && videoModalFrame) {
        // Zengin simüle edilmiş video oynatıcı içeriği
        videoModalFrame.innerHTML = `
          <div style="background:#000; border-radius:12px; overflow:hidden; position:relative; aspect-ratio:16/9; display:flex; flex-direction:column; justify-content:center; align-items:center; color:#FFF; text-align:center; padding:2rem;">
            <div style="font-size:3.5rem; color:#C5A36A; margin-bottom:1rem; animation: pulse 2s infinite;">🎬</div>
            <h3 style="font-size:1.6rem; color:#FFF; margin-bottom:0.5rem;">${videoTitle}</h3>
            <p style="color:#94A3B8; max-width:600px; font-size:0.95rem; line-height:1.6;">${videoDesc}</p>
            <div style="margin-top:2rem; display:flex; gap:1rem;">
              <span style="background:rgba(16,185,129,0.2); border:1px solid #10B981; color:#34D399; padding:0.4rem 1rem; border-radius:999px; font-size:0.85rem; font-weight:600;">4K Ultra HD 3D Render Simülasyonu</span>
              <span style="background:rgba(255,255,255,0.1); padding:0.4rem 1rem; border-radius:999px; font-size:0.85rem;">60 FPS</span>
            </div>
            <div style="margin-top:2rem; width:80%; height:4px; background:rgba(255,255,255,0.2); border-radius:4px; position:relative;">
              <div style="width:45%; height:100%; background:#C5A36A; border-radius:4px;"></div>
            </div>
          </div>
        `;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  videoModalClose?.addEventListener('click', () => {
    if (videoModal) {
      videoModal.classList.remove('active');
      if (videoModalFrame) videoModalFrame.innerHTML = '';
      document.body.style.overflow = 'auto';
    }
  });

  videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      videoModal.classList.remove('active');
      if (videoModalFrame) videoModalFrame.innerHTML = '';
      document.body.style.overflow = 'auto';
    }
  });

  // 6. FAQ ACCORDION
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 7. TEKLİF & İLETİŞİM FORMU DOĞRULAMA & BİLDİRİM
  const quoteForm = document.getElementById('quoteForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  quoteForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Gönder';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'İletiliyor...';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
      if (formSuccessAlert) {
        formSuccessAlert.style.display = 'block';
        quoteForm.reset();
        setTimeout(() => {
          formSuccessAlert.style.display = 'none';
        }, 8000);
      } else {
        alert('Talebiniz başarıyla alındı! Mimari proje uzmanımız en kısa sürede sizinle iletişime geçecektir.');
        quoteForm.reset();
      }
    }, 1000);
  });

  // 8. PATENTLERİMİZ KATEGORİ FİLTRELEME
  const patentFilterBtns = document.querySelectorAll('.patent-filter-btn');
  const patentCards = document.querySelectorAll('.patent-card');

  if (patentFilterBtns.length > 0 && patentCards.length > 0) {
    patentFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        patentFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterCategory = btn.getAttribute('data-filter') || 'all';

        patentCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterCategory === 'all' || cardCategory === filterCategory) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 9. MOBİL DROPDOWN TIKLAMA DESTEĞİ
  const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
  const dropdownParent = document.querySelector('.nav-item-dropdown');

  dropdownToggle?.addEventListener('click', (e) => {
    // Mobil görünümde tıklayınca menüyü aç/kapat
    if (window.innerWidth <= 768) {
      // Eğer kullanıcı doğrudan ana linke değil de oka veya kapalıyken tıkladıysa menüyü aç
      if (!dropdownParent.classList.contains('open')) {
        e.preventDefault();
        dropdownParent.classList.add('open');
      }
    }
  });
});
