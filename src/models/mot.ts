import {Entity, Column, CreateDateColumn} from "typeorm";
import {AbstractIdentifier} from "./generic/abstractIdentifier";

@Entity("mots")
export class Mot extends AbstractIdentifier {
    @Column()
    userId: string;

    @Column()
    mot: string;

    @CreateDateColumn()
    date: Date;
}