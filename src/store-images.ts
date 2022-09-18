import {AppDataSource} from "./database";
import * as cron from "cron";
import * as fs from "fs";
import {Image} from "./models/image";
import config from "./consts/config";

const cronJob = new cron.CronJob("*/1 * * * *", async () => {
    const datasource = await AppDataSource.getInstance();
    const imageRepository = datasource.getRepository(Image);
    const imagesInDb = await imageRepository.find();
    fs.readdir(config.ROOT_DIRECTORY + "images", (err, files) => {
        files.forEach(async file => {
            if(imagesInDb.find(image => image.name === file) == null) {
                const fileNameSplit = file.split("-");
                const collectionName = fileNameSplit[0];
                const imageNumber = parseInt(fileNameSplit[1]);

                const image = new Image();
                image.name = file;
                image.collection = collectionName;
                image.number = imageNumber;
                await imageRepository.save(image);
                return console.log(file + " saved to DB");
            }
        });
    });
    return;
});

cronJob.start();