import express, { Router } from 'express';
import subdomain from 'express-subdomain';
import logger from '../logger';

const wupRouter: Router = express.Router();

const ecsRouter: Router = express.Router();
const iasRouter: Router = express.Router();
const ccsRouter: Router = express.Router();
const ccsCdnRouter: Router = express.Router();

const wup = {
    ECOMMERCE: require('./ecs'),
	IDENTIFY_AUTHENTICATION: require('./ias'),
	CCS: require('./ccs'),
	CCS_CDN: require('./ccs-cdn')
}

logger.info('[WUP] Creating \'ecs.wup.shop\' subdomain');
wupRouter.use(subdomain('ecs.wup.shop', ecsRouter));

logger.info('[WUP] Creating \'ias.wup.shop\' subdomain');
wupRouter.use(subdomain('ias.wup.shop', iasRouter));

logger.info('[WUP] Creating \'ccs.wup.shop\' subdomain');
wupRouter.use(subdomain('ccs.wup.shop', ccsRouter));

logger.info('[WUP] Creating \'ccs.cdn.wup.shop\' subdomain');
wupRouter.use(subdomain('ccs.cdn.wup.shop', ccsCdnRouter));

logger.info('[WUP] Applying routes');
ecsRouter.use('/ecs/services/ECommerceSOAP', wup.ECOMMERCE);
iasRouter.use('/ias/services/IdentityAuthenticationSOAP', wup.IDENTIFY_AUTHENTICATION);
ccsRouter.use('/ccs', wup.CCS);
ccsCdnRouter.use('/ccs', wup.CCS_CDN);

export default wupRouter;