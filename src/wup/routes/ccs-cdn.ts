import express, { Request, Response, Router } from 'express';
import path from 'path';
import logger from '../../logger';

const router: Router = express.Router();

router.get('/download/:titleId/:file', (request: Request, response: Response): void => {
	const { titleId, file } = request.params;
	const titleType = titleId.substring(0, 8);
	let titlePath = `${__dirname}/../../../titles/wup`;
	let filePath: string;

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

	if (file.endsWith('.h3')) {
		filePath = `${titlePath}/${file}`;
	} else {
		filePath = `${titlePath}/${file}.app`;
	}

	if (filePath) {
		response.sendFile(path.resolve(filePath), (err) => {
			if (err) {
				logger.error(`Error sending file: ${err}`);
				response.status(500).send('Error sending file');
			}
		});
	} else {
		response.status(404).send('File not found');
	}
});

export default router;