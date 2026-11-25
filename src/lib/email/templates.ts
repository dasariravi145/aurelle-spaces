/**
 * Aurelle Spaces — Brand Email Templates
 * 
 * Generates responsive, elegant HTML and clean plaintext email bodies for
 * studio notifications, customer receipts, team assignments, and alerts.
 * Follows Aurelle Spaces luxury architectural design language.
 */

import {
  EnquiryCreatedPayload,
  EnquiryAssignedPayload,
  EnquiryFollowupDuePayload,
  AutomationDeliveryFailedPayload,
} from "@/lib/automation/types";

const STUDIO_BASE_URL = "https://aurelle.dsecops88.online";

function renderBaseLayout(title: string, contentHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #2C2623; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border: 1px solid #E6DED5; border-radius: 4px; overflow: hidden; }
    .header { padding: 36px 40px; background-color: #1A1615; text-align: center; }
    .header-logo { font-size: 22px; font-weight: 300; letter-spacing: 0.25em; text-transform: uppercase; color: #FAF8F5; margin: 0; }
    .header-tag { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #A17C55; margin-top: 6px; }
    .content { padding: 40px; font-size: 15px; line-height: 1.65; color: #2C2623; }
    .content h1 { font-size: 20px; font-weight: 400; color: #1A1615; margin-top: 0; margin-bottom: 20px; letter-spacing: -0.01em; }
    .data-card { background-color: #FAF8F5; border: 1px solid #E6DED5; border-radius: 4px; padding: 20px 24px; margin: 24px 0; }
    .data-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #EFEAE3; font-size: 14px; }
    .data-row:last-child { border-bottom: none; }
    .data-label { color: #6E6259; font-weight: 400; }
    .data-value { color: #1A1615; font-weight: 500; text-align: right; }
    .cta-btn { display: inline-block; padding: 14px 28px; background-color: #1A1615; color: #FAF8F5 !important; text-decoration: none; border-radius: 3px; font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 20px; }
    .footer { padding: 24px 40px; background-color: #FAF8F5; border-top: 1px solid #E6DED5; text-align: center; font-size: 12px; color: #6E6259; line-height: 1.5; }
    .footer a { color: #A17C55; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-logo">Aurelle Spaces</div>
      <div class="header-tag">Bespoke Architectural Studio</div>
    </div>
    <div class="content">
      ${contentHtml}
    </div>
    <div class="footer">
      Aurelle Spaces — DRK Information Software Solutions<br>
      Bespoke Architecture & Curated Interiors · Hyderabad & Bangalore<br>
      <a href="${STUDIO_BASE_URL}">aurelle.dsecops88.online</a>
    </div>
  </div>
</body>
</html>`;
}

/**
 * 1. New Enquiry Notification (Internal Studio Team)
 */
export function renderNewEnquiryInternalEmail(data: EnquiryCreatedPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `New Project Enquiry: ${data.reference_code} — ${data.project_type} (${data.city})`;
  const adminUrl = `${STUDIO_BASE_URL}/admin/enquiries/${data.enquiry_id}`;

  const html = renderBaseLayout(
    subject,
    `<h1>New Consultation Brief Received</h1>
    <p>A new prospective project brief has been submitted through the <strong>${data.source === "ai_chatbot" ? "AI Studio Assistant" : "Website Contact Form"}</strong>.</p>
    
    <div class="data-card">
      <div class="data-row"><span class="data-label">Reference</span><span class="data-value">${data.reference_code}</span></div>
      <div class="data-row"><span class="data-label">Client Name</span><span class="data-value">${data.client_name}</span></div>
      <div class="data-row"><span class="data-label">Email Address</span><span class="data-value">${data.client_email}</span></div>
      ${data.client_phone ? `<div class="data-row"><span class="data-label">Phone</span><span class="data-value">${data.client_phone}</span></div>` : ""}
      <div class="data-row"><span class="data-label">Project Type</span><span class="data-value">${data.project_type}</span></div>
      <div class="data-row"><span class="data-label">City</span><span class="data-value">${data.city}</span></div>
      ${data.budget_range ? `<div class="data-row"><span class="data-label">Budget</span><span class="data-value">${data.budget_range}</span></div>` : ""}
      ${data.expected_timeline ? `<div class="data-row"><span class="data-label">Timeline</span><span class="data-value">${data.expected_timeline}</span></div>` : ""}
    </div>

    <p><strong>Project Overview:</strong></p>
    <p style="background: #F5EFEB; padding: 16px; border-radius: 4px; font-style: italic; color: #4A3E39;">${data.project_description}</p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${adminUrl}" class="cta-btn">Review in Admin Pipeline</a>
    </div>
    <p style="font-size: 12px; color: #6E6259; text-align: center; margin-top: 12px;">Authentication required to view confidential client information.</p>`
  );

  const text = `New Project Enquiry: ${data.reference_code}
Source: ${data.source === "ai_chatbot" ? "AI Studio Assistant" : "Website Contact Form"}

Client Name: ${data.client_name}
Email: ${data.client_email}
${data.client_phone ? `Phone: ${data.client_phone}\n` : ""}City: ${data.city}
Project Type: ${data.project_type}
${data.budget_range ? `Budget: ${data.budget_range}\n` : ""}${data.expected_timeline ? `Timeline: ${data.expected_timeline}\n` : ""}
Project Overview:
${data.project_description}

Review in Studio Dashboard:
${adminUrl}
`;

  return { subject, html, text };
}

/**
 * 2. Customer Acknowledgement (Client-facing)
 * Strictly follows specified copy: no false promises, no unverified details.
 */
export function renderCustomerAcknowledgementEmail(
  clientName: string,
  referenceCode: string
): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "We've received your enquiry | Aurelle Spaces";
  const greeting = clientName && clientName.trim().length > 0 ? `Hello ${clientName.trim()},` : "Hello,";

  const html = renderBaseLayout(
    subject,
    `<h1>Thank You for Contacting Aurelle Spaces</h1>
    <p>${greeting}</p>
    <p>Thank you for contacting Aurelle Spaces.</p>
    <p>We have received your project enquiry (Reference: <strong>${referenceCode}</strong>) and appreciate you sharing your requirements with our studio.</p>
    <p>Our team can review the information provided and contact you regarding the next steps.</p>
    <br>
    <p>Regards,<br><strong>Aurelle Spaces</strong></p>`
  );

  const text = `${greeting}

Thank you for contacting Aurelle Spaces.

We have received your project enquiry (Reference: ${referenceCode}) and appreciate you sharing your requirements.

Our team can review the information provided and contact you regarding the next steps.

Regards,
Aurelle Spaces
https://aurelle.dsecops88.online
`;

  return { subject, html, text };
}

/**
 * 3. Lead Assignment Notification (Staff-facing)
 */
export function renderLeadAssignmentEmail(data: EnquiryAssignedPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Project Assigned: Enquiry ${data.reference_code} (${data.project_type}, ${data.city})`;
  const adminUrl = `${STUDIO_BASE_URL}/admin/enquiries/${data.enquiry_id}`;

  const html = renderBaseLayout(
    subject,
    `<h1>New Project Brief Assigned</h1>
    <p>Hello ${data.assigned_admin_name},</p>
    <p>You have been assigned to oversee the consultation brief <strong>${data.reference_code}</strong>${data.assigned_by_name ? ` by ${data.assigned_by_name}` : ""}.</p>
    
    <div class="data-card">
      <div class="data-row"><span class="data-label">Reference</span><span class="data-value">${data.reference_code}</span></div>
      <div class="data-row"><span class="data-label">Project Type</span><span class="data-value">${data.project_type}</span></div>
      <div class="data-row"><span class="data-label">City</span><span class="data-value">${data.city}</span></div>
      <div class="data-row"><span class="data-label">Assigned At</span><span class="data-value">${data.assigned_at}</span></div>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${adminUrl}" class="cta-btn">View Enquiry Dossier</a>
    </div>`
  );

  const text = `Hello ${data.assigned_admin_name},

You have been assigned to oversee consultation brief ${data.reference_code}${data.assigned_by_name ? ` by ${data.assigned_by_name}` : ""}.

Reference: ${data.reference_code}
Project Type: ${data.project_type}
City: ${data.city}
Assigned At: ${data.assigned_at}

Review client brief in Admin:
${adminUrl}
`;

  return { subject, html, text };
}

/**
 * 4. Follow-up Reminder (Staff-facing)
 */
export function renderFollowupReminderEmail(data: EnquiryFollowupDuePayload): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Reminder: Enquiry ${data.reference_code} requires initial review (${data.hours_uncontacted}h uncontacted)`;
  const adminUrl = `${STUDIO_BASE_URL}/admin/enquiries/${data.enquiry_id}`;

  const recipientGreeting = data.assigned_admin_name ? `Hello ${data.assigned_admin_name},` : "Hello Studio Team,";

  const html = renderBaseLayout(
    subject,
    `<h1>Enquiry Follow-Up Reminder</h1>
    <p>${recipientGreeting}</p>
    <p>Consultation brief <strong>${data.reference_code}</strong> has been in <em>New</em> status for approximately <strong>${data.hours_uncontacted} hours</strong> without logged client communication.</p>
    
    <div class="data-card">
      <div class="data-row"><span class="data-label">Reference</span><span class="data-value">${data.reference_code}</span></div>
      <div class="data-row"><span class="data-label">Client Name</span><span class="data-value">${data.client_name}</span></div>
      <div class="data-row"><span class="data-label">Project Type</span><span class="data-value">${data.project_type}</span></div>
      <div class="data-row"><span class="data-label">City</span><span class="data-value">${data.city}</span></div>
      <div class="data-row"><span class="data-label">Submitted At</span><span class="data-value">${data.created_at}</span></div>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${adminUrl}" class="cta-btn">Review & Update Status</a>
    </div>`
  );

  const text = `${recipientGreeting}

Enquiry ${data.reference_code} (${data.project_type}, ${data.city}) has remained in New status for ${data.hours_uncontacted} hours without logged outreach.

Client: ${data.client_name}
Submitted At: ${data.created_at}

Review and log contact:
${adminUrl}
`;

  return { subject, html, text };
}

/**
 * 5. Automation Failure Alert (Tech Team)
 */
export function renderAutomationFailureAlertEmail(data: AutomationDeliveryFailedPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `CRITICAL: Automation Delivery Failure — ${data.failure_category} (${data.failed_event_type})`;
  const monitorUrl = data.monitor_url || `${STUDIO_BASE_URL}/admin/automations`;

  const html = renderBaseLayout(
    subject,
    `<h1 style="color: #A83E3E;">Automation Delivery Alert</h1>
    <p>An outbound automation outbox event has failed delivery and reached dead letter or error status.</p>
    
    <div class="data-card" style="border-left: 4px solid #A83E3E;">
      <div class="data-row"><span class="data-label">Event ID</span><span class="data-value" style="font-family: monospace;">${data.event_id}</span></div>
      <div class="data-row"><span class="data-label">Event Type</span><span class="data-value">${data.failed_event_type}</span></div>
      <div class="data-row"><span class="data-label">Failure Category</span><span class="data-value">${data.failure_category}</span></div>
      <div class="data-row"><span class="data-label">Attempts</span><span class="data-value">${data.attempt_count}</span></div>
      <div class="data-row"><span class="data-label">Failed At</span><span class="data-value">${data.failed_at}</span></div>
    </div>

    <p><strong>Error Summary:</strong></p>
    <pre style="background: #FFF5F5; border: 1px solid #FED7D7; padding: 12px; border-radius: 4px; font-size: 13px; color: #9B2C2C; white-space: pre-wrap;">${data.error_summary}</pre>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${monitorUrl}" class="cta-btn">Open Automation Dashboard</a>
    </div>
    <p style="font-size: 12px; color: #6E6259; text-align: center; margin-top: 12px;">This alert is throttled to prevent notification loops.</p>`
  );

  const text = `CRITICAL: Automation Delivery Failure

Event ID: ${data.event_id}
Event Type: ${data.failed_event_type}
Failure Category: ${data.failure_category}
Attempt Count: ${data.attempt_count}
Failed At: ${data.failed_at}

Error Summary:
${data.error_summary}

Manage in Automation Dashboard:
${monitorUrl}
`;

  return { subject, html, text };
}

