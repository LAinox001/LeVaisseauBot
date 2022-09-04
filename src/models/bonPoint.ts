import {AbstractIdentifier} from "./generic/abstractIdentifier";
import {Column, CreateDateColumn} from "typeorm";

export class BonPoint extends AbstractIdentifier {
    @Column()
    userId: string;

    @Column()
    reason: string;

    @CreateDateColumn()
    date: Date;
    
    @Column()
    imageName: string;
}