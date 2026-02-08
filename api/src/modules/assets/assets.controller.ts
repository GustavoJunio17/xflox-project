import { Request, Response } from 'express';
import { assetsService } from './assets.service';
import { filesRepository } from '../files/files.repository';
import { auditService } from '../../shared/services/audit.service';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export class AssetsController {
  private service = assetsService;

  async create(req: Request, res: Response) {
    try {
      const data: any = { ...req.body };
      if (data.purchaseDate) data.purchaseDate = new Date(data.purchaseDate);
      if (data.value !== undefined) data.value = parseFloat(data.value);
      if (req.file) {
        const uploadsDir = path.resolve('uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.join(uploadsDir, filename);
        if (req.file.mimetype.startsWith('image/')) {
          await sharp(req.file.buffer).jpeg({ quality: 70 }).toFile(filepath);
        } else {
          fs.writeFileSync(filepath, req.file.buffer);
        }
        const file = await filesRepository.create({ filename, path: filepath, mimetype: req.file.mimetype, size: req.file.size });
        data.invoiceId = file.id;
      }

      const asset = await this.service.create(data);
      await auditService.log({ userId: (req as any).user?.id, action: `Criou ativo ${asset.id}`, targetType: 'asset', targetId: asset.id });
      return res.status(201).json(asset);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const assets = await this.service.list();
      return res.json(assets);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const asset = await this.service.get(req.params.id);
      if (!asset) return res.status(404).json({ error: 'Not found' });
      return res.json(asset);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await this.service.update(req.params.id, req.body);
      await auditService.log({ userId: (req as any).user?.id, action: `Atualizou ativo ${updated.id}`, targetType: 'asset', targetId: updated.id });
      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const removed = await this.service.remove(req.params.id);
      await auditService.log({ userId: (req as any).user?.id, action: `Deletou ativo ${req.params.id}`, targetType: 'asset', targetId: req.params.id });
      return res.json({ success: true, removed });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export const assetsController = new AssetsController();
