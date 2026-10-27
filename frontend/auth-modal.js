/**
 * STACKLY IT - Frontend Authentication & Contact Details Controller
 * Connects website to the configured FastAPI backend.
 */

const API_BASE_URL = (window.STACKLY_API_BASE_URL || '').replace(/\/$/, '');

function showApiUnavailable() {
  showAuthFeedback(
    API_BASE_URL
      ? 'Cannot reach the account service. Please try again later or contact STACKLY IT.'
      : 'Online account access is not configured for this site yet. Please contact STACKLY IT for assistance.',
    'error'
  );
}

const DEFAULT_COMPANY_DETAILS = {
  company_name: 'STACKLY',
  phone_number: '+91 7010792745',
  company_address: 'MMR Complex, Chinna Thirupathi, near Chinna Muniyappan Kovil, Salem, Tamil Nadu 636008',
  linkedin: 'https://www.linkedin.com/company/the-stackly/',
  instagram: 'https://www.instagram.com/thestackly',
  twitter: 'https://x.com/The_Stackly',
  company_website: 'https://thestackly.com/index.html'
};

function initAppModals() {
  // =========================================================================
  // 1. AUTHENTICATION MODAL (SIGN IN / SIGN UP)
  // =========================================================================
  if (!document.getElementById('auth-modal-overlay')) {
    const authModalHtml = `
      <div id="auth-modal-overlay" class="auth-modal-overlay">
        <div class="auth-modal-card">
          <button class="auth-close-btn" id="auth-close-btn" aria-label="Close modal">&times;</button>
          <h2 class="auth-modal-title">STACKLY IT</h2>
          <p class="auth-modal-subtitle">Sign in or create an account to continue</p>
          
          <div class="auth-tabs">
            <button type="button" class="auth-tab-btn active" id="tab-signin-btn">Sign In</button>
            <button type="button" class="auth-tab-btn" id="tab-signup-btn">Sign Up</button>
          </div>

          <!-- SIGN IN FORM -->
          <form id="auth-signin-form">
            <div class="auth-form-group">
              <label for="signin-email">Email Address</label>
              <input type="email" id="signin-email" placeholder="name@company.com" required autocomplete="email">
            </div>
            <div class="auth-form-group">
              <label for="signin-password">Password</label>
              <input type="password" id="signin-password" placeholder="Enter your password" required autocomplete="current-password">
            </div>
            <button type="submit" class="auth-submit-btn" id="signin-submit-btn">Sign In</button>
          </form>

          <!-- SIGN UP FORM -->
          <form id="auth-signup-form" style="display: none;">
            <div class="auth-form-group">
              <label for="signup-name">Full Name</label>
              <input type="text" id="signup-name" placeholder="John Doe" required autocomplete="name">
            </div>
            <div class="auth-form-group">
              <label for="signup-email">Work Email</label>
              <input type="email" id="signup-email" placeholder="name@company.com" required autocomplete="email">
            </div>
            <div class="auth-form-group">
              <label for="signup-password">Password (min 6 characters)</label>
              <input type="password" id="signup-password" placeholder="Create a secure password" minlength="6" required autocomplete="new-password">
            </div>
            <button type="submit" class="auth-submit-btn" id="signup-submit-btn">Create Account</button>
          </form>

          <div id="auth-feedback" class="auth-feedback"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', authModalHtml);
  }

  // =========================================================================
  // 2. CONTACT US COMPANY DETAILS MODAL
  // =========================================================================
  if (!document.getElementById('contact-modal-overlay')) {
    const contactModalHtml = `
      <div id="contact-modal-overlay" class="contact-modal-overlay">
        <div class="contact-modal-card">
          <button class="auth-close-btn" id="contact-close-btn" aria-label="Close modal">&times;</button>
          <h2 class="auth-modal-title" style="color: #1e293b;" id="cm-company-name">STACKLY</h2>
          <p class="auth-modal-subtitle">Official Company Contact & Office Details</p>

          <div class="contact-detail-list">
            <!-- Phone Number -->
            <div class="contact-detail-item">
              <span class="contact-detail-icon">📞</span>
              <div class="contact-detail-content">
                <div class="contact-detail-label">Phone Number</div>
                <div class="contact-detail-value">
                  <a id="cm-phone-link" href="tel:+917010792745">+91 7010792745</a>
                </div>
              </div>
            </div>

            <!-- Address -->
            <div class="contact-detail-item">
              <span class="contact-detail-icon">📍</span>
              <div class="contact-detail-content">
                <div class="contact-detail-label">Company Address</div>
                <div class="contact-detail-value" id="cm-address">
                  MMR Complex, Chinna Thirupathi, near Chinna Muniyappan Kovil, Salem, Tamil Nadu 636008
                </div>
              </div>
            </div>

            <!-- Website -->
            <div class="contact-detail-item">
              <span class="contact-detail-icon">🌐</span>
              <div class="contact-detail-content">
                <div class="contact-detail-label">Company Website</div>
                <div class="contact-detail-value">
                  <a id="cm-website-link" href="https://thestackly.com/index.html" target="_blank" rel="noopener noreferrer">thestackly.com/index.html</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="contact-social-grid">
            <a id="cm-call-btn" href="tel:+917010792745" class="contact-action-btn phone">
              📞 Call +91 7010792745
            </a>
            <a id="cm-linkedin-btn" href="https://www.linkedin.com/company/the-stackly/" target="_blank" rel="noopener noreferrer" class="contact-action-btn linkedin">
              💼 LinkedIn
            </a>
            <a id="cm-instagram-btn" href="https://www.instagram.com/thestackly" target="_blank" rel="noopener noreferrer" class="contact-action-btn instagram">
              📸 Instagram
            </a>
            <a id="cm-twitter-btn" href="https://x.com/The_Stackly" target="_blank" rel="noopener noreferrer" class="contact-action-btn twitter">
              𝕏 Twitter / X
            </a>
            <a id="cm-site-btn" href="https://thestackly.com/index.html" target="_blank" rel="noopener noreferrer" class="contact-action-btn website">
              🌐 Visit STACKLY Website
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', contactModalHtml);
  }

  // =========================================================================
  // 3. LEGAL & POLICIES MODAL (PRIVACY, TERMS, COOKIES)
  // =========================================================================
  if (!document.getElementById('legal-modal-overlay')) {
    const legalModalHtml = `
      <div id="legal-modal-overlay" class="legal-modal-overlay">
        <div class="legal-modal-card">
          <button class="auth-close-btn" id="legal-close-btn" aria-label="Close modal">&times;</button>
          <h2 class="auth-modal-title" style="color: #0f172a; margin-bottom: 2px;">STACKLY IT</h2>
          <p class="auth-modal-subtitle">Legal Agreements, Policies & Compliance</p>

          <div class="legal-tabs">
            <button type="button" class="legal-tab-btn active" id="tab-privacy-btn">Privacy Policy</button>
            <button type="button" class="legal-tab-btn" id="tab-terms-btn">Terms of Service</button>
            <button type="button" class="legal-tab-btn" id="tab-cookies-btn">Cookie Policy</button>
          </div>

          <div class="legal-modal-body" id="legal-modal-body"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', legalModalHtml);
  }

  // Auth elements
  const authOverlay = document.getElementById('auth-modal-overlay');
  const authCloseBtn = document.getElementById('auth-close-btn');
  const tabSignIn = document.getElementById('tab-signin-btn');
  const tabSignUp = document.getElementById('tab-signup-btn');
  const formSignIn = document.getElementById('auth-signin-form');
  const formSignUp = document.getElementById('auth-signup-form');
  const authFeedback = document.getElementById('auth-feedback');

  // Contact elements
  const contactOverlay = document.getElementById('contact-modal-overlay');
  const contactCloseBtn = document.getElementById('contact-close-btn');

  function showAuthFeedback(message, type) {
    authFeedback.className = `auth-feedback ${type}`;
    authFeedback.textContent = message;
    authFeedback.style.display = 'block';
  }

  function clearAuthFeedback() {
    authFeedback.className = 'auth-feedback';
    authFeedback.textContent = '';
    authFeedback.style.display = 'none';
  }

  function openAuthModal(defaultTab = 'signin') {
    clearAuthFeedback();
    switchAuthTab(defaultTab);
    authOverlay.classList.add('active');
  }

  function closeAuthModal() {
    authOverlay.classList.remove('active');
    clearAuthFeedback();
  }

  function switchAuthTab(tab) {
    clearAuthFeedback();
    if (tab === 'signin') {
      tabSignIn.classList.add('active');
      tabSignUp.classList.remove('active');
      formSignIn.style.display = 'block';
      formSignUp.style.display = 'none';
      document.getElementById('signin-email').focus();
    } else {
      tabSignUp.classList.add('active');
      tabSignIn.classList.remove('active');
      formSignIn.style.display = 'none';
      formSignUp.style.display = 'block';
      document.getElementById('signup-name').focus();
    }
  }

  // Tab Events
  tabSignIn.addEventListener('click', () => switchAuthTab('signin'));
  tabSignUp.addEventListener('click', () => switchAuthTab('signup'));

  // Auth Close Events
  authCloseBtn.addEventListener('click', closeAuthModal);
  authOverlay.addEventListener('click', (e) => {
    if (e.target === authOverlay) closeAuthModal();
  });

  // Contact Close Events
  contactCloseBtn.addEventListener('click', () => contactOverlay.classList.remove('active'));
  contactOverlay.addEventListener('click', (e) => {
    if (e.target === contactOverlay) contactOverlay.classList.remove('active');
  });

  // Open Contact Modal with Live Data
  async function openContactModal() {
    contactOverlay.classList.add('active');
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`);
      if (response.ok) {
        const data = await response.json();
        document.getElementById('cm-company-name').textContent = data.company_name;
        document.getElementById('cm-phone-link').textContent = data.phone_number;
        document.getElementById('cm-phone-link').href = `tel:${data.phone_number.replace(/\s+/g, '')}`;
        document.getElementById('cm-address').textContent = data.company_address;
        document.getElementById('cm-website-link').href = data.company_website;
        document.getElementById('cm-website-link').textContent = data.company_website.replace('https://', '');
        document.getElementById('cm-call-btn').href = `tel:${data.phone_number.replace(/\s+/g, '')}`;
        document.getElementById('cm-call-btn').textContent = `📞 Call ${data.phone_number}`;
        document.getElementById('cm-linkedin-btn').href = data.linkedin;
        document.getElementById('cm-instagram-btn').href = data.instagram;
        const twitterUrl = data.twitter || DEFAULT_COMPANY_DETAILS.twitter;
        const twBtn = document.getElementById('cm-twitter-btn');
        if (twBtn) twBtn.href = twitterUrl;
        document.getElementById('cm-site-btn').href = data.company_website;
      }
    } catch (e) {
      console.log('Using default canonical contact details');
    }
  }

  // Hook Contact Us triggers
  document.querySelectorAll('.contact, a[href="#contact"], a[href="index.html#contact"], a[href="mailto:hello@stacklyit.com"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  });

  // Make footer social icons clickable with official links
  document.querySelectorAll('.social').forEach(socialContainer => {
    const icons = socialContainer.children;
    // 𝕏 (first icon) -> Twitter / X
    if (icons[0]) {
      icons[0].style.cursor = 'pointer';
      icons[0].title = 'STACKLY on 𝕏 (Twitter)';
      icons[0].addEventListener('click', () => window.open(DEFAULT_COMPANY_DETAILS.twitter, '_blank'));
    }
    // ◎ (Instagram)
    if (icons[1]) {
      icons[1].style.cursor = 'pointer';
      icons[1].title = 'STACKLY Instagram';
      icons[1].addEventListener('click', () => window.open(DEFAULT_COMPANY_DETAILS.instagram, '_blank'));
    }
    // in (LinkedIn)
    if (icons[2]) {
      icons[2].style.cursor = 'pointer';
      icons[2].title = 'STACKLY LinkedIn';
      icons[2].addEventListener('click', () => window.open(DEFAULT_COMPANY_DETAILS.linkedin, '_blank'));
    }
  });

  // =========================================================================
  // Legal & Policies Controller (Privacy, Terms, Cookies)
  // =========================================================================
  const legalOverlay = document.getElementById('legal-modal-overlay');
  const legalCloseBtn = document.getElementById('legal-close-btn');
  const tabPrivacyBtn = document.getElementById('tab-privacy-btn');
  const tabTermsBtn = document.getElementById('tab-terms-btn');
  const tabCookiesBtn = document.getElementById('tab-cookies-btn');
  const legalBody = document.getElementById('legal-modal-body');

  const LEGAL_CONTENT = {
    privacy: `
      <h3>1. Information We Collect</h3>
      <p>STACKLY IT collects only necessary information provided when you register, log in, subscribe, or submit an IT service enquiry. This includes your name, email address, phone number, company name, and project requirements.</p>
      
      <h3>2. How We Protect Your Data</h3>
      <p>All passwords are encrypted before storage using salted bcrypt hashing. Sensitive enquiries and contact requests are securely maintained in our private MySQL database and are never shared or sold to third parties.</p>

      <h3>3. Data Retention & Your Rights</h3>
      <p>You may request to inspect, update, or remove your personal data at any time by contacting our privacy team at <a href="mailto:hello@stacklyit.com" style="color: #2563eb;">hello@stacklyit.com</a> or calling +91 7010792745.</p>

      <h3>4. Office Contact</h3>
      <p>MMR Complex, Chinna Thirupathi, near Chinna Muniyappan Kovil, Salem, Tamil Nadu 636008.</p>
    `,
    terms: `
      <h3>1. Acceptance of Terms</h3>
      <p>By accessing or using the STACKLY IT website and services, you agree to be bound by these Terms of Service. If you do not agree, please discontinue using the website.</p>

      <h3>2. Description of Services</h3>
      <p>STACKLY IT provides enterprise IT solutions, including Managed IT Services, Cybersecurity, Cloud Infrastructure Migration, and IT Strategic Consulting.</p>

      <h3>3. User Conduct</h3>
      <p>You agree not to submit fraudulent enquiries, attempt unauthorized access to backend APIs, or disrupt normal site operations. Administrator-only routes are strictly protected by role-based access controls.</p>

      <h3>4. Limitation of Liability</h3>
      <p>STACKLY IT delivers services in accordance with high industry standards. All content and materials are provided "as is" for informational and engagement purposes.</p>
    `,
    cookies: `
      <h3>1. What Are Cookies & Local Storage?</h3>
      <p>Cookies and web storage technologies allow websites to remember user preferences and active sessions for a seamless browsing experience.</p>

      <h3>2. How STACKLY IT Uses Storage</h3>
      <ul>
        <li><strong>Session Tokens (localStorage):</strong> Securely stores your signed JWT access token so you remain logged in across page visits.</li>
        <li><strong>Enquiry References (sessionStorage):</strong> Temporarily stores your generated enquiry reference number so it can be displayed on the confirmation page.</li>
      </ul>

      <h3>3. No Third-Party Tracking</h3>
      <p>We do not use advertising trackers, third-party cookies, or cross-site data analytics that follow you outside this website.</p>
    `
  };

  function switchLegalTab(tab) {
    [tabPrivacyBtn, tabTermsBtn, tabCookiesBtn].forEach(btn => btn.classList.remove('active'));
    if (tab === 'privacy') {
      tabPrivacyBtn.classList.add('active');
      legalBody.innerHTML = LEGAL_CONTENT.privacy;
    } else if (tab === 'terms') {
      tabTermsBtn.classList.add('active');
      legalBody.innerHTML = LEGAL_CONTENT.terms;
    } else if (tab === 'cookies') {
      tabCookiesBtn.classList.add('active');
      legalBody.innerHTML = LEGAL_CONTENT.cookies;
    }
    legalBody.scrollTop = 0;
  }

  function openLegalModal(tab = 'privacy') {
    switchLegalTab(tab);
    legalOverlay.classList.add('active');
  }

  legalCloseBtn.addEventListener('click', () => legalOverlay.classList.remove('active'));
  legalOverlay.addEventListener('click', (e) => {
    if (e.target === legalOverlay) legalOverlay.classList.remove('active');
  });

  tabPrivacyBtn.addEventListener('click', () => switchLegalTab('privacy'));
  tabTermsBtn.addEventListener('click', () => switchLegalTab('terms'));
  tabCookiesBtn.addEventListener('click', () => switchLegalTab('cookies'));

  // Hook all footer legal links (Privacy, Terms, Cookies)
  document.querySelectorAll('.legal-links span').forEach(el => {
    const text = el.textContent.trim().toLowerCase();
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (text.includes('privacy')) openLegalModal('privacy');
      else if (text.includes('terms')) openLegalModal('terms');
      else if (text.includes('cookie')) openLegalModal('cookies');
    });
  });

  // Check login state and update header buttons
  function refreshUserState() {
    const token = localStorage.getItem('stackly_token');
    const userJson = localStorage.getItem('stackly_user');
    const user = userJson ? JSON.parse(userJson) : null;

    document.querySelectorAll('.signup').forEach(btn => {
      if (token && user) {
        btn.textContent = `👤 ${user.name.split(' ')[0]} (Sign Out)`;
        btn.classList.add('logged-in');
        btn.title = `Logged in as ${user.name} (${user.email}). Click to Sign Out.`;
      } else {
        btn.textContent = 'Sign In / Sign Up';
        btn.classList.remove('logged-in');
        btn.title = 'Click to Sign In or Create an Account';
      }
    });
  }

  // Hook all .signup buttons
  document.querySelectorAll('.signup').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const token = localStorage.getItem('stackly_token');
      const userJson = localStorage.getItem('stackly_user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (token && user) {
        if (confirm(`You are logged in as ${user.name} (${user.email}).\n\nDo you want to sign out?`)) {
          // Perform server-side logout
          fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).finally(() => {
            localStorage.removeItem('stackly_token');
            localStorage.removeItem('stackly_user');
            refreshUserState();
            alert('You have been signed out successfully.');
          });
        }
      } else {
        openAuthModal('signin');
      }
    });
  });

  // Handle Sign In Submit
  formSignIn.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAuthFeedback();

    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;
    const submitBtn = document.getElementById('signin-submit-btn');

    if (!API_BASE_URL) {
      showApiUnavailable();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        showAuthFeedback(data.detail || 'Login failed. Please check your credentials.', 'error');
        return;
      }

      // Save token and user
      localStorage.setItem('stackly_token', data.access_token);
      localStorage.setItem('stackly_user', JSON.stringify(data.user));

      showAuthFeedback(`Welcome back, ${data.user.name}!`, 'success');
      refreshUserState();

      setTimeout(() => {
        closeAuthModal();
        formSignIn.reset();
      }, 1000);

    } catch (err) {
      showApiUnavailable();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });

  // Handle Sign Up (Registration) Submit
  formSignUp.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAuthFeedback();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const submitBtn = document.getElementById('signup-submit-btn');

    if (!API_BASE_URL) {
      showApiUnavailable();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'user' })
      });

      const data = await response.json();

      if (!response.ok) {
        showAuthFeedback(data.detail || 'Registration failed. Email might already exist.', 'error');
        return;
      }

      showAuthFeedback('Account created successfully! Switching to sign in...', 'success');
      formSignUp.reset();

      setTimeout(() => {
        switchAuthTab('signin');
        document.getElementById('signin-email').value = email;
        document.getElementById('signin-password').focus();
        showAuthFeedback('Please enter your password to sign in.', 'success');
      }, 1200);

    } catch (err) {
      showApiUnavailable();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  });

  // Handle Newsletter / Email Subscription
  document.querySelectorAll('form.subscribe').forEach(form => {
    form.removeAttribute('onsubmit');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"]');
      if (!input || !input.value.trim()) return;

      const email = input.value.trim();
      const originalBtnText = btn ? btn.textContent : 'Subscribe';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Subscribing...';
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (response.ok) {
          if (btn) {
            btn.textContent = '✓ Subscribed!';
            btn.style.background = '#059669';
            btn.style.color = '#ffffff';
            setTimeout(() => {
              btn.textContent = originalBtnText;
              btn.style.background = '';
              btn.style.color = '';
              btn.disabled = false;
            }, 3000);
          }
          input.value = '';
          alert(data.message || 'Thank you for subscribing to STACKLY IT updates!');
        } else {
          alert(data.detail || 'Subscription failed. Please check your email.');
          if (btn) {
            btn.disabled = false;
            btn.textContent = originalBtnText;
          }
        }
      } catch (err) {
        alert('Online subscription is unavailable. Your email app will open with a subscription request. Review and send it to complete your request.');
        window.location.href = `mailto:hello@stacklyit.com?subject=${encodeURIComponent('STACKLY IT newsletter subscription')}&body=${encodeURIComponent(`Please subscribe ${email} to STACKLY IT updates.`)}`;
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalBtnText;
        }
      }
    });
  });

  refreshUserState();
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAppModals);
} else {
  initAppModals();
}
