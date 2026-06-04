// backend/src/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailClient } from '@azure/communication-email';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly client: EmailClient;
  private readonly sender: string;

  constructor(private readonly configService: ConfigService) {
    const connectionString = this.configService.get<string>('AZURE_COMMUNICATION_CONNECTION_STRING');
    if (!connectionString) {
      throw new Error('AZURE_COMMUNICATION_CONNECTION_STRING environment variable is required');
    }
    this.sender = this.configService.get<string>(
      'AZURE_EMAIL_SENDER',
      'donotreply@e5f3ec40-76a1-4255-b6e7-8f354fb39cbb.azurecomm.net',
    );
    this.client = new EmailClient(connectionString);
  }

  // ── 1. Confirmation de commande ───────────────────────────────────────────
  async sendOrderConfirmation(order: {
    id: string;
    firstName: string;
    email: string;
    total: number;
    items: { name: string; qty: number; price: number }[];
    city: string;
    address: string;
    payMethod: string;
  }) {
    const itemsHtml = order.items
      .map(
        i => `<tr>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0">${i.name}</td>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:center">${i.qty}</td>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:right">${Number(i.price).toFixed(2)} TND</td>
        </tr>`,
      )
      .join('');

    await this.send({
      to: order.email,
      subject: `JASS — Confirmation de commande #${order.id.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
          <div style="background:#111;padding:32px;text-align:center">
            <h1 style="color:#fff;font-weight:300;letter-spacing:0.3em;margin:0">JASS</h1>
          </div>
          <div style="padding:40px 32px">
            <h2 style="font-weight:300;margin-bottom:8px">Bonjour ${order.firstName},</h2>
            <p style="color:#666;margin-bottom:32px">
              Votre commande <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> a bien été reçue. 
              Nous vous confirmons sa prise en charge.
            </p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <thead>
                <tr style="background:#f9f9f9">
                  <th style="padding:10px 8px;text-align:left;font-size:11px;letter-spacing:0.1em;text-transform:uppercase">Produit</th>
                  <th style="padding:10px 8px;text-align:center;font-size:11px;letter-spacing:0.1em;text-transform:uppercase">Qté</th>
                  <th style="padding:10px 8px;text-align:right;font-size:11px;letter-spacing:0.1em;text-transform:uppercase">Prix</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding:12px 8px;text-align:right;font-weight:bold">Total</td>
                  <td style="padding:12px 8px;text-align:right;font-weight:bold">${Number(order.total).toFixed(2)} TND</td>
                </tr>
              </tfoot>
            </table>
            <div style="background:#f9f9f9;padding:16px 20px;margin-bottom:32px">
              <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.1em">Livraison</p>
              <p style="margin:0">${order.address}, ${order.city}</p>
              <p style="margin:4px 0 0;font-size:13px;color:#666">
                Paiement : ${order.payMethod === 'cash' ? 'À la livraison' : 'Carte bancaire'}
              </p>
            </div>
            <p style="color:#666;font-size:13px">
              Vous pouvez suivre l'état de votre commande depuis votre 
              <a href="http://localhost:3001/orders" style="color:#111">espace client</a>.
            </p>
          </div>
          <div style="background:#f5f5f5;padding:20px 32px;text-align:center">
            <p style="color:#aaa;font-size:11px;margin:0">© 2026 JASS — Tous droits réservés</p>
          </div>
        </div>
      `,
    });
  }

  // ── 2. Notification changement de statut ──────────────────────────────────
  async sendStatusUpdate(order: {
    id: string;
    firstName: string;
    email: string;
    status: string;
    total: number;
  }) {
    const statusLabels: Record<string, { label: string; message: string; color: string }> = {
      confirmed: {
        label: 'Confirmée',
        message: 'Votre commande a été confirmée et est en cours de préparation.',
        color: '#4a9e6f',
      },
      shipped: {
        label: 'Expédiée',
        message: 'Votre commande est en route ! Elle sera livrée dans les prochains jours.',
        color: '#1976d2',
      },
      delivered: {
        label: 'Livrée',
        message: 'Votre commande a été livrée. Merci pour votre confiance !',
        color: '#7b1fa2',
      },
      cancelled: {
        label: 'Annulée',
        message: 'Votre commande a été annulée. Contactez-nous pour plus d\'informations.',
        color: '#e55',
      },
    };

    const st = statusLabels[order.status] ?? {
      label: order.status,
      message: `Le statut de votre commande a été mis à jour : ${order.status}`,
      color: '#111',
    };

    await this.send({
      to: order.email,
      subject: `JASS — Commande #${order.id.slice(0, 8).toUpperCase()} : ${st.label}`,
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
          <div style="background:#111;padding:32px;text-align:center">
            <h1 style="color:#fff;font-weight:300;letter-spacing:0.3em;margin:0">JASS</h1>
          </div>
          <div style="padding:40px 32px">
            <h2 style="font-weight:300;margin-bottom:8px">Bonjour ${order.firstName},</h2>
            <div style="border-left:4px solid ${st.color};padding:16px 20px;margin:24px 0;background:#f9f9f9">
              <p style="margin:0;font-size:16px;color:${st.color};font-weight:500">${st.label}</p>
              <p style="margin:8px 0 0;color:#666">${st.message}</p>
            </div>
            <p style="color:#888;font-size:13px">
              Commande : <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> — 
              Total : <strong>${Number(order.total).toFixed(2)} TND</strong>
            </p>
            <a href="http://localhost:3001/orders" 
               style="display:inline-block;padding:14px 44px;background:#111;color:#fff;text-decoration:none;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;margin-top:16px">
              Voir ma commande
            </a>
          </div>
          <div style="background:#f5f5f5;padding:20px 32px;text-align:center">
            <p style="color:#aaa;font-size:11px;margin:0">© 2026 JASS — Tous droits réservés</p>
          </div>
        </div>
      `,
    });
  }

  // ── 3. Réinitialisation mot de passe ──────────────────────────────────────
  async sendPasswordReset(user: { email: string; name: string; resetToken: string }) {
    const resetUrl = `http://localhost:3001/reset-password?token=${user.resetToken}`;

    await this.send({
      to: user.email,
      subject: 'JASS — Réinitialisation de votre mot de passe',
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
          <div style="background:#111;padding:32px;text-align:center">
            <h1 style="color:#fff;font-weight:300;letter-spacing:0.3em;margin:0">JASS</h1>
          </div>
          <div style="padding:40px 32px">
            <h2 style="font-weight:300;margin-bottom:8px">Bonjour ${user.name},</h2>
            <p style="color:#666;margin-bottom:32px">
              Vous avez demandé la réinitialisation de votre mot de passe. 
              Cliquez sur le bouton ci-dessous pour en définir un nouveau.
            </p>
            <a href="${resetUrl}" 
               style="display:inline-block;padding:14px 44px;background:#111;color:#fff;text-decoration:none;font-size:11px;letter-spacing:0.25em;text-transform:uppercase">
              Réinitialiser mon mot de passe
            </a>
            <p style="color:#aaa;font-size:12px;margin-top:32px">
              Ce lien expire dans <strong>1 heure</strong>. 
              Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </p>
          </div>
          <div style="background:#f5f5f5;padding:20px 32px;text-align:center">
            <p style="color:#aaa;font-size:11px;margin:0">© 2026 JASS — Tous droits réservés</p>
          </div>
        </div>
      `,
    });
  }

  // ── Méthode privée d'envoi ─────────────────────────────────────────────────
  private async send({ to, subject, html }: { to: string; subject: string; html: string }) {
    try {
      const poller = await this.client.beginSend({
        senderAddress: this.sender,
        recipients: { to: [{ address: to }] },
        content: { subject, html },
      });
      await poller.pollUntilDone();
      this.logger.log(`✅ Email envoyé à ${to} — ${subject}`);
    } catch (err) {
      this.logger.error(`❌ Erreur envoi email à ${to}: ${err.message}`);
      // Ne pas bloquer l'application si l'email échoue
    }
  }
}