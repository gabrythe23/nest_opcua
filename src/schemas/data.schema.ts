import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from "mongoose";

export type DataSchema = Data & Document;

@Schema({timestamps: true})
export class Data {
    @Prop({type: Number})
    value: Number;
    @Prop({type: String})
    node: String;
}

export const DataSchema = SchemaFactory.createForClass(Data);
