import { Request, Response } from 'express';
import { paymentsService } from './payments.service';
import { filesRepository } from '../files/files.repository';
import { auditService } from '../../shared/services/audit.service';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export class PaymentsController {
  private service = paymentsService;

  async create(req: Request, res: Response) {
    try {
      const data: any = { ...req.body };
      // Coerce types from multipart/form-data (all fields come as strings)
      if (data.amount !== undefined) data.amount = parseFloat(data.amount);
      if (data.dueDate) data.dueDate = new Date(data.dueDate);
      // Attach sector from requester if present
      const requester = (req as any).user;
      if (requester && requester.sectorId) data.sectorId = requester.sectorId;

      // handle file upload
      if (req.file) {
        const uploadsDir = path.resolve('uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
        const ext = path.extname(req.file.originalname);
        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.join(uploadsDir, filename);

        if (req.file.mimetype.startsWith('image/')) {
          // compress image
          await sharp(req.file.buffer).jpeg({ quality: 70 }).toFile(filepath);
        } else {
          fs.writeFileSync(filepath, req.file.buffer);
        }

        const file = await filesRepository.create({ filename, path: filepath, mimetype: req.file.mimetype, size: req.file.size });
        data.fileId = file.id;
      }

      const payment = await this.service.create({ ...data });
      await auditService.log({ userId: requester?.id, action: `Criou pagamento ${payment.id}`, targetType: 'payment', targetId: payment.id });
      return res.status(201).json(payment);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { sectorId, from, to } = req.query as any;
      const payments = await this.service.list({ sectorId, from, to });
      return res.json(payments);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const payment = await this.service.get(req.params.id);
      if (!payment) return res.status(404).json({ error: 'Not found' });
      return res.json(payment);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await this.service.update(req.params.id, req.body);
      await auditService.log({ userId: (req as any).user?.id, action: `Atualizou pagamento ${updated.id}`, targetType: 'payment', targetId: updated.id });
      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const removed = await this.service.remove(req.params.id);
      await auditService.log({ userId: (req as any).user?.id, action: `Deletou pagamento ${req.params.id}`, targetType: 'payment', targetId: req.params.id });
      return res.json({ success: true, removed });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export const paymentsController = new PaymentsController();
