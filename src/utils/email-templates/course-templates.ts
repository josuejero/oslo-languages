// src/utils/email-templates/course-templates.ts

export interface CourseRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  courseName: string;
  startDate: string;
  schedule: string;
  location: string;
  paymentDetails?: string;
}

export interface WaitlistData {
  firstName: string;
  lastName: string;
  email: string;
  courseName: string;
  position?: number;
}

export interface CourseReminderData {
  firstName: string;
  email: string; // Added email property
  courseName: string;
  startDate: string;
  location: string;
  materials?: string[];
  zoomLink?: string;
}

export const courseRegistrationTemplate = (data: CourseRegistrationData) => ({
  subject: `Welcome to ${data.courseName} at Oslo Languages!`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563eb; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Registration Confirmed</h1>
      </div>
      <div style="padding: 20px;">
        <p>Dear ${data.firstName},</p>
        <p>Thank you for registering for <strong>${data.courseName}</strong>. Your registration has been confirmed, and we're excited to have you join us!</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #2563eb; margin-top: 0;">Course Details</h2>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Start Date:</strong> ${data.startDate}</li>
            <li><strong>Schedule:</strong> ${data.schedule}</li>
            <li><strong>Location:</strong> ${data.location}</li>
          </ul>
        </div>
        ${data.paymentDetails ? `
          <div style="background: #fef3c7; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #92400e; margin-top: 0;">Payment Information</h2>
            <p>${data.paymentDetails}</p>
          </div>
        ` : ''}
        <h2 style="color: #2563eb;">Next Steps</h2>
        <ol>
          <li>Complete the pre-course assessment (link will be sent separately)</li>
          <li>Join our student community on Discord</li>
          <li>Prepare any required materials</li>
        </ol>
        <p style="margin-top: 20px;">If you have any questions, please don't hesitate to contact us at support@oslolanguages.com.</p>
        <p>Best regards,<br>The Oslo Languages Team</p>
      </div>
      <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 0.875rem; color: #4b5563;">
        <p>Oslo Languages<br>
        Email: support@oslolanguages.com<br>
        Phone: (+47) XXX-XX-XXX</p>
      </div>
    </div>
  `,
  text: `
    Welcome to ${data.courseName} at Oslo Languages!
    
    Dear ${data.firstName},
    
    Thank you for registering for ${data.courseName}. Your registration has been confirmed, and we're excited to have you join us!
    
    Course Details:
    - Start Date: ${data.startDate}
    - Schedule: ${data.schedule}
    - Location: ${data.location}
    
    ${data.paymentDetails ? `
    Payment Information:
    ${data.paymentDetails}
    ` : ''}
    
    Next Steps:
    1. Complete the pre-course assessment (link will be sent separately)
    2. Join our student community on Discord
    3. Prepare any required materials
    
    If you have any questions, please don't hesitate to contact us at support@oslolanguages.com.
    
    Best regards,
    The Oslo Languages Team
    
    Oslo Languages
    Email: support@oslolanguages.com
    Phone: (+47) XXX-XX-XXX
  `
});

export const waitlistConfirmationTemplate = (data: WaitlistData) => ({
  subject: `Waitlist Confirmation for ${data.courseName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #4b5563; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Waitlist Confirmation</h1>
      </div>
      <div style="padding: 20px;">
        <p>Dear ${data.firstName},</p>
        <p>You have been added to the waitlist for <strong>${data.courseName}</strong>.</p>
        ${data.position ? `
          <p>You are currently position <strong>#${data.position}</strong> on the waitlist.</p>
        ` : ''}
        <div style="background: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #4b5563; margin-top: 0;">What Happens Next?</h2>
          <ul>
            <li>We'll notify you as soon as a spot becomes available</li>
            <li>You'll have 48 hours to confirm your registration</li>
            <li>No payment is required until a spot is confirmed</li>
          </ul>
        </div>
        <p style="margin-top: 20px;">In the meantime, consider exploring our other available courses or contact us for alternative options.</p>
        <p>Best regards,<br>The Oslo Languages Team</p>
      </div>
    </div>
  `,
  text: `
    Waitlist Confirmation for ${data.courseName}
    
    Dear ${data.firstName},
    
    You have been added to the waitlist for ${data.courseName}.
    
    ${data.position ? `You are currently position #${data.position} on the waitlist.` : ''}
    
    What Happens Next?
    - We'll notify you as soon as a spot becomes available
    - You'll have 48 hours to confirm your registration
    - No payment is required until a spot is confirmed
    
    In the meantime, consider exploring our other available courses or contact us for alternative options.
    
    Best regards,
    The Oslo Languages Team
  `
});

export const courseReminderTemplate = (data: CourseReminderData) => ({
  subject: `Reminder: ${data.courseName} Starts Soon!`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #059669; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Your Course Starts Soon!</h1>
      </div>
      <div style="padding: 20px;">
        <p>Dear ${data.firstName},</p>
        <p>This is a reminder that <strong>${data.courseName}</strong> begins on ${data.startDate}.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #059669; margin-top: 0;">Important Information</h2>
          <ul>
            <li><strong>Date:</strong> ${data.startDate}</li>
            <li><strong>Location:</strong> ${data.location}</li>
            ${data.zoomLink ? `<li><strong>Zoom Link:</strong> ${data.zoomLink}</li>` : ''}
          </ul>
        </div>
        ${data.materials && data.materials.length > 0 ? `
          <div style="background: #e0f2fe; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #0369a1; margin-top: 0;">Required Materials</h2>
            <ul>
              ${data.materials.map(material => `<li>${material}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        <p style="margin-top: 20px;">We look forward to seeing you in class!</p>
        <p>Best regards,<br>The Oslo Languages Team</p>
      </div>
    </div>
  `,
  text: `
    Reminder: ${data.courseName} Starts Soon!
    
    Dear ${data.firstName},
    
    This is a reminder that ${data.courseName} begins on ${data.startDate}.
    
    Important Information:
    - Date: ${data.startDate}
    - Location: ${data.location}
    ${data.zoomLink ? `- Zoom Link: ${data.zoomLink}` : ''}
    
    ${data.materials && data.materials.length > 0 ? `
    Required Materials:
    ${data.materials.map(material => `- ${material}`).join('\n')}
    ` : ''}
    
    We look forward to seeing you in class!
    
    Best regards,
    The Oslo Languages Team
  `
});
