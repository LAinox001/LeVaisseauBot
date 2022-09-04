import AppDataSource from "./database";
import * as cron from "node-cron";
import * as fs from "fs";
import {Image} from "./models/image";

cron.schedule("*/1 * * * *", async () => {
    const datasource = await AppDataSource;
    const imageRepository = datasource.getRepository(Image);
    const imagesInDb = await imageRepository.find();
    fs.readdir("src/images", (err, files) => {
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
}, {
    timezone: "Europe/Paris"
});