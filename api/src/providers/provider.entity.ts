import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity.js';
import { Service } from './service.entity.js';
import { PortfolioPost } from './portfolio-post.entity.js';
import { BusinessHour } from './business-hour.entity.js';

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.providerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 255 })
  business_name: string;

  @Column({ length: 50 })
  category: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  // For PostGIS geolocation
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: string; // TypeORM handles the translation to/from PostGIS format

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  is_online: boolean;

  @Column({ type: 'numeric', precision: 3, scale: 2, default: 0.00 })
  avg_rating: number;

  @Column({ type: 'int', default: 0 })
  rating_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Service, service => service.provider, { cascade: true })
  services: Service[];

  @OneToMany(() => PortfolioPost, post => post.provider, { cascade: true })
  portfolio: PortfolioPost[];

  @OneToMany(() => BusinessHour, hour => hour.provider, { cascade: true })
  business_hours: BusinessHour[];
}
