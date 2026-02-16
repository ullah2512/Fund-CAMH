import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

// Secrets managed via Firebase (set with: firebase functions:secrets:set GMAIL_APP_PASSWORD)
const gmailAppPassword = defineSecret("GMAIL_APP_PASSWORD");

// ─── Configuration ───────────────────────────────────────────────
const SENDER_EMAIL = "ullah2512@gmail.com";
const MODERATOR_EMAIL = "missionnasman@gmail.com";
const APP_URL = "https://fund-camh.web.app"; // Update to your actual deployed URL

// ─── Firestore Trigger: New Post Created ─────────────────────────
export const onNewPostCreated = onDocumentCreated(
  {
    document: "posts/{postId}",
    secrets: [gmailAppPassword],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with the event");
      return;
    }

    const postData = snapshot.data();
    const postId = event.params.postId;

    // Only send notification for pending posts
    if (postData.status !== "pending") {
      console.log(`Post ${postId} is not pending (status: ${postData.status}), skipping notification.`);
      return;
    }

    console.log(`📬 New pending post detected: ${postId}`);

    // ─── Build the email ───────────────────────────────────────
    const category = postData.category || "Unknown";
    const content = postData.content || "(no content)";
    const aiReflection = postData.aiReflection || "N/A";
    const timestamp = postData.timestamp
      ? new Date(postData.timestamp).toLocaleString("en-US", { timeZone: "America/Toronto" })
      : "Unknown";

    const mailOptions = {
      from: `"Fund-CAMH Moderator Alert" <${SENDER_EMAIL}>`,
      to: MODERATOR_EMAIL,
      subject: `🛡️ New Post Pending Review — [${category}]`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 24px 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 600;">
              🛡️ New Post Pending Review
            </h1>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0;">
              A community member has submitted a new post that requires your review.
            </p>

            <!-- Post Details Card -->
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; width: 100px;">Category</td>
                  <td style="padding: 8px 0;">
                    <span style="background: #eef2ff; color: #4f46e5; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500;">${category}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Time</td>
                  <td style="padding: 8px 0; color: #334155; font-size: 14px;">${timestamp}</td>
                </tr>
              </table>
            </div>

            <!-- Post Content -->
            <div style="margin: 20px 0;">
              <p style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Post Content</p>
              <div style="background: white; border-left: 4px solid #4f46e5; padding: 16px 20px; border-radius: 0 8px 8px 0; color: #334155; font-size: 14px; line-height: 1.7;">
                ${content}
              </div>
            </div>

            <!-- AI Reflection -->
            <div style="margin: 20px 0;">
              <p style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">AI Reflection</p>
              <div style="background: #faf5ff; border-left: 4px solid #9333ea; padding: 16px 20px; border-radius: 0 8px 8px 0; color: #581c87; font-size: 14px; line-height: 1.7; font-style: italic;">
                ${aiReflection}
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0 16px;">
              <a href="${APP_URL}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">
                Review Post Now
              </a>
            </div>
            <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 8px;">
              Use <strong>Ctrl+Shift+M</strong> (or tap the logo 5× on mobile) to open Moderator Mode
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f1f5f9; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              Fund-CAMH Automated Notification · Post ID: ${postId}
            </p>
          </div>
        </div>
      `,
    };

    // ─── Send the email via Gmail SMTP ─────────────────────────
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SENDER_EMAIL,
        pass: gmailAppPassword.value(),
      },
    });

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Moderator notification sent for post ${postId}`);
    } catch (error) {
      console.error(`❌ Failed to send moderator notification for post ${postId}:`, error);
    }
  }
);
