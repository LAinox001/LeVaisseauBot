import {Column, PrimaryGeneratedColumn} from "typeorm";

export abstract class AbstractIdentifier {
    @PrimaryGeneratedColumn()
    id: number;
}