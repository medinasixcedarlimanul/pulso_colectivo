document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. NAVBAR SCROLL EFFECT
  // ==========================================
  const navbar = document.getElementById('navbar');
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Initial check


  // ==========================================
  // 2. SMOOTH SCROLLING FOR NAVIGATION LINKS
  // ==========================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Calculate header offset
        const headerHeight = navbar.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = targetPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // ==========================================
  // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to track it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null, // viewport
    threshold: 0.1, // trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // offset bottom to feel more organic
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  // ==========================================
  // 4. FORM VALIDATION & SIMULATION
  // ==========================================
  const form = document.getElementById('waitlist-form');
  const formSuccess = document.getElementById('form-success');
  const btnSubmit = document.getElementById('btn-submit');
  const btnReset = document.getElementById('btn-reset-form');
  
  // Form fields
  const fields = {
    name: {
      input: document.getElementById('full-name'),
      error: document.getElementById('error-name'),
      validate: (val) => val.trim().length > 2
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('error-email'),
      validate: (val) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(val).toLowerCase());
      }
    },
    phone: {
      input: document.getElementById('phone'),
      error: document.getElementById('error-phone'),
      validate: (val) => {
        // Basic phone validation (at least 7 characters, allowed digits, spaces, plus, hyphens)
        const cleanVal = val.replace(/[\s\-\+\(\)]/g, '');
        return cleanVal.length >= 7 && /^\d+$/.test(cleanVal);
      }
    },
    frequency: {
      input: document.getElementById('frequency'),
      error: document.getElementById('error-frequency'),
      validate: (val) => val !== '' && val !== null
    }
  };

  // Helper function to validate a specific field
  const validateField = (fieldName) => {
    const field = fields[fieldName];
    const value = field.input.value;
    const isValid = field.validate(value);
    const parentGroup = field.input.closest('.form-group');

    if (!isValid) {
      parentGroup.classList.add('has-error');
    } else {
      parentGroup.classList.remove('has-error');
    }

    return isValid;
  };

  // Live input validation (clears errors as user types)
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    const eventType = key === 'frequency' ? 'change' : 'input';
    
    field.input.addEventListener(eventType, () => {
      validateField(key);
    });
  });

  // Form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let isFormValid = true;
    Object.keys(fields).forEach(key => {
      const isValid = validateField(key);
      if (!isValid) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // 1. Enter Loading State
      btnSubmit.classList.add('loading');
      btnSubmit.disabled = true;
      
      // Disable inputs during submission simulation
      Object.values(fields).forEach(field => {
        field.input.disabled = true;
      });

      // Gather Form Data (Ready for later connection to Formspree, Google Forms, etc.)
      const formData = {
        nombre: fields.name.input.value.trim(),
        email: fields.email.input.value.trim(),
        telefono: fields.phone.input.value.trim(),
        frecuencia: fields.frequency.input.value,
        novedades: document.getElementById('newsletter').checked
      };

      console.log('--- Pulso Colectivo Lead Capture ---');
      console.log(formData);

      // 2. Simulate API Call (1.5 seconds)
      setTimeout(() => {
        // Exit Loading State
        btnSubmit.classList.remove('loading');
        
        // Hide form and show success message
        form.style.display = 'none';
        formSuccess.style.display = 'flex';
        
        // Save flag in localStorage
        localStorage.setItem('pulso_colectivo_registered', 'true');
      }, 1500);
    }
  });

  // Reset/Register another email handler
  btnReset.addEventListener('click', () => {
    // Enable inputs
    Object.values(fields).forEach(field => {
      field.input.disabled = false;
      field.input.value = '';
      field.input.closest('.form-group').classList.remove('has-error');
    });
    
    // Reset select to placeholder
    fields.frequency.input.selectedIndex = 0;
    
    // Reset checkbox
    document.getElementById('newsletter').checked = true;

    // Show form and hide success message
    formSuccess.style.display = 'none';
    form.style.display = 'flex';
    btnSubmit.disabled = false;
  });

});
