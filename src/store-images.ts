import {AppDataSource} from "./database";
import * as cron from "node-cron";
import * as fs from "fs";
import {Image} from "./models/image";
import config from "./consts/config";

cron.schedule("*/1 * * * *", async () => {
    const datasource = await AppDataSource.getInstance();
    const imageRepository = datasource.getRepository(Image);
    const imagesInDb = await imageRepository.find();
    fs.readdir(config.ROOT_DIRECTORY + "images", (err, files) => {
        files.forEach(async file => {
            if(imagesInDb.find(image => image.name === file) == null) {
                const image = new Image();
                image.name = file;
                image.owned = false;
                await imageRepository.save(image);
                return console.log(file + " saved to DB");
            }
        });
    });
    return;
}, {
    timezone: "Europe/Paris"
});