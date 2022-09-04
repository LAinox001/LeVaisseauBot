import {AbstractIdentifier} from "./generic/abstractIdentifier";
import {Column, Entity} from "typeorm";

@Entity("images")
export class Image extends AbstractIdentifier {
    @Column({ unique: true })
    name: string;

    @Column()
    owned: boolean;

    @Column({ nullable: true })
    userId: string;
}