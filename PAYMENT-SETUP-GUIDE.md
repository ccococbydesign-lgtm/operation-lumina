# Simplified Payment Setup - Stripe Payment Links

The easiest way to accept payments is using Stripe's Payment Links - no backend code required!

## 🎯 Quick Setup (15 minutes)

### Step 1: Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete the business verification

### Step 2: Create a Payment Link
1. Log into Stripe Dashboard
2. Click **"Payment Links"** in the left sidebar (or search for it)
3. Click **"+ New"** to create a payment link
4. Fill in these details:

**Product Details:**
- Product name: `Founding Agent Spot - Operation Lumina`
- Price: `$99.00`
- One-time payment

**Additional Options:**
- Require customer name: ✅ Yes
- Require customer email: ✅ Yes
- Collect phone number: Optional
- Collect billing address: Optional

**Custom Fields (Optional but Recommended):**
- Add field: "Child's Age" (dropdown: 5,6,7,8,9,10,11,12)

5. Click **"Create Link"**
6. Copy your Payment Link URL (looks like: `https://buy.stripe.com/test_xxxxx`)

### Step 3: Replace the Payment Button

Open your HTML file and find the "Secure Your Spot" button (around line 874).

**REPLACE THIS:**
```html
<button class="cta-button" onclick="openPaymentModal()" style="font-size: 1.4em; margin-top: 20px;">
    🌟 Secure Your Spot - $99
</button>
```

**WITH THIS:**
```html
<a href="YOUR_STRIPE_PAYMENT_LINK_HERE" class="cta-button" style="font-size: 1.4em; margin-top: 20px; text-decoration: none;">
    🌟 Secure Your Spot - $99
</a>
```

Example:
```html
<a href="https://buy.stripe.com/test_14k7sK8Nt6p1aA8dQQ" class="cta-button" style="font-size: 1.4em; margin-top: 20px; text-decoration: none;">
    🌟 Secure Your Spot - $99
</a>
```

### Step 4: Remove Payment Modal Code (Optional)

Since you're using Stripe's hosted checkout, you can remove the payment modal:

1. Find the `<!-- Payment Modal -->` section (around line 983)
2. Delete everything from `<div id="payment-modal" class="modal">` to the closing `</div>`
3. Or just leave it - it won't interfere if unused

### Step 5: Set Up Webhooks (For Automation)

To automatically track purchases and send confirmation emails:

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Enter your website URL + `/stripe-webhook` (you'll need to set this up)
4. Select events: `checkout.session.completed`
5. Copy the webhook signing secret

**What webhooks do:**
- Notify you instantly when someone pays
- Can trigger automated emails
- Update your spots counter automatically
- Add customer to your database

---

## 🧪 Testing Before Going Live

### Test Mode
Stripe starts in Test Mode - perfect for testing!

**Test Credit Cards:**
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Use any future date, any CVC

**To Test:**
1. Click your payment button
2. You'll go to Stripe's checkout page
3. Enter test card details
4. Complete "payment"
5. Check Stripe Dashboard → Payments to see the test transaction

### Going Live

When ready to accept real payments:

1. **Complete Stripe Verification:**
   - Upload ID documents
   - Add bank account for payouts
   - Fill in business details

2. **Toggle to Live Mode:**
   - In Stripe Dashboard, switch from "Test Mode" to "Live Mode" (top right)
   - Create a NEW Payment Link in Live Mode
   - Update your website button with the LIVE payment link

3. **Test One More Time:**
   - Use a real card (your own)
   - Make sure payment goes through
   - Check that you receive the money

---

## 📧 Post-Payment Automation (Optional)

### Option 1: Stripe Email Receipts (Built-in)
- Stripe automatically sends receipts
- No setup needed!
- Basic but professional

### Option 2: Custom Welcome Emails
Set up with Zapier (easiest) or custom backend:

**Using Zapier (No Code):**
1. Create Zapier account (free tier works)
2. Create Zap: Stripe → Gmail/Mailchimp
3. Trigger: "New Payment in Stripe"
4. Action: "Send Email"
5. Customize email template with:
   - Welcome message
   - Founding Agent badge
   - Community access link
   - Next steps

**Cost:** Free for up to 100 payments/month

### Option 3: Notion/Airtable Integration
Track all Founding Agents automatically:

1. Create Zapier account
2. Create Zap: Stripe → Notion/Airtable
3. Trigger: "New Payment"
4. Action: "Create Database Item"
5. Now you have a database of all Founding Agents!

---

## 🎨 Customizing Stripe Checkout Page

Make the Stripe checkout match your brand:

1. In Stripe Dashboard → **Settings → Branding**
2. Upload your logo
3. Choose accent color (use your aurora green: `#4ECCA3`)
4. Add business name
5. Your checkout page now matches Operation Lumina's aesthetic!

---

## 📊 Tracking Sales

### In Stripe Dashboard:
- See all payments in **Payments** section
- Export customer list as CSV
- View revenue graphs and analytics
- Set up daily sales email notifications

### Update Your Website:
As you make sales, update the counter in your HTML:

```javascript
const SPOTS_SOLD = 0; // Change this number!
```

For example, after 10 sales:
```javascript
const SPOTS_SOLD = 10;
```

The website automatically shows "40 spots remaining"

---

## 💰 Money & Fees

### Stripe Fees:
- 2.9% + $0.30 per transaction
- For $99 payment: You receive ~$96.20

### Payout Timeline:
- First payout: 7-14 days after first sale
- After that: Every 2 days (automatic)
- Money goes directly to your bank account

### Refunds:
- Easy to process in Stripe Dashboard
- Full refund returns 100% to customer
- Stripe fees are returned too

---

## 🔒 Security & Compliance

### What Stripe Handles:
✅ PCI compliance (credit card security)
✅ Fraud detection
✅ Secure payment processing
✅ Customer data protection
✅ SSL/HTTPS encryption

### What You Handle:
- Privacy policy on your website
- Terms of service
- Clear refund policy
- Customer support

---

## 🆘 Troubleshooting

### "Payment link not working"
- Make sure you copied the full URL
- Check that link is Active in Stripe Dashboard
- Try opening in incognito/private browser

### "Test payments not showing"
- Make sure you're in Test Mode in Stripe
- Check you're using test card numbers
- Look in Test Data section of dashboard

### "Can't activate live mode"
- Complete business verification first
- Add bank account details
- May take 1-2 business days for approval

---

## 🚀 Going Live Checklist

Before accepting real payments:

- [ ] Stripe account fully verified
- [ ] Bank account added for payouts
- [ ] Payment link created in LIVE mode
- [ ] Website button updated with live link
- [ ] Branding set up in Stripe
- [ ] Test purchase completed successfully
- [ ] Email notifications set up (optional)
- [ ] Privacy policy and terms on website
- [ ] Refund policy clearly stated

---

## 📋 Alternative: Full Custom Checkout

If you want the custom payment modal on your website (more complex):

### You'll Need:
1. **Backend server** (Node.js, Python, PHP, etc.)
2. **Hosting** that supports server-side code
3. **Development skills** or hire a developer

### Backend Endpoint Example (Node.js):

```javascript
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY');

app.post('/create-payment-intent', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 9900, // $99.00 in cents
    currency: 'usd',
    metadata: {
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      childAge: req.body.childAge,
    },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});
```

**Estimated Development Time:** 4-8 hours
**Recommended For:** Projects with existing backend infrastructure

---

## 🎯 Recommendation

**For Operation Lumina, I recommend:**

✅ **Use Stripe Payment Links** (Option 1)
- Fastest setup (15 minutes)
- No backend required
- Professional checkout experience
- Secure and reliable
- Easy to test and go live

❌ **Avoid Custom Backend** unless you:
- Have development resources
- Need highly custom checkout flow
- Want checkout on your domain

---

## 💡 Pro Tips

1. **Set up in Test Mode first** - Make sure everything works before going live
2. **Customize the Stripe page** - Add your logo and colors for brand consistency
3. **Enable email receipts** - Customers appreciate confirmation
4. **Use Zapier for automation** - Connect Stripe to your email/CRM
5. **Track everything** - Export customer list regularly as backup

---

## 📞 Support Resources

**Stripe Documentation:**
- [Payment Links Guide](https://stripe.com/docs/payment-links)
- [Testing Guide](https://stripe.com/docs/testing)
- [Webhooks](https://stripe.com/docs/webhooks)

**Stripe Support:**
- Chat support in dashboard (very responsive!)
- Email: support@stripe.com
- Phone: Available for verified accounts

---

## ✨ Summary

**Stripe Payment Links is the perfect solution for Operation Lumina:**

- ✅ No coding required
- ✅ 15-minute setup
- ✅ Professional checkout
- ✅ Secure and trusted
- ✅ Easy testing
- ✅ Simple to go live

Just create your link, replace the button, and you're ready to accept Founding Agent payments!

---

**Questions?** Stripe's support team is excellent - don't hesitate to reach out to them directly!

**Good luck with your launch! 🚀**
