import { EditingRenderMiddleware } from '@sitecore-content-sdk/nextjs/editing';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * This Next.js API route is used to handle GET requests from Sitecore Editor.
 * This route should match the `serverSideRenderingEngineEndpointUrl` in your Sitecore configuration,
 * which is set to "http://<rendering_host>/api/editing/render" by default (see the settings item under /sitecore/content/<your/site/path>/Settings/Site Grouping).
 *
 * The `EditingRenderMiddleware` will
 *  1. Extract data about the route we need to render from the Sitecore Editor GET request
 *  2. Enable Next.js Preview Mode, passing the route data as preview data
 *  3. Redirect the request to the route, passing along the Preview Mode cookies.
 *     This allows retrieval of the editing data in preview context (via an `EditingDataService`) - see `SitecorePagePropsFactory`
 *  4. The redirected request will render the page with editing markup in place
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
    responseLimit: false,
  },
};

// Wire up the EditingRenderMiddleware handler.
const editingRenderHandler = new EditingRenderMiddleware().getHandler();
type EditingRenderRequest = Parameters<typeof editingRenderHandler>[0];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await editingRenderHandler(req as EditingRenderRequest, res);
    return;
  } catch (error) {
    // Node/Next runtime differences can break preview token generation in local dev.
    // Fall back to a route redirect so the app remains usable while styling.
    console.error('Editing render middleware failed', error);
    const route = typeof req.query.route === 'string' ? req.query.route : '/';
    res.redirect(307, route);
    return;
  }
}
