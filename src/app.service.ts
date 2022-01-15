import { Injectable } from '@nestjs/common';
import {Data, DataSchema} from "./schemas/data.schema";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class AppService {
    constructor(
        @InjectModel(Data.name) private dataModel: Model<DataSchema>,
    ) {
    }

    async saveData(value, node): Promise<string> {
        const doc = new this.dataModel({value, node});
        await doc.save();
        return doc.id
    }
}
