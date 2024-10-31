import express, { Request, Response, Router } from 'express';
import path from 'path';
import logger from '../../logger';

const router: Router = express.Router();

router.get('/download/:titleId/:file', (request: Request, response: Response): void => {
    const { titleId, file } = request.params;
    const titleType = titleId.substring(0, 8);
    let titlePath = `${__dirname}/../../../titles/wup`;
    let filePath: string | undefined;

    switch (titleType) {
        case '0005000C':
            titlePath = `${titlePath}/aoc/${titleId}`;
            break;

        case '0005000E':
            titlePath = `${titlePath}/patch/${titleId}`;
            break;

        case '00050000':
            titlePath = `${titlePath}/title/${titleId}`;
            break;

        default:
            logger.info(`Unknown title ID type ${titleId}`);
            response.status(404).send('Not Found');
            return;
    }

    if (file.startsWith('tmd')) {
        filePath = `${titlePath}/title.tmd`;
    } else {
        response.status(404).send('Not Found');
        return;
    }

    if (filePath) {
        response.sendFile(path.resolve(filePath), (err) => {
            if (err) {
                logger.error(`Error sending file: ${err}`);
                response.status(500).send('Error sending file');
            }
        });
    }
});

export default router;