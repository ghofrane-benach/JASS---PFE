
import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact, ContactStatus } from './contact.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard }   from '../auth/guards/admin.guard';

@Controller('contacts')
export class ContactController {
  constructor(
    @InjectRepository(Contact)
    private readonly repo: Repository<Contact>,
  ) {}

  // POST /contacts — public, appelé par le formulaire client
  @Post()
  async create(@Body() body: { name?: string; email: string; reason: string; message: string }) {
    const contact = this.repo.create({
      name:    body.name    ?? '',
      email:   body.email,
      reason:  body.reason,
      message: body.message,
    });
    await this.repo.save(contact);
    return { success: true };
  }

  // GET /contacts — admin seulement
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  // PATCH /contacts/:id/status — admin : marquer lu / répondu
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ContactStatus,
  ) {
    await this.repo.update(id, { status });
    return this.repo.findOne({ where: { id } });
  }
}

