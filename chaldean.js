// public/ui_auth.js
// ════════════════════════════════════════════════════════════════════════════
// UI — OWNER LOGIN / SIGNUP
// ════════════════════════════════════════════════════════════════════════════

function renderAuthPage(ownerExists) {
  return `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-symbol">☸</div>
        <h2>${ownerExists ? 'Owner Sign In' : 'Create Owner Account'}</h2>
        <p class="hint" style="margin-bottom:16px">
          ${ownerExists
            ? 'Sign in with your owner email to sync and manage your data.'
            : 'This is your one-time setup. This becomes the only owner account for this site.'}
        </p>
        <form id="auth-form" onsubmit="AuthUI.submit(event, ${ownerExists})">
          ${!ownerExists ? `
          <div class="form-group"><label>Your Name</label><input name="name" type="text" placeholder="Sohanlal" /></div>` : ''}
          <div class="form-group"><label>Email</label><input name="email" type="email" required placeholder="you@example.com" /></div>
          <div class="form-group"><label>Password</label><input name="password" type="password" required minlength="6" placeholder="••••••••" /></div>
          <div id="auth-error" class="auth-error"></div>
          <button class="btn-primary" style="width:100%;margin-top:10px" type="submit">${ownerExists ? 'Sign In' : 'Create Account'}</button>
        </form>
        <button class="btn-secondary" style="width:100%;margin-top:10px" onclick="AuthUI.continueAsVisitor()">Continue without an account (visitor view)</button>
      </div>
    </div>`;
}

const AuthUI = {
  async submit(e, ownerExists) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const errEl = document.getElementById('auth-error');
    errEl.textContent = '';
    try {
      if (ownerExists) {
        await Auth.login(data.get('email'), data.get('password'));
      } else {
        await Auth.signup(data.get('email'), data.get('password'), data.get('name'));
      }
      await App.bootOwnerMode();
    } catch (err) {
      errEl.textContent = err.message;
    }
  },
  continueAsVisitor() {
    App.bootVisitorMode();
  }
};
