import test from "node:test";
import assert from "node:assert/strict";

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function validateServerEnquiry(body) {
  if (!body || typeof body !== "object") {
    return { isValid: false, errors: { form: "Invalid request payload." } };
  }

  // Honeypot spam trap
  if (body.website || body.honeypot || body.company_fax) {
    return { isValid: false, isSpam: true, errors: {} };
  }

  const errors = {};

  if (!body.fullName || typeof body.fullName !== "string" || body.fullName.trim().length < 2) {
    errors.fullName = "Please provide your full name (minimum 2 characters).";
  }

  if (!body.email || typeof body.email !== "string" || !EMAIL_REGEX.test(body.email.trim())) {
    errors.email = "Please provide a valid email address.";
  }

  if (!body.city || typeof body.city !== "string" || body.city.trim().length < 2) {
    errors.city = "Project location/city is required.";
  }

  if (!body.projectType || typeof body.projectType !== "string") {
    errors.projectType = "Please select a design discipline.";
  }

  if (!body.projectDescription || typeof body.projectDescription !== "string" || body.projectDescription.trim().length < 10) {
    errors.projectDescription = "Please describe your project scope (minimum 10 characters).";
  }

  if (body.privacyConsent !== true) {
    errors.privacyConsent = "Explicit privacy consent is mandatory before submitting your consultation brief.";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors: isValid ? undefined : errors,
    data: isValid
      ? {
          fullName: body.fullName.trim(),
          email: body.email.toLowerCase().trim(),
          mobileNumber: body.mobileNumber?.trim() || null,
          city: body.city.trim(),
          projectType: body.projectType.trim(),
          propertyType: body.propertyType?.trim() || null,
          approximateArea: body.approximateArea?.trim() || null,
          budgetRange: body.budgetRange?.trim() || null,
          expectedTimeline: body.expectedTimeline?.trim() || null,
          projectDescription: body.projectDescription.trim(),
        }
      : undefined,
  };
}

test("Valid enquiry brief passes validation with clean sanitized data", () => {
  const payload = {
    fullName: "Aarav Sharma",
    email: "AARAV.SHARMA@example.com",
    city: "Bengaluru, Sadashivnagar",
    projectType: "Residential Interiors",
    projectDescription: "Complete redesign of 4BHK apartment with natural materials.",
    privacyConsent: true,
  };

  const result = validateServerEnquiry(payload);
  assert.equal(result.isValid, true);
  assert.equal(result.data.email, "aarav.sharma@example.com");
  assert.equal(result.data.fullName, "Aarav Sharma");
});

test("Enquiry fails without mandatory affirmative privacy consent", () => {
  const payload = {
    fullName: "Priya Nair",
    email: "priya@example.com",
    city: "Hyderabad, Jubilee Hills",
    projectType: "Residential Interiors",
    projectDescription: "Renovation of ancestral courtyard residence.",
    privacyConsent: false,
  };

  const result = validateServerEnquiry(payload);
  assert.equal(result.isValid, false);
  assert.match(result.errors.privacyConsent, /Explicit privacy consent is mandatory/);
});

test("Enquiry catches honeypot spam bot silently", () => {
  const payload = {
    fullName: "Spam Bot",
    email: "bot@spam.com",
    city: "Nowhere",
    projectType: "Residential Interiors",
    projectDescription: "Spam message here",
    privacyConsent: true,
    honeypot: "automated_fill",
  };

  const result = validateServerEnquiry(payload);
  assert.equal(result.isValid, false);
  assert.equal(result.isSpam, true);
});

test("Enquiry rejects malformed email addresses", () => {
  const payload = {
    fullName: "Vikram Mehta",
    email: "not-an-email",
    city: "Mumbai",
    projectType: "Commercial Interiors",
    projectDescription: "Design of boutique workspace.",
    privacyConsent: true,
  };

  const result = validateServerEnquiry(payload);
  assert.equal(result.isValid, false);
  assert.match(result.errors.email, /valid email address/);
});

