import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Tool } from "./Tool"; // On aura besoin d'importer Tool pour la liaison

@Entity({ name: "categories" })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    // Optionnel mais pratique : la relation inverse (Une catégorie a plusieurs outils)
    @OneToMany(() => Tool, (tool) => tool.categoryId)
    tools: Tool[];
}