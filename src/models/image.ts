import {AbstractIdentifier} from "./generic/abstractIdentifier";
import {Column, Entity} from "typeorm";

@Entity("images")
export class Image extends AbstractIdentifier {
    @Column({ unique: true })
    name: string;

    @Column()
    collection: string;

    @Column()
    number: number;

    @Column({ nullable: true })
    userId: string;
}