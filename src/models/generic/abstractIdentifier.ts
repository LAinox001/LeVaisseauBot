import {PrimaryGeneratedColumn} from "typeorm";

export abstract class AbstractIdentifier {
    @PrimaryGeneratedColumn()
    id: number;
}