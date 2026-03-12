import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum DayOfWeek {
    SUNDAY = 'sunday',
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
}

@Entity('working_hours')
export class WorkingHours {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    branchId: string;

    @Column({ type: 'enum', enum: DayOfWeek })
    day: DayOfWeek;

    @Column({ type: 'time' })
    openTime: string;

    @Column({ type: 'time' })
    closeTime: string;

    @Column({ default: true })
    isOpen: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}