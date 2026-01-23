import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "./Category";

@Entity({ name: "tools" })
export class Tool {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @Column({ nullable: true })
    vendor!: string;

    @Column({ name: "website_url", nullable: true })
    websiteUrl!: string;

    @Column({ name: "category_id" })
    categoryId!: number;

    @Column({ name: "monthly_cost", type: "decimal", precision: 10, scale: 2 })
    monthlyCost!: number;

    @Column({ name: "active_users_count", default: 0 })
    activeUsersCount!: number;

    @Column({ name: "owner_department" })
    ownerDepartment!: string;

    @Column({
        type: "enum",
        enum: ["active", "deprecated", "trial"],
        default: "active"
    })
    status!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @ManyToOne(() => Category, (category) => category.tools)
    @JoinColumn({ name: "category_id" })
    category: Category;
}