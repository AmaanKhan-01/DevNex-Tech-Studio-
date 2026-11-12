const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const statusMessage = document.getElementById('form-status');
  const serviceField = document.getElementById('service');
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const messageField = document.getElementById('message');
  const serviceSlugs = {
    packaging: 'Product Packaging Design',
    canva: 'Canva Design',
    graphic: '2D Graphic Design',
    web: 'Web Development',
  };
  const requestedService = new URLSearchParams(window.location.search).get('service');
  if (requestedService && serviceSlugs[requestedService]) {
    serviceField.value = serviceSlugs[requestedService];
  }

  contactForm.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => field.setCustomValidity(''));
    field.addEventListener('change', () => field.setCustomValidity(''));
  });

  const setStatus = (message, state) => {
    statusMessage.replaceChildren(document.createTextNode(message));
    statusMessage.dataset.state = state;
  };

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    statusMessage.removeAttribute('data-state');
    nameField.setCustomValidity(
      nameField.value.trim().length < 2 ? 'Please enter at least two characters for your name.' : '',
    );
    messageField.setCustomValidity(
      messageField.value.trim().length < 20 ? 'Please enter at least 20 characters about your project.' : '',
    );

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      setStatus('Please review the highlighted fields and try again.', 'error');
      const firstInvalidField = contactForm.querySelector(':invalid');
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    const config = window.STUDIO_CONFIG || {};
    const businessEmail = (config.businessEmail || '').trim();
    const data = new FormData(contactForm);
    const inquiry = {
      name: String(data.get('name')).trim(),
      email: String(data.get('email')).trim(),
      service: String(data.get('service')).trim(),
      budget: String(data.get('budget') || 'Not specified').trim(),
      message: String(data.get('message')).trim(),
    };

    const contactEndpoint = (config.contactEndpoint || '').trim();
    if (contactEndpoint) {
      let endpoint;
      try {
        endpoint = new URL(contactEndpoint, window.location.href);
      } catch {
        setStatus('The online inquiry endpoint is not a valid URL. Please contact the studio by email instead.', 'error');
        return;
      }

      if (!['https:', 'http:'].includes(endpoint.protocol) ||
          (endpoint.protocol === 'http:' && endpoint.hostname !== 'localhost' && endpoint.hostname !== '127.0.0.1')) {
        setStatus('The online inquiry endpoint must use HTTPS. Please contact the studio by email instead.', 'error');
        return;
      }

      const submitButton = contactForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      try {
        const response = await fetch(endpoint.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inquiry),
        });
        if (!response.ok) {
          setStatus(`We couldn't submit your inquiry (server response ${response.status}). Please try again or email us directly.`, 'error');
          return;
        }
        contactForm.reset();
        setStatus('Your inquiry was submitted successfully. Thank you for getting in touch.', 'success');
      } catch (error) {
        console.error('Contact form submission failed.', error);
        setStatus("We couldn't submit your inquiry because of a connection error. Please try again or email us directly.", 'error');
      } finally {
        submitButton.disabled = false;
      }
      return;
    }

    if (!businessEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
      setStatus('The studio email is not configured. Add a valid businessEmail in assets/js/config.js before preparing an inquiry.', 'error');
      return;
    }

    const subject = encodeURIComponent(`Project inquiry: ${inquiry.service}`);
    const body = encodeURIComponent(
      `Name: ${inquiry.name}\nEmail: ${inquiry.email}\nService: ${inquiry.service}\nBudget: ${inquiry.budget}\n\nProject details:\n${inquiry.message}`,
    );
    setStatus('Your inquiry is ready, not sent. Open your email app and press Send to deliver it. ', 'ready');
    const emailLink = document.createElement('a');
    emailLink.href = `mailto:${businessEmail}?subject=${subject}&body=${body}`;
    emailLink.textContent = 'Open email app';
    statusMessage.append(emailLink);
  });
}
