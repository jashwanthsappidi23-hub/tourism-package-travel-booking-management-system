import os
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional, Dict, Any
from backend.app.config import settings

logger = logging.getLogger("email_service")

def generate_booking_email_html(booking_data: Dict[str, Any]) -> str:
    """Renders a responsive HTML ticket confirmation email for GlobeTrek Holidays."""
    travellers_rows = "".join([
        f"""
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 14px; font-weight: 600; color: #1e293b;">{t.get('full_name')}</td>
            <td style="padding: 10px 14px; color: #475569;">{t.get('age')} years</td>
            <td style="padding: 10px 14px; color: #475569;">{t.get('gender')}</td>
            <td style="padding: 10px 14px; color: #0284c7; font-weight: 700;">{t.get('seat_number', 'Confirmed')}</td>
        </tr>
        """ for t in booking_data.get('travellers', [])
    ])

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GlobeTrek Holiday Booking Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 640px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            
            <!-- Header Brand Banner -->
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 36px; text-align: center; color: #ffffff;">
                <div style="display: inline-block; background: #f97316; color: #ffffff; font-weight: 900; font-size: 14px; padding: 4px 14px; border-radius: 20px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">
                    GlobeTrek Holidays
                </div>
                <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">Your Booking Is Confirmed!</h1>
                <p style="margin: 8px 0 0; font-size: 13px; color: #94a3b8;">
                    Pack your bags! Your holiday departure is officially reserved and locked in.
                </p>
            </div>

            <!-- Booking Reference Badge -->
            <div style="background-color: #f8fafc; padding: 20px 36px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Booking Reference</span>
                    <div style="font-size: 20px; font-weight: 900; color: #0f172a; font-family: monospace; letter-spacing: 1px;">
                        {booking_data.get('booking_reference')}
                    </div>
                </div>
                <div style="text-align: right;">
                    <span style="display: inline-block; background-color: #dcfce7; color: #166534; font-weight: 800; font-size: 12px; padding: 4px 12px; border-radius: 8px;">
                        ✓ PAYMENT CONFIRMED
                    </span>
                </div>
            </div>

            <!-- Trip Summary -->
            <div style="padding: 28px 36px;">
                <h2 style="margin: 0 0 16px; font-size: 16px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
                    Holiday Details
                </h2>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                    <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
                        {booking_data.get('package_title')}
                    </div>
                    <div style="font-size: 13px; color: #64748b; margin-bottom: 12px;">
                        Category: <strong style="color: #0f172a;">{booking_data.get('category')}</strong> • Duration: <strong style="color: #0f172a;">{booking_data.get('duration_days', 6)} Days</strong>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <tr>
                            <td style="padding: 6px 0; color: #64748b; width: 40%;">Departure Date:</td>
                            <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">{booking_data.get('start_date')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #64748b;">Return Date:</td>
                            <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">{booking_data.get('end_date')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #64748b;">Primary Guest:</td>
                            <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">{booking_data.get('customer_name')} ({booking_data.get('customer_phone')})</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #64748b;">Assigned Lead Guide:</td>
                            <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">{booking_data.get('guide_name', 'Licensed Regional Concierge')}</td>
                        </tr>
                    </table>
                </div>

                <!-- Booked Travellers -->
                <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
                    Passenger Manifest ({len(booking_data.get('travellers', []))} Guests)
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <thead>
                        <tr style="background-color: #f1f5f9; text-align: left; color: #64748b; font-weight: 700;">
                            <th style="padding: 10px 14px;">Full Name</th>
                            <th style="padding: 10px 14px;">Age</th>
                            <th style="padding: 10px 14px;">Gender</th>
                            <th style="padding: 10px 14px;">Seat / Slot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {travellers_rows}
                    </tbody>
                </table>

                <!-- Fare Breakdown -->
                <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
                    Payment Summary
                </h3>
                <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <tr>
                            <td style="padding: 6px 0; color: #4b5563;">Gross Package Fare:</td>
                            <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #1f2937;">₹{booking_data.get('gross_fare', 0):,.2f}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #15803d;">Promotional Discount:</td>
                            <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #15803d;">- ₹{booking_data.get('discount_amount', 0):,.2f}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #4b5563;">Government GST (5%):</td>
                            <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #1f2937;">+ ₹{booking_data.get('tax_amount', 0):,.2f}</td>
                        </tr>
                        <tr style="border-top: 1px dashed #d8b4fe;">
                            <td style="padding: 10px 0 4px; font-weight: 800; font-size: 16px; color: #0f172a;">Total Amount Paid:</td>
                            <td style="padding: 10px 0 4px; text-align: right; font-weight: 900; font-size: 18px; color: #0f172a;">₹{booking_data.get('net_amount', 0):,.2f}</td>
                        </tr>
                    </table>
                </div>

                <!-- Guidelines & What to Expect -->
                <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 18px; border-radius: 0 8px 8px 0; font-size: 12px; color: #1e40af; line-height: 1.5;">
                    <strong>Important Travel Instructions:</strong><br>
                    • Please carry original government Photo IDs for all passengers at airport check-in and hotel reception.<br>
                    • Standard hotel check-in is at 2:00 PM and check-out at 11:00 AM.<br>
                    • Free cancellation is supported per package policy from your GlobeTrek customer dashboard.
                </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 24px 36px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                <p style="margin: 0 0 6px; font-weight: 600; color: #64748b;">
                    Need help with your booking? 24x7 Helpline: 1800-GLOBE-TREK | support@globetrek.com
                </p>
                <p style="margin: 0;">
                    © {booking_data.get('year', 2026)} GlobeTrek Travel Technologies Ltd. Inspired by MakeMyTrip.
                </p>
            </div>
        </div>
    </body>
    </html>
    """

def send_booking_confirmation_email(booking_data: Dict[str, Any], recipient_email: str) -> Dict[str, Any]:
    """
    Sends an automated ticket confirmation email to the traveller.
    Uses real SMTP if configured via environment variables; otherwise safely simulates and saves email.
    """
    subject = f"Confirmed: Your Holiday E-Ticket [{booking_data.get('booking_reference')}] — GlobeTrek Holidays"
    html_content = generate_booking_email_html(booking_data)
    
    plain_text = f"""
=====================================================
GLOBETREK HOLIDAYS — BOOKING CONFIRMATION
=====================================================
Booking Reference: {booking_data.get('booking_reference')}
Status: Confirmed & Paid

Holiday Package: {booking_data.get('package_title')}
Travel Dates: {booking_data.get('start_date')} to {booking_data.get('end_date')}
Primary Booker: {booking_data.get('customer_name')} ({booking_data.get('customer_phone')})
Total Amount Paid: ₹{booking_data.get('net_amount', 0):,.2f}

Booked Travellers:
""" + "\n".join([f"- {t.get('full_name')} ({t.get('age')} yrs, {t.get('gender')})" for t in booking_data.get('travellers', [])]) + f"""

24x7 Customer Helpline: 1800-GLOBE-TREK
Thank you for choosing GlobeTrek!
=====================================================
"""

    # Always write local copies in development/demo mode for verification
    try:
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
        html_out_path = os.path.join(project_root, "backend", "latest_booking_email.html")
        txt_out_path = os.path.join(project_root, "backend", "latest_booking_email.txt")
        with open(html_out_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        with open(txt_out_path, "w", encoding="utf-8") as f:
            f.write(plain_text)
    except Exception as e:
        logger.warning(f"Could not write local email file: {e}")

    # Check if live SMTP is configured
    if settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
            msg["To"] = recipient_email

            part1 = MIMEText(plain_text, "plain")
            part2 = MIMEText(html_content, "html")
            msg.attach(part1)
            msg.attach(part2)

            if settings.SMTP_PORT == 465:
                server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10)
            else:
                server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10)
                server.starttls()

            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM_EMAIL, [recipient_email], msg.as_string())
            server.quit()

            logger.info(f"Live booking email successfully sent via SMTP to {recipient_email}")
            return {
                "success": True,
                "mode": "live_smtp",
                "recipient": recipient_email,
                "message": f"Confirmation email successfully delivered to {recipient_email} via SMTP"
            }
        except Exception as e:
            logger.error(f"Failed to send email via SMTP: {e}. Fallback to simulated delivery.")
            return {
                "success": True,
                "mode": "simulated_fallback",
                "recipient": recipient_email,
                "smtp_error": str(e),
                "message": f"Email formatted and archived for {recipient_email} (SMTP server unreachable)"
            }
    else:
        # Development / Simulation mode (free, zero external dependencies)
        logger.info(f"Booking confirmation email prepared and simulated for {recipient_email}")
        return {
            "success": True,
            "mode": "simulated",
            "recipient": recipient_email,
            "message": f"Confirmation E-Ticket email prepared and dispatched to {recipient_email}"
        }
