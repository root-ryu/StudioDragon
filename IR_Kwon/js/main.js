// IR Meeting Calendar Script
document.addEventListener('DOMContentLoaded', function() {
  // TradingView Widget
  new TradingView.widget({
    "autosize": true,
    "symbol": "NASDAQ:AAPL",
    "interval": "D",
    "timezone": "America/New_York",
    "theme": "light",
    "style": "1",
    "locale": "ko",
    "toolbar_bg": "#f1f3f6",
    "enable_publishing": false,
    "allow_symbol_change": true,
    "hide_side_toolbar": false,
    "container_id": "tradingview_widget"
  });

  // ========================================
  // IR Cards Infinite Slider using GSAP
  // ========================================
  const slider = document.querySelector('.cards_slider');
  if (slider) {
    const cards = Array.from(slider.children);
    const cardWidth = cards[0].offsetWidth;
    const gap = 48; // gap between cards
    const totalWidth = (cardWidth + gap) * cards.length;

    // Clone cards for seamless loop
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      slider.appendChild(clone);
    });

    // Clone again for smooth infinite effect
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      slider.appendChild(clone);
    });

    // GSAP infinite loop animation
    const duration = totalWidth / 50; // Adjust speed (lower = faster)

    gsap.to(slider, {
      x: -totalWidth,
      duration: duration,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: function(x) {
          return (parseFloat(x) % totalWidth) + 'px';
        }
      }
    });

    // Pause on hover
    slider.addEventListener('mouseenter', () => {
      gsap.to(slider, { timeScale: 0, duration: 0.3 });
    });

    slider.addEventListener('mouseleave', () => {
      gsap.to(slider, { timeScale: 1, duration: 0.3 });
    });
  }

  // ========================================
  // Meeting Calendar
  // ========================================
  let selectedMeetingDate = null;
  let selectedMeetingTime = null;

  const meetingCalendar = flatpickr("#meeting_calendar", {
    inline: true,
    locale: "ko",
    dateFormat: "Y.m.d",
    minDate: "today",
    defaultDate: new Date(2025, 10, 12),
    onChange: function(selectedDates, dateStr, instance) {
      selectedMeetingDate = selectedDates[0];
      updateMeetingDate();
    }
  });

  function updateMeetingDate() {
    if (selectedMeetingDate) {
      const year = selectedMeetingDate.getFullYear();
      const month = String(selectedMeetingDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedMeetingDate.getDate()).padStart(2, '0');
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[selectedMeetingDate.getDay()];
      
      document.getElementById('selected_date_display').textContent = 
        `${year}.${month}.${day} (${dayName})`;
    }
    checkMeetingReady();
  }

  // Time slot selection
  const timeSlots = document.querySelectorAll('.time_slot');
  timeSlots.forEach(slot => {
    slot.addEventListener('click', function() {
      timeSlots.forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');
      selectedMeetingTime = this.dataset.time;
      checkMeetingReady();
    });
  });

  function checkMeetingReady() {
    const bookBtn = document.getElementById('book_btn');
    if (selectedMeetingDate && selectedMeetingTime) {
      bookBtn.classList.add('active');
    } else {
      bookBtn.classList.remove('active');
    }
  }

  // Book button click
  document.getElementById('book_btn').addEventListener('click', function() {
    if (this.classList.contains('active')) {
      alert(`IR Meeting reservation completed!\nDate: ${document.getElementById('selected_date_display').textContent}\nTime: ${selectedMeetingTime}`);
    }
  });

  // Initialize
  updateMeetingDate();

  // ========================================
  // Analysis Cards Animation (GSAP ScrollTrigger)
  // ========================================
  gsap.registerPlugin(ScrollTrigger);
  
  const analysisCards = document.querySelectorAll('.analysis_card');
  if (analysisCards.length > 0) {
    analysisCards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 80,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.analysis_section',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          once: true
        },
        delay: index * 0.2
      });
    });
  }
  
});
