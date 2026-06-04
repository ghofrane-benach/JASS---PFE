// backend/src/audit/audit.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from './audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async log(params: {
    adminId?:    string;
    adminEmail?: string;
    action:      AuditAction;
    targetId?:   string;
    targetType?: string;
    details?:    Record<string, any>;
  }) {
    const log = this.auditRepo.create({
      adminId:    params.adminId,
      adminEmail: params.adminEmail,
      action:     params.action,
      targetId:   params.targetId,
      targetType: params.targetType,
      details:    params.details ?? {},
    });
    await this.auditRepo.save(log);
  }

  async findAll() {
    return this.auditRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findByAdmin(adminId: string) {
    return this.auditRepo.find({
      where: { adminId },
      order: { createdAt: 'DESC' },
    });
  }
}