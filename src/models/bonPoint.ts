import {AbstractIdentifier} from "./generic/abstractIdentifier";
import {Column, CreateDateColumn, Entity} from "typeorm";

@Entity("bon_points")
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