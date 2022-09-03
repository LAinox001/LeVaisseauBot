import { Entity, Column } from "typeorm";
import {AbstractIdentifier} from "./generic/abstractIdentifier";

@Entity("scores")
export class Score extends AbstractIdentifier {
    @Column({ unique: true })
    userId: string;

    @Column()
    score: number;

    @Column()
    responded: boolean;
}