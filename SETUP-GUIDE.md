# Operation Lumina Website - Setup Guide

Welcome! This guide will help you configure your enhanced Operation Lumina website with all the new features.

## 📁 File Structure

Create the following folder structure where your `index.html` is located:

```
your-website/
├── index.html (the enhanced version)
├── audio/
│   ├── aurora-intro.mp3
│   ├── aurora-story.mp3
│   ├── aurora-features.mp3
│   └── aurora-presale.mp3
└── images/
    ├── aurora-1.jpg
    ├── aurora-2.jpg
    └── aurora-3.jpg
```

---

## 🎵 Step 1: Add Your Audio Files

### What You Need:
- 4 audio recordings (as MP3 or WAV files)
- Each should be a voice-over for different sections

### Audio Files Needed:

1. **aurora-intro.mp3** - Aurora introducing herself (1-2 minutes)
2. **aurora-story.mp3** - The full Aurora origin story (2-3 minutes)
3. **aurora-features.mp3** - Description of Aurora's features (2-3 minutes)
4. **aurora-presale.mp3** - Founding Agent opportunity explanation (1-2 minutes)

### How to Add:
1. Create an `audio` folder in the same directory as your HTML file
2. Save your audio files with the exact names above
3. The website will automatically play them when users click the listen buttons

### Audio Tips:
- Keep files under 10MB for fast loading
- Use a warm, friendly voice (ideally female for Aurora's character)
- Add gentle background music (optional but nice!)
- Export as MP3 at 128kbps for good quality and small file size

---

## 🖼️ Step 2: Add Your Images

### What You Need:
- 3 promotional images showcasing Operation Lumina

### Image Suggestions:

1. **aurora-1.jpg** - Screenshot of Aurora's interface or app mockup
2. **aurora-2.jpg** - Child interacting with Aurora (illustration or photo)
3. **aurora-3.jpg** - Feature showcase or parent dashboard view

### How to Add:
1. Create an `images` folder in the same directory as your HTML file
2. Save your images with the exact names above
3. In the HTML file, find the Image Gallery section (around line 585)
4. Uncomment the `<img>` tags by removing the `<!--` and `-->` markers
5. Remove or comment out the placeholder divs

### Image Tips:
- Recommended size: 800x600px or similar aspect ratio
- Keep files under 500KB each
- Use JPG for photos, PNG for graphics with transparency
- Optimize images before uploading (use TinyPNG.com)

---

## 📧 Step 3: Set Up Form Integration (Formspree)

Forms currently won't work until you connect them to Formspree (free email service).

### Setup Process:

1. **Go to [Formspree.io](https://formspree.io)**
2. **Create a free account**
3. **Create two forms:**
   - One named "Waitlist" 
   - One named "Contact"
4. **Get your form IDs** (they look like: `xyzabc123`)
5. **Update the HTML file:**

Find this section near line 1028:
```javascript
const WAITLIST_FORM_ID = 'YOUR_WAITLIST_FORM_ID';
const CONTACT_FORM_ID = 'YOUR_CONTACT_FORM_ID';
```

Replace with your actual form IDs:
```javascript
const WAITLIST_FORM_ID = 'xyzabc123';
const CONTACT_FORM_ID = 'def456ghi';
```

### What This Does:
- Waitlist form submissions will email you the details
- Contact form submissions will email you the messages
- You'll get notifications for every submission
- Free tier: 50 submissions/month (more than enough to start!)

---

## 💳 Step 4: Set Up Payment Processing (Stripe)

To accept the $99 Founding Agent payments, you need a Stripe account.

### Setup Process:

1. **Go to [Stripe.com](https://stripe.com)**
2. **Create an account**
3. **Complete your business verification**
4. **Get your Publishable Key:**
   - Dashboard → Developers → API Keys
   - Copy the "Publishable key" (starts with `pk_test_` for testing)

5. **Update the HTML file:**

Find this line (around line 1031):
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_KEY_HERE';
```

Replace with your key:
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51A...(your actual key)';
```

### Backend Setup Required:

**IMPORTANT:** The payment form needs a server-side endpoint to work. You have two options:

#### Option A: Use Stripe Checkout (Easiest)
Instead of the custom form, use Stripe's hosted checkout page:
1. Create a "Payment Link" in your Stripe dashboard
2. Replace the payment button with a link to your Stripe payment page
3. Much simpler, no backend needed!

#### Option B: Build a Backend
If you want the custom payment modal:
1. You'll need a server (Node.js, Python, etc.)
2. Create an endpoint: `/create-payment-intent`
3. This endpoint creates a Stripe payment intent
4. See Stripe's documentation: https://stripe.com/docs/payments/quickstart

**For now, I recommend Option A** (Stripe Payment Links) until you're ready to build a backend.

---

## 📊 Step 5: Update Spots Counter

As you sell Founding Agent spots, update the counter:

Find this line (around line 1025):
```javascript
const SPOTS_SOLD = 0;
```

Update the number as you make sales:
```javascript
const SPOTS_SOLD = 5; // You've sold 5 spots
```

The website will automatically:
- Show "45 spots remaining"
- Display "ONLY X SPOTS LEFT" when under 10
- Show "SOLD OUT" when all 50 are gone

---

## ⏰ Step 6: Update Countdown Timer (Optional)

The timer currently counts down to January 1, 2026. To change this:

Find this line (around line 1043):
```javascript
const endDate = new Date('2026-01-01T00:00:00').getTime();
```

Change the date:
```javascript
const endDate = new Date('2025-12-31T23:59:59').getTime();
```

---

## 🚀 Step 7: Upload and Test

### Testing Checklist:

**Before Going Live:**
- [ ] All audio files load and play correctly
- [ ] All images display properly
- [ ] Forms submit successfully (test with your own email)
- [ ] Countdown timer shows correctly
- [ ] Navigation links work
- [ ] Mobile view looks good (test on your phone)
- [ ] Stripe payment test mode works

**How to Test Payments:**
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC
- Any ZIP code

### Going Live:

1. **Upload all files** to your web hosting
2. **Switch Stripe to Live mode:**
   - Use your Live publishable key (starts with `pk_live_`)
   - Set up live mode in Stripe dashboard
3. **Test everything one more time**
4. **Launch!** 🎉

---

## 📧 Email Integration (Optional Advanced Setup)

Want automated emails? Set up these systems:

### Welcome Emails for Founding Agents:
- Use Stripe webhooks + SendGrid/Mailchimp
- Automatically send welcome email after payment
- Include Founding Agent badge and community access

### Waitlist Confirmation:
- Formspree Pro has auto-response feature
- Or use Zapier to connect Formspree → Mailchimp/SendGrid

---

## 🎨 Customization Tips

### Change Colors:
Find the `:root` section (around line 26) and update these:
```css
:root {
    --ice-blue: #E8F4F8;
    --aurora-green: #4ECCA3;
    /* etc... */
}
```

### Change Fonts:
Update the Google Fonts link (line 17) and font families in CSS.

### Modify Content:
All text is clearly labeled in sections. Just search and replace!

---

## 🐛 Troubleshooting

### Audio not playing?
- Check file paths are correct
- Ensure files are in `audio/` folder
- Try both MP3 and WAV formats
- Check browser console for errors

### Forms not submitting?
- Verify Formspree IDs are correct
- Check that you're using the full form ID
- Look in browser console for error messages
- Make sure Formspree account is activated

### Payment modal won't open?
- Check Stripe key is correct
- Look for JavaScript errors in console
- Ensure Stripe.js library loaded (check internet connection)

### Images not showing?
- Verify file names match exactly (case-sensitive!)
- Check files are in `images/` folder
- Ensure you uncommented the `<img>` tags
- Try refreshing with Ctrl+F5

---

## 📱 What's Already Working

These features work out of the box without any setup:

✅ Northern lights animation
✅ Floating snowflakes
✅ Countdown timer
✅ Spots remaining counter
✅ Expandable sections
✅ Smooth scrolling navigation
✅ Mobile responsive design
✅ Audio player controls (once you add files)

---

## 🎯 Quick Start Summary

**Minimum to Go Live:**
1. Add audio files → `audio/` folder
2. Add images → `images/` folder  
3. Set up Formspree → Get form IDs
4. Set up Stripe → Get publishable key
5. Upload everything!

**Time estimate:** 2-3 hours for complete setup

---

## 💡 Pro Tips

1. **Test on mobile devices** - Most traffic will be mobile!
2. **Compress your images** - Faster loading = better conversions
3. **Keep audio files short** - 2-3 minutes max per recording
4. **Back up your files** - Keep copies of everything
5. **Monitor form submissions** - Check Formspree regularly
6. **Use Stripe test mode** - Don't go live until you've tested!

---

## 🆘 Need Help?

If you get stuck:

1. **Check browser console** (F12) for error messages
2. **Review this guide** - most answers are here!
3. **Google the error message** - often someone has solved it
4. **Contact me** - I'm here to help!

---

## 📋 Launch Checklist

Before announcing Operation Lumina:

- [ ] All audio files uploaded and tested
- [ ] All images uploaded and display correctly
- [ ] Forms submit successfully (tested with real emails)
- [ ] Stripe payments work in test mode
- [ ] Switched to Stripe live mode
- [ ] Updated email address in footer
- [ ] Tested on mobile device
- [ ] Tested on different browsers (Chrome, Safari, Firefox)
- [ ] Countdown timer shows correct date
- [ ] Spots counter set to 0
- [ ] Privacy policy page created (recommended)
- [ ] Terms of service page created (recommended)

---

## 🎊 You're Ready!

Once you complete this setup, your Operation Lumina website will be a fully functional, professional sales page with:
- Audio storytelling
- Visual imagery
- Automated form handling
- Payment processing
- Real-time countdown
- Spot tracking

Good luck with your launch! 🌟

---

**Version:** Enhanced v1.0
**Last Updated:** December 2024
**Questions?** Refer back to this guide or reach out for support!
