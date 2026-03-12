import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact }           from './contact.entity';
import { ContactController } from './contact.controller';

@Module({
  imports:     [TypeOrmModule.forFeature([Contact])],
  controllers: [ContactController],
})
export class ContactModule {}