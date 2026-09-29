import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Provider } from './provider.entity.js';

@Entity('business_hours')
export class BusinessHour {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Provider, provider => provider.business_hours, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @Column()
  day_of_week: string; // e.g., 'Monday', 'Tuesday'

  @Column({ type: 'time', nullable: true })
  open_time: string;

  @Column({ type: 'time', nullable: true })
  close_time: string;

  @Column({ default: false })
  is_closed: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
