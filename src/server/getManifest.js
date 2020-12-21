/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable keyword-spacing */
import fs from 'fs';

const getManifest = () => {
    try{
        return JSON.parse(fs.readFileSync(`${__dirname}/public/manifest.json`));
    } catch (error) {
        console.log(error);
    }
};

export default getManifest;