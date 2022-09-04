import {AbstractIdentifier} from "./generic/abstractIdentifier";
import {Column, Entity, JoinColumn, OneToOne} from "typeorm";
import {BonPoint} from "./bonPoint";

@Entity("images")
export class Image extends AbstractIdentifier {
    @Column({ unique: true })
    name: string;

    @Column()
    owned: boolean;

    @Column({ nullable: true })
    userId: string;
}