import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { Provider } from './provider.entity.js';

@Entity('portfolio_posts')
export class PortfolioPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Provider', (provider: Provider) => provider.portfolio, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @Column()
  image_url: string;

  @Column({ nullable: true })
  service_tag: string;

  @Column({ type: 'text', nullable: true })
  caption: string;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'int', default: 0 })
  comments: number;

  @Column({ type: 'json', nullable: true })
  comments_list: any;

  @Column({ type: 'numeric', precision: 3, scale: 2, nullable: true })
  rating: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
