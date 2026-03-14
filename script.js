// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      alert('Mobile menu coming soon (or keep it minimal for now)');
      // You can add real mobile menu logic here later
    });
  }

  // Waitlist form – Firebase or Google Sheets submission
  const form = document.getElementById('waitlistForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name  = form.querySelector('input[name="name"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();

      if (!name || !email) {
        alert('Please fill both fields');
        return;
      }

      alert('Thank you! You are now on the waitlist ✨\n\n(Real submission coming soon – currently just a demo)');

      // Optional: real Firebase submission code here (same as your previous version)
      // await addDoc(collection(db, 'waitlist'), { name, email, timestamp: serverTimestamp() });
      
      form.reset();
    });
  }
});
