import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('order_item_modifiers')
export class OrderItemModifier {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    orderItemId: string;

    @Column()
    modifierId: string;

    @Column()
    modifierName: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    extraPrice: number;

    @CreateDateColumn()
    createdAt: Date;
}