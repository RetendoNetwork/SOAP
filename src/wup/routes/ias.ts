import express, { Request, Response } from 'express';
import xmlbuilder from 'xmlbuilder';
import logger from '../../logger';

const router = express.Router();

router.post('/', (request: Request, response: Response) => {
    const action = request.headers.soapaction?.split('/').pop();
    const requestBody = request.body as { [key: string]: any };
    const body = requestBody['SOAP-ENV:Envelope']['SOAP-ENV:Body'];

    logger.info(body);
    console.log('[WUP - IAS]', action);

    response.set('Content-Type', 'text/xml');

    let actionResponse: any;
    let data: any;

    switch (action) {
        case 'GetChallenge':
            data = body['ecs:GetChallenge'];

            actionResponse = {
                'soapenv:Envelope': {
                    '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
                    '@xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
                    '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',

                    'soapenv:Body': {
                        GetChallengeResponse: {
                            '@xmlns': 'urn:ecs.wsapi.broadon.com',

                            Version: '2.0',
                            DeviceId: data['ecs:DeviceId'],
                            MessageId: `EC-${data['ecs:DeviceId']}-3038380129`,
                            TimeStamp: Date.now(),
                            ErrorCode: '0',
                            ServiceStandbyMode: 'false',
                            Challenge: '123456789',
                        },
                    },
                },
            };
            break;

        default:
            logger.warn('[WUP - IAS] Unhandled SOAP action ' + action);
            break;
    }

    if (actionResponse) {
        response.send(xmlbuilder.create(actionResponse).end({ pretty: true }));
    } else {
        response.status(404).send('Not Found');
    }
});

export default router;